import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import postService from "../../services/post";
import { Button, Container } from "../../components/index";
import parse from "html-react-parser";
import { useSelector } from "react-redux";

export default function Post() {
    const [post, setPost] = useState(null);
    const { slug } = useParams();
    const navigate = useNavigate();

    const userData = useSelector((state) => state.auth);

    const getAuthorId = (postObj) => {
        if (!postObj?.userId) return null;
        return typeof postObj.userId === "object"
            ? postObj.userId._id || postObj.userId.id
            : postObj.userId;
    };

    const currentUserId = userData?.user;
    const postAuthorId = getAuthorId(post);

    const isAuthor =
        postAuthorId && currentUserId
            ? String(postAuthorId) === String(currentUserId)
            : false;

    useEffect(() => {
        if (slug) {
            postService
                .getPost(slug)
                .then((response) => {
                    const postData = response?.data || response;
                    if (postData) {
                        setPost(postData);
                    } else {
                        navigate("/");
                    }
                })
                .catch(() => navigate("/"));
        } else {
            navigate("/");
        }
    }, [slug, navigate]);

    const handleDeletePost = () => {
        const identifier = post.slug || post._id;

        postService.deletePost(identifier).then((success) => {
            if (success) navigate("/");
        });
    };

    return post ? (
        <div className="min-h-screen py-10 px-4">
            <Container>

                {/* HERO CARD */}
                <div className="max-w-5xl mx-auto rounded-3xl border border-white/10 bg-black/60 backdrop-blur-2xl shadow-2xl p-5 md:p-8">

                    <div className="flex flex-col md:flex-row gap-6 items-center">

                        {/* IMAGE */}
                        <div className="shrink-0">
                            <img
                                src={post.featuredImage}
                                alt={post.title}
                                className="w-full md:w-72 aspect-square object-cover rounded-2xl border border-white/10 shadow-[0_0_25px_rgba(255,255,255,0.25)]"
                            />
                        </div>

                        {/* TITLE + BUTTONS */}
                        <div className="flex-1 text-center md:text-left">

                            <h1 className="
                                text-xl sm:text-2xl md:text-5xl lg:text-6xl
                                font-extrabold
                                text-white
                                leading-tight
                            ">
                                {post.title}
                            </h1>

                            <div className="h-px bg-white/100 my-5"></div>

                            {isAuthor && (
                                <div className="flex gap-3 justify-center md:justify-start">
                                    <Link to={`/edit-post/${post.slug || post._id}`}>
                                        <Button
                                            bgColor="bg-green-500"
                                            className="px-5 py-2 rounded-xl hover:scale-105 transition"
                                        >
                                            Edit
                                        </Button>
                                    </Link>

                                    <Button
                                        bgColor="bg-red-500"
                                        className="px-5 py-2 rounded-xl hover:scale-105 transition"
                                        onClick={handleDeletePost}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* CONTENT CARD */}
                <div className="max-w-5xl mx-auto mt-8 rounded-3xl border border-white/10 bg-black/50 backdrop-blur-xl p-6 md:p-10 shadow-xl">

                    <div className="browser-css prose prose-invert max-w-none text-white/90">
                        {parse(post.content)}
                    </div>

                </div>

            </Container>
        </div>
    ) : null;
}