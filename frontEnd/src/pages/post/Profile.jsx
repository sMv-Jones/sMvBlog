import { Container } from "../../components/index";
import postServices from "../../services/post";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from 'react-router-dom';
import { PostCard } from "../../components/index";
import authService from "../../services/auth";
import {useSelector} from "react-redux"

export default function Profile() {
    const [searchParams] = useSearchParams();
    const [posts, setPosts] = useState([]);
    const [userData, setUserData] = useState(null);
    const userName = searchParams.get("userName");
    const navigate = useNavigate();
    const authStatus = useSelector(state=>state.auth.user)
    useEffect(() => {
        async function fetchProfile() {
            try {
                const data = await authService.getProfile(userName);

                if (data?.success) {
                    setUserData(data.profile);
                    if (userName) {
                        postServices.getPosts({ userName }).then((fetchedPosts) => {
                            if (fetchedPosts) setPosts(fetchedPosts);
                        });
                    } else {
                        postServices.getUserPost().then((fetchedPosts) => {
                            if (fetchedPosts) setPosts(fetchedPosts);
                        });
                    }
                } else {
                    if(authStatus) navigate("/not-found", { replace: true });
                    else navigate("/login")
                }
            } catch (err) {
                console.error(err);
                navigate("/");
            }
        }

        fetchProfile();
    }, [userName, navigate, authStatus]);

    if (!userData) {
        return null; 
    }

    // Configured to display the full calendar date cleanly
    const formattedJoinDate = userData.date 
        ? new Date(userData.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) 
        : '';

    return (
        <div className="w-full min-h-screen py-12 px-4 sm:px-6 lg:px-10 text-white bg-transparent">
            <Container>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start max-w-7xl mx-auto">

                    {/* Left Column: Profile Card Sidebar */}
                    <aside className="lg:col-span-1 rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl shadow-xl p-8 text-center lg:sticky lg:top-10 relative z-10">
                        <div className="relative w-40 h-40 mx-auto mb-6">
                            <img
                                src={userData.profilePhoto || "https://via.placeholder.com/150"}
                                alt={`${userData.displayName}'s avatar`}
                                className="w-full h-full object-cover rounded-full border border-white/10 p-1.5 shadow-inner"
                            />
                            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500/20 to-transparent pointer-events-none" />
                        </div>

                        <h1 className="text-3xl font-black tracking-tight text-white mb-1">{userData.displayName}</h1>
                        <p className="text-blue-400 text-base font-mono mb-5">@{userData.userName}</p>

                        {userData.bio && (
                            <p className="text-white/80 text-base leading-relaxed mb-6 border-t border-b border-white/10 py-5 text-left">
                                {userData.bio}
                            </p>
                        )}

                        {/* Combined Metadata Grid */}
                        <div className="bg-black/20 border border-white/5 rounded-xl p-4 mb-6 grid grid-cols-2 gap-2 text-center divide-x divide-white/5 shadow-inner">
                            <div>
                                <span className="block text-xs text-white/40 uppercase tracking-wider font-bold mb-1">Total Blogs</span>
                                <span className="text-4xl font-black text-white">{userData.postCount || 0}</span>
                            </div>
                            <div className="flex flex-col justify-center items-center px-1">
                                <span className="block text-xs text-white/40 uppercase tracking-wider font-bold mb-1">Joined On</span>
                                <span className="text-sm font-semibold text-white/90 font-mono pt-1 text-center leading-tight">
                                    {formattedJoinDate || "N/A"}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-wrap justify-center gap-2">
                            {userData.socialLinks?.github && (
                                <a
                                    href={userData.socialLinks.github}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-4 py-2 text-xs font-medium rounded-full bg-black/8 border border-white/10 text-white/70 hover:bg-blue-500 hover:border-blue-400 hover:text-white transition-all duration-200 shadow-sm"
                                >
                                    GitHub
                                </a>
                            )}
                            {userData.socialLinks?.linkedin && (
                                <a
                                    href={userData.socialLinks.linkedin}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-4 py-2 text-xs font-medium rounded-full bg-black/8 border border-white/10 text-white/70 hover:bg-blue-500 hover:border-blue-400 hover:text-white transition-all duration-200 shadow-sm"
                                >
                                    LinkedIn
                                </a>
                            )}
                        </div>
                    </aside>

                    {/* Right Column: Blog Grid/Feed */}
                    <main className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between border-b border-white/5 pb-4">
                            {/* Dynamically uses the user's name for a cleaner feel */}
                            <h2 className="text-3xl font-extrabold tracking-tight text-white">
                                {userData.displayName}'s Blogs
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 auto-rows-[340px]">
                            {posts.length > 0 ? (
                                posts.map((postItem) => (
                                    <PostCard 
                                        key={postItem._id || postItem.slug} 
                                        {...postItem} 
                                        className="h-full" 
                                    />
                                ))
                            ) : (
                                <p className="text-white/40 text-sm italic py-4 col-span-full">No blogs found.</p>
                            )}
                        </div>
                    </main>

                </div>
            </Container>
        </div>
    );
}   