import React, { useCallback, useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Button, Input, RTE, Select } from "..";
import appwriteService from "../../appwrite/config";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Send, Upload, Image as ImageIcon, AlertCircle } from "lucide-react";

export default function PostForm({ post }) {
    const { register, handleSubmit, setValue, control, getValues } = useForm({
        defaultValues: {
            title: post?.title || "",
            slug: post?.$id || post?.slug || "",
            content: post?.content || "",
            status: post?.status || "active",
        },
    });

    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);
    const [submitting, setSubmitting] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(
        post?.featuredImage ? appwriteService.getFilePreview(post.featuredImage) : ""
    );
    const [error, setError] = useState("");

    const slugTransform = useCallback((value) => {
        if (value && typeof value === "string")
            return value
                .trim()
                .toLowerCase()
                .replace(/[^a-zA-Z0-9 -]/g, "")
                .replace(/\s+/g, "-")
                .replace(/-+/g, "-");

        return "";
    }, []);

    const titleValue = useWatch({ control, name: "title" });

    useEffect(() => {
        if (titleValue) {
            setValue("slug", slugTransform(titleValue), { shouldValidate: true });
        }
    }, [titleValue, slugTransform, setValue]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const submit = async (data) => {
        setError("");
        setSubmitting(true);
        try {
            let fileId = post?.featuredImage || "";

            if (data.image && data.image[0]) {
                const file = await appwriteService.uploadFile(data.image[0]);
                if (file) {
                    if (post?.featuredImage) {
                        appwriteService.deleteFile(post.featuredImage);
                    }
                    fileId = file.$id;
                } else {
                    // Fallback preview URL as fileId string if direct upload didn't return an $id
                    fileId = previewUrl || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop&q=80";
                }
            }

            if (!fileId) {
                fileId = "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop&q=80";
            }

            if (post) {
                const dbPost = await appwriteService.updatePost(post.$id, {
                    ...data,
                    featuredImage: fileId,
                });

                if (dbPost) {
                    navigate(`/post/${dbPost.$id}`);
                    return;
                }
            } else {
                const slug = data.slug || slugTransform(data.title) || "new-post-article";
                const dbPost = await appwriteService.createPost({
                    ...data,
                    slug,
                    featuredImage: fileId,
                    userId: userData?.$id || "anonymous-author",
                });

                if (dbPost) {
                    navigate(`/post/${dbPost.$id}`);
                    return;
                }
            }

            // Fallback for demo session storage if Appwrite backend is unconfigured
            const fallbackSlug = data.slug || slugTransform(data.title) || "new-post-article";
            const fallbackPost = {
                $id: post?.$id || fallbackSlug,
                title: data.title,
                content: data.content,
                featuredImage: previewUrl || fileId,
                status: data.status || "active",
                userId: userData?.$id || "demo-user",
                $createdAt: post?.$createdAt || new Date().toISOString()
            };

            const localPosts = JSON.parse(localStorage.getItem('megablog_posts') || '[]');
            const existingIdx = localPosts.findIndex(p => p.$id === fallbackPost.$id);
            if (existingIdx >= 0) {
                localPosts[existingIdx] = fallbackPost;
            } else {
                localPosts.unshift(fallbackPost);
            }
            localStorage.setItem('megablog_posts', JSON.stringify(localPosts));

            navigate(`/post/${fallbackPost.$id}`);

        } catch (err) {
            console.error("Post submit error:", err);
            setError("Failed to save post. Please check form inputs.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(submit)} className="flex flex-wrap text-left gap-y-6">
            {error && (
                <div className="w-full p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-300 text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            <div className="w-full lg:w-2/3 lg:pr-4 space-y-5">
                <Input
                    label="Post Title:"
                    placeholder="Enter engaging title"
                    className="text-lg font-semibold"
                    {...register("title", { required: true })}
                />
                <Input
                    label="Slug / URL ID:"
                    placeholder="auto-generated-slug"
                    {...register("slug", { required: true })}
                    onInput={(e) => {
                        setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                    }}
                />
                <div>
                    <RTE label="Content:" name="content" control={control} defaultValue={getValues("content")} />
                </div>
            </div>

            <div className="w-full lg:w-1/3 lg:pl-4 space-y-5">
                <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-5">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-700/60 pb-3 flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-indigo-500" />
                        Featured Image &amp; Settings
                    </h3>

                    <div>
                        <label className="inline-block mb-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
                            Upload Cover Image:
                        </label>
                        <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-4 text-center hover:border-indigo-500 transition-colors cursor-pointer bg-slate-50 dark:bg-slate-900/50">
                            <input
                                type="file"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                accept="image/png, image/jpg, image/jpeg, image/gif, image/webp"
                                {...register("image", { required: !post })}
                                onChange={(e) => {
                                    register("image").onChange(e);
                                    handleImageChange(e);
                                }}
                            />
                            <div className="flex flex-col items-center justify-center gap-1.5 text-slate-500 dark:text-slate-400">
                                <Upload className="w-6 h-6 text-indigo-500" />
                                <span className="text-xs font-medium">Click or drag image file here</span>
                                <span className="text-[10px] text-slate-400">PNG, JPG, GIF up to 5MB</span>
                            </div>
                        </div>
                    </div>

                    {previewUrl && (
                        <div className="w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 aspect-video relative group">
                            <img
                                src={previewUrl}
                                alt="Post Preview"
                                className="w-full h-full object-cover"
                            />
                            <span className="absolute bottom-2 right-2 text-[10px] bg-slate-900/80 text-white px-2 py-0.5 rounded-full backdrop-blur-sm">
                                Preview
                            </span>
                        </div>
                    )}

                    <Select
                        options={["active", "inactive"]}
                        label="Publishing Status:"
                        {...register("status", { required: true })}
                    />

                    <Button
                        type="submit"
                        bgColor={post ? "bg-emerald-600 hover:bg-emerald-500" : "bg-indigo-600 hover:bg-indigo-500"}
                        className="w-full text-base font-semibold py-3"
                        disabled={submitting}
                    >
                        {submitting ? (
                            "Saving post..."
                        ) : (
                            <>
                                <Send className="w-4 h-4" />
                                {post ? "Update Article" : "Publish Article"}
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </form>
    );
}
