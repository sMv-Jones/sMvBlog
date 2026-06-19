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
        <div className="w-full max-w-6xl mx-auto my-6 px-4 text-white">
            <form 
                onSubmit={handleSubmit(submit)} 
                className="grid grid-cols-1 lg:grid-cols-3 gap-8 rounded-3xl border border-white/10 bg-black/60 backdrop-blur-2xl shadow-2xl p-6 md:p-10"
            >
                {/* Left Side Elements */}
                <div className="lg:col-span-2 space-y-6">
                    <Input
                        label="Title :"
                        placeholder="Title"
                        className="w-full bg-black/30 border border-white/10 rounded-xl focus:border-blue-500   transition focus:ring-1 focus:ring-blue-500"
                        {...register("title", { required: true })}
                    />
                    <Input
                        label="Slug :"
                        placeholder="Slug"
                        className="w-full bg-black/50 border border-white/10 rounded-xl focus:border-blue-500 transition focus:ring-1 focus:ring-blue-500 font-mono font-bold text-sm text-blue-900/100"
                        {...register("slug", { required: true })}
                        onInput={(e) => {
                            setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                        }}
                    />
                    <div className="rounded-2xl overflow-hidden border border-white/10 bg-black/20 p-1">
                        <TextEditor label="Content :" name="content" control={control} defaultValue={getValues("content")} />
                    </div>
                </div>

                {/* Right Side Elements */}
                <div className="space-y-6 lg:border-l lg:border-white/10 lg:pl-8 flex flex-col justify-between">
                    <div className="space-y-6">
                        <Input
                            label="Featured Image :"
                            type="file"
                            className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-600/20 file:text-blue-400 hover:file:bg-blue-600/30 file:cursor-pointer"
                            accept="image/png, image/jpg, image/jpeg, image/gif"
                            {...register("image", { required: !post })} // Image required only for new posts
                        />
                        {post?.featuredImage && (
                            <div className="w-full rounded-2xl overflow-hidden border border-white/10 bg-black/40 shadow-md">
                                <img
                                    src={post.featuredImage} // The direct cloud URL from your Express DB
                                    alt={post.title}
                                    className="w-full aspect-video object-cover"
                                />
                            </div>
                        )}
                        <Select
                            options={["active", "inactive"]}
                            label="Status"
                            className="w-full bg-black/30 border border-white/10 rounded-xl focus:border-blue-500 transition"
                            {...register("status", { required: true })}
                        />
                    </div>

                    <div className="pt-6 border-t border-white/10 lg:border-0 lg:pt-0">
                        <Button 
                            type="submit" 
                            bgColor={post ? "bg-green-500" : undefined} 
                            className="w-full py-3 rounded-xl font-semibold tracking-wide shadow-lg hover:scale-105 transition duration-200 cursor-pointer"
                        >
                            {post ? "Update" : "Submit"}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}