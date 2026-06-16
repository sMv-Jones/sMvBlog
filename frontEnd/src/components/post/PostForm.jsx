import { useCallback, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button, Input, TextEditor, Select } from "../../components/index";
import postService from "../../services/post"; // Using the new Express postService instance

export default function PostForm({ post }) {
    const { register, handleSubmit, setValue, control, getValues } = useForm({
        defaultValues: {
            title: post?.title ?? "",
            slug: post?.slug ?? "", // Changed from post?._id to post?.slug to match your Express routing
            content: post?.content ?? "",
            status: post?.status ?? "active",
        },
    });

    const navigate = useNavigate();

    // Watch ONLY the title field to automatically generate slug values
    const titleValue = useWatch({
        control,
        name: "title",
    });

    const submit = async (data) => {
        try {
            const payload = {
                title: data.title,
                slug: data.slug,
                content: data.content,
                status: data.status,
                imageFile: data.image?.[0] || null, // Extract the actual File object
            };

            let dbPost;

            if (post) {
                // If editing, use updatePost service method requiring slug as primary identifier
                dbPost = await postService.updatePost(post.slug, payload);
            } else {
                // If creating, pass full payload object directly 
                dbPost = await postService.createPost(payload);
            }

            if (dbPost) {
                // Redirecting to post detail page using new slug matching schema format
                // Note: Fallback checks handle variations if your Express server answers with a slug or an _id tracking key
                const targetSlug = dbPost.slug || dbPost.data?.slug || post?.slug;
                navigate(`/post/${targetSlug}`);
            }
        } catch (error) {
            console.error("Failed to submit post:", error);
        }
    };

    const slugTransform = useCallback((value) => {
        if (typeof value === "string") {
            return value
                .trim()
                .toLowerCase()
                .replace(/[^a-zA-Z\d\s]+/g, "-")
                .replace(/\s+/g, "-");
        }
        return "";
    }, []);

    // Hook monitoring titles changes to keep target text updates uniform
    useEffect(() => {
        if (titleValue) {
            setValue("slug", slugTransform(titleValue), { shouldValidate: true });
        }
    }, [titleValue, slugTransform, setValue]);

    return (
        <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
            <div className="w-2/3 px-2">
                <Input
                    label="Title :"
                    placeholder="Title"
                    className="mb-4"
                    {...register("title", { required: true })}
                />
                <Input
                    label="Slug :"
                    placeholder="Slug"
                    className="mb-4"
                    {...register("slug", { required: true })}
                    onInput={(e) => {
                        setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                    }}
                />
                <TextEditor label="Content :" name="content" control={control} defaultValue={getValues("content")} />
            </div>
            <div className="w-1/3 px-2">
                <Input
                    label="Featured Image :"
                    type="file"
                    className="mb-4"
                    accept="image/png, image/jpg, image/jpeg, image/gif"
                    {...register("image", { required: !post })} // Image required only for new posts
                />
                {post?.featuredImage && (
                    <div className="w-full mb-4">
                        <img
                            src={post.featuredImage} // The direct cloud URL from your Express DB
                            alt={post.title}
                            className="rounded-lg"
                        />
                    </div>
                )}
                <Select
                    options={["active", "inactive"]}
                    label="Status"
                    className="mb-4"
                    {...register("status", { required: true })}
                />
                <Button type="submit" bgColor={post ? "bg-green-500" : undefined} className="w-full">
                    {post ? "Update" : "Submit"}
                </Button>
            </div>
        </form>
    );
}