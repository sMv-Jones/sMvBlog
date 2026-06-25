import { useEffect, useState } from 'react'
import postService from "../services/post";
import { Container, PostCard, Button } from '../components/index'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { PostFilter } from '../components/index'; // Adjust the import path as needed

function Home() {
    const [posts, setPosts] = useState([])
    const AuthStatus = useSelector(state => state.auth.status)
    const userData = useSelector(state => state.auth)
    // ✅ LINTER FIX: Set initial state dynamically. 
    // If the user is logged in, start with loading true. If logged out, start with loading false.
    const [loading, setLoading] = useState(() => !!AuthStatus)

    // State to hold the active filter variables
    const [activeFilters, setActiveFilters] = useState({})

    useEffect(() => {
        // ✅ LINTER FIX: Removed `setLoading(true)` from here.
        // The linter will now see that `setPosts` and `setLoading` are ONLY called 
        // inside asynchronous promise callbacks (.then, .catch, .finally), which is perfectly legal.
        if (AuthStatus) {
            postService.getPosts(activeFilters) // Added reactive filter object parameters here
                .then((posts) => {
                    if (posts) {
                        setPosts(posts)
                    }
                })
                .catch((err) => {
                    console.error("Failed to fetch posts:", err)
                })
                .finally(() => {
                    setLoading(false) // Safe: Asynchronous call
                })
        }
    }, [AuthStatus, activeFilters]) // Effect hook triggers whenever authorization or filter configurations change

    // State 1: Logged Out State
    if (!AuthStatus) {
        return (
            <div className="relative min-h-[85vh] flex items-center justify-center py-12 px-4 overflow text-white">
                {/* Subtle Decorative Background Blobs */}
                <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

                <Container className="relative z-10">
                    <div className="max-w-3xl mx-auto rounded-3xl border border-white/[0.08] bg-black/60 backdrop-blur-xl shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] p-8 md:p-16 text-center transition-all duration-300 hover:border-white/10">

                        {/* Main Heading */}
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.15] mb-6">
                            Discover Engineering at{' '}
                            <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 font-extrabold">
                                sMv|Blog
                            </span>
                        </h1>

                        {/* Subtitle */}
                        <p className="text-base md:text-lg text-zinc-400 max-w-xl mx-auto mb-10 leading-relaxed">
                            Explore deep-dives into full-stack architecture, high-performance database optimizations, and battle-tested scaling strategies.
                        </p>

                        {/* Decorative Divider */}
                        <div className="w-16 h-[2px] bg-gradient-to-r from-transparent via-zinc-700 to-transparent mx-auto mb-10"></div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link to='/signup' className="w-full sm:w-auto group">
                                <Button className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/20 transform transition-all duration-200 active:scale-95 group-hover:scale-[1.02]">
                                    Get Started — It's Free
                                </Button>
                            </Link>

                            <Link to='/login' className="w-full sm:w-auto group">
                                <Button className="w-full sm:w-auto px-8 py-4 bg-white/[0.04] hover:bg-white/[0.08] text-zinc-200 hover:text-white font-semibold rounded-xl border border-white/10 backdrop-blur-sm transform transition-all duration-200 active:scale-95 group-hover:scale-[1.02]">
                                    Login to read posts
                                </Button>
                            </Link>
                        </div>

                    </div>
                </Container>
            </div>
        )
    }

    // State 2: Asynchronous Loading State
    if (loading) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center text-white">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-white/60 text-sm tracking-wide animate-pulse">Loading repository...</p>
            </div>
        )
    }

    // Combined State 3 & 4 Layout UI Wrapper (Keeps filtering nodes visible even if results map to 0 array items)
    return (
        <div className="min-h-screen py-10 px-4 text-white">
            <Container>
                {/* Upper Welcome Header Section */}
                <div className="max-w-7xl mx-auto mb-10 p-6 rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl flex justify-between items-center flex-wrap gap-4 shadow-xl">
                    <div className="space-y-1">
                        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
                            Welcome back, <span className="text-blue-400">{userData?.userDisplayName || "Developer"}</span>!
                        </h1>
                        <p className="text-xs md:text-sm text-white/50">
                            Here is your curated tech feed on sMv|Blog.
                        </p>
                    </div>

                    <Link to="/add-post">
                        <button className="px-5 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-semibold hover:bg-blue-600 hover:border-blue-500 hover:scale-105 transition duration-200 shadow-md">
                            + Write Article
                        </button>
                    </Link>
                </div>

                {/* Filter Controls Bar Container */}
                <div className="max-w-7xl mx-auto relative z-40">
                    <PostFilter onApplyFilters={setActiveFilters} />
                </div>

                {/* Main Dynamic View Area */}
                {posts.length === 0 ? (
                    <div className="max-w-7xl mx-auto mt-6 rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl p-12 text-center flex flex-col items-center shadow-xl">
                        <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-400 mb-6 shadow-inner">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
                            </svg>
                        </div>

                        <h2 className="text-2xl font-bold tracking-tight text-white mb-2">
                            No Articles Found
                        </h2>

                        <p className="text-base text-white/50 max-w-sm mb-8 leading-relaxed">
                            The repository returned no matching posts. Try altering your filter parameters or publish an article.
                        </p>

                        <Link to="/add-post">
                            <button className="px-6 py-2.5 rounded-xl bg-blue-600 text-sm font-semibold text-white border border-blue-500/20 shadow-lg shadow-blue-600/20 hover:bg-blue-500 hover:scale-105 transition duration-200">
                                Create First Post
                            </button>
                        </Link>
                    </div>
                ) : (
                    <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {posts.map((post) => (
                            <div key={post._id} className="hover:scale-[1.02] transition duration-300 h-full">
                                <PostCard {...post} />
                            </div>
                        ))}
                    </div>
                )}
            </Container>
        </div>
    )
}

export default Home;