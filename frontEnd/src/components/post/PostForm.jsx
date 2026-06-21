import { useCallback, useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button, Input, TextEditor, Select } from "../../components/index";
import postService from "../../services/post";

export default function PostForm({ post }) {
    const [submitError, setSubmitError] = useState("");
    const navigate = useNavigate();

    const { register, handleSubmit, setValue, control, getValues, formState: { errors } } = useForm({
        defaultValues: {
            title: post?.title ?? "",
            slug: post?.slug ?? "",
            content: post?.content ?? "",
            status: post?.status ?? "active",
        },
    });

    const titleValue = useWatch({
        control,
        name: "title",
    });

    // Custom text validation to filter raw HTML wrappers and count genuine words
    const validateContentWords = (htmlContent) => {
        if (!htmlContent) return false;
        // Strip out HTML elements to read pure text values
        const cleanText = htmlContent.replace(/<[^>]*>/g, " ").trim();
        // Split text content by spaces and clear out any dead indexes
        const words = cleanText.split(/\s+/).filter(word => word.length > 0);
        return words.length >= 20;
    };

    const submit = async (data) => {
        setSubmitError(""); // Reset warnings

        // Verify content rules dynamically on submission context
        if (!validateContentWords(data.content)) {
            setSubmitError("Submission failed: Content must contain at least 20 real words.");
            return;
        }

        try {
            const payload = {
                title: data.title,
                slug: data.slug,
                content: data.content,
                status: data.status,
                imageFile: data.image?.[0] || null,
            };

            let dbPost;

            if (post) {
                dbPost = await postService.updatePost(post.slug, payload);
            } else {
                dbPost = await postService.createPost(payload);
            }

            if (dbPost) {
                const targetSlug = dbPost.slug || dbPost.data?.slug || post?.slug;
                navigate(`/post/${targetSlug}`);
            }
        } catch (error) {
            console.error("Failed to submit post:", error);
            setSubmitError("An error occurred while handling server requests.");
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
                    <div>
                        <Input
                            label="Title :"
                            placeholder="Title"
                            className="w-full bg-black/30 border border-white/10 rounded-xl focus:border-blue-500 transition focus:ring-1 focus:ring-blue-500"
                            {...register("title", { 
                                required: "Title is required",
                                validate: value => 
                                    (value.trim().replace(/[^a-zA-Z]/g, "").length >= 3) || 
                                    "Title must contain at least 3 alphabetical characters"
                            })}
                        />
                        {errors.title && (
                            <p className="mt-1.5 text-xs font-medium text-red-400 pl-1">{errors.title.message}</p>
                        )}
                    </div>

                    <div>
                        <Input
                            label="Slug :"
                            placeholder="Slug"
                            className="w-full bg-black/50 border border-white/10 rounded-xl focus:border-blue-500 transition focus:ring-1 focus:ring-blue-500 font-mono font-bold text-sm text-blue-400"
                            {...register("slug", { required: "Slug is required" })}
                            onInput={(e) => {
                                setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                            }}
                        />
                        {errors.slug && (
                            <p className="mt-1.5 text-xs font-medium text-red-400 pl-1">{errors.slug.message}</p>
                        )}
                    </div>

                    <div className="rounded-2xl overflow-hidden border border-white/10 bg-black/20 p-1">
                        <TextEditor label="Content :" name="content" control={control} defaultValue={getValues("content")} />
                    </div>
                </div>

                {/* Right Side Elements */}
                <div className="space-y-6 lg:border-l lg:border-white/10 lg:pl-8 flex flex-col justify-between">
                    <div className="space-y-6">
                        <div>
                            <Input
                                label="Featured Image :"
                                type="file"
                                className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-600/20 file:text-blue-400 hover:file:bg-blue-600/30 file:cursor-pointer"
                                accept="image/png, image/jpg, image/jpeg, image/gif"
                                {...register("image", { 
                                    required: !post ? "A featured image is required for new posts" : false 
                                })}
                            />
                            {errors.image && (
                                <p className="mt-1.5 text-xs font-medium text-red-400 pl-1">{errors.image.message}</p>
                            )}
                        </div>

                        {post?.featuredImage && (
                            <div className="w-full rounded-2xl overflow-hidden border border-white/10 bg-black/40 shadow-md">
                                <img
                                    src={post.featuredImage}
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

                    {/* DYNAMIC WARNING DISPLAY CONTAINER */}
                    <div className="pt-6 border-t border-white/10 lg:border-0 lg:pt-0 space-y-4">
                        {submitError && (
                            <div className="p-3.5 text-sm font-semibold text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl text-center">
                                {submitError}
                            </div>
                        )}

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