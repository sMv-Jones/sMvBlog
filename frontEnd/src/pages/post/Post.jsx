import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import postService from "../../services/post";
import { Button, Container } from "../../components/index";
import parse from "html-react-parser";
import { useSelector } from "react-redux";

export default function Post() {
    const [post, setPost] = useState(null);
    const [copied, setCopied] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false); // State for the confirmation modal
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

    const handleCopyUsername = (e) => {
        e.preventDefault();
        if (!userName) return;
        
        navigator.clipboard.writeText(userName).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const displayName = post?.displayName || post?.userId?.displayName;
    const userName = post?.userName || post?.userId?.userName;

    const getTitleWords = (titleString) => {
        if (!titleString) return [];
        return titleString.trim().split(/\s+/);
    };

    const titleWords = getTitleWords(post?.title);
    const isLongTitle = titleWords.length > 5;

    const displayedTitle = titleWords.length <= 10 
        ? post?.title 
        : titleWords.slice(0, 10).join(" ") + "...";

    return post ? (
        <div className="min-h-screen py-10 px-4 relative">
            <Container>

                {/* HERO CARD */}
                <div className={`max-w-5xl mx-auto rounded-3xl p-5 md:p-8 border backdrop-blur-2xl transition-all duration-300 shadow-2xl relative overflow-hidden ${
                    isAuthor 
                        ? "border-white/20 bg-zinc-900/70 shadow-[0_0_50px_rgba(255,255,255,0.05)]" 
                        : "border-white/10 bg-black/60"
                }`}>

                    <div className="flex flex-col md:flex-row gap-6 items-center">

                        {/* IMAGE */}
                        <div className="shrink-0">
                            <img
                                src={post.featuredImage}
                                alt={post.title}
                                className={`w-full md:w-72 aspect-square object-cover rounded-2xl border transition-all duration-300 ${
                                    isAuthor
                                        ? "border-white/30 shadow-[0_0_30px_rgba(255,255,255,0.15)]"
                                        : "border-white/10 shadow-[0_0_25px_rgba(255,255,255,0.25)]"
                                }`}
                            />
                        </div>

                        {/* TITLE + AUTHOR + BUTTONS */}
                        <div className="flex-1 text-center md:text-left min-w-0 w-full">

                            <h1 className={`
                                font-extrabold
                                text-white
                                leading-tight
                                break-words
                                transition-all duration-200
                                ${isLongTitle 
                                    ? "text-lg sm:text-xl md:text-2xl lg:text-3xl" 
                                    : "text-xl sm:text-2xl md:text-5xl lg:text-6xl"
                                }
                            `}>
                                {displayedTitle}
                            </h1>

                            {!isAuthor && displayName && (
                                <div className="mt-4 flex flex-wrap items-center justify-center md:justify-start gap-x-3 gap-y-2 text-base sm:text-lg">
                                    <span className="text-white/60 font-medium tracking-wide">
                                        By <span className="text-white font-bold">{displayName}</span>
                                    </span>
                                    
                                    {userName && (
                                        <div className="flex items-center gap-2 bg-black/20 border border-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                                            <Link 
                                                to={`/profile/${userName}`}
                                                className="relative inline-block text-white/90 font-semibold tracking-wide text-sm sm:text-base transition-all duration-300 ease-in-out hover:text-white after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[1px] after:bg-white hover:after:w-full after:transition-all after:duration-300"
                                            >
                                                @{userName}
                                            </Link>

                                            <button
                                                onClick={handleCopyUsername}
                                                className={`text-xs ml-1 px-2 py-0.5 rounded-md font-medium transition-all duration-200 ${
                                                    copied 
                                                        ? "bg-green-500/20 text-green-400 border border-green-500/30" 
                                                        : "bg-white/10 text-white/60 hover:text-white hover:bg-white/20"
                                                }`}
                                                title="Copy username"
                                            >
                                                {copied ? "Copied!" : "Copy"}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="h-px bg-white/10 my-5"></div>

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

                                    {/* Triggers confirmation modal instead of immediate execution */}
                                    <Button
                                        bgColor="bg-red-500"
                                        className="px-5 py-2 rounded-xl hover:scale-105 transition"
                                        onClick={() => setShowConfirm(true)}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* CONTENT CARD */}
                <div className={`max-w-5xl mx-auto mt-8 rounded-3xl border backdrop-blur-xl p-6 md:p-10 shadow-xl transition-all duration-300 ${
                    isAuthor ? "border-white/15 bg-zinc-900/50" : "border-white/10 bg-black/50"
                }`}>
                    <div className="browser-css prose prose-invert max-w-none text-white/90">
                        {parse(post.content)}
                    </div>
                </div>

            </Container>

            {/* CONFIRMATION POPUP BOX */}
            {showConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md transition-all duration-300 animate-fadeIn">
                    <div className="w-full max-w-md rounded-3xl border border-white/20 bg-zinc-950/90 p-6 md:p-8 shadow-[0_0_50px_rgba(0,0,0,0.8)] text-center transform scale-100 transition-all duration-300 animate-scaleUp">
                        
                        <h3 className="text-xl md:text-2xl font-extrabold text-white tracking-wide">
                            Delete Post?
                        </h3>
                        
                        <p className="mt-3 text-white/60 text-sm md:text-base leading-relaxed">
                            Are you sure you want to delete <span className="text-white font-semibold">"{displayedTitle}"</span>? This action cannot be undone.
                        </p>

                        <div className="h-px bg-white/10 my-6"></div>

                        <div className="flex gap-4 justify-center">
                            <Button
                                bgColor="bg-zinc-800"
                                className="px-5 py-2.5 rounded-xl border border-white/10 text-white/80 hover:text-white hover:bg-zinc-700 hover:scale-105 transition flex-1"
                                onClick={() => setShowConfirm(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                bgColor="bg-red-500"
                                className="px-5 py-2.5 rounded-xl hover:scale-105 transition shadow-[0_0_20px_rgba(239,68,68,0.2)] flex-1"
                                onClick={handleDeletePost}
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    ) : null;
}