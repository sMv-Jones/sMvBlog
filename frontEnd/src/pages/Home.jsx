import { useEffect, useState } from 'react'
import postService from "../services/post";
import { Container, PostCard, Button } from '../components/index'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

function Home() {
    const [posts, setPosts] = useState([])
    const AuthStatus = useSelector(state => state.auth.status)
    const userData = useSelector(state => state.auth)

    // ✅ LINTER FIX: Set initial state dynamically. 
    // If the user is logged in, start with loading true. If logged out, start with loading false.
    const [loading, setLoading] = useState(() => !!AuthStatus)

    useEffect(() => {
        // ✅ LINTER FIX: Removed `setLoading(true)` from here.
        // The linter will now see that `setPosts` and `setLoading` are ONLY called 
        // inside asynchronous promise callbacks (.then, .catch, .finally), which is perfectly legal.
        if (AuthStatus) {
            postService.getPosts()
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
    }, [AuthStatus])

    // State 1: Logged Out State
    if (!AuthStatus) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center py-10 px-4 text-white">
                <Container>
                    <div className="max-w-2xl mx-auto rounded-3xl border border-white/10 bg-black/60 backdrop-blur-2xl shadow-2xl p-8 md:p-12 text-center">
                        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
                            Welcome to <span className="text-blue-500">sMv|Blog</span>
                        </h1>
                        <p className="text-lg text-white/70 max-w-md mx-auto mb-8">
                            Explore full-stack architecture, database deep-dives, <br className="hidden sm:inline" />
                            and performance optimizations on sMv|Blog.
                        </p>

                        <div className="h-px bg-white/10 my-6"></div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-6">
                            <Link to='/signup' className="w-full sm:w-auto">
                                <Button>New User! Register Here</Button>
                            </Link>
                            <Link to='/login' className="w-full sm:w-auto">
                                <Button>Login to read posts</Button>
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

    // State 3: Empty State (Logged in, but no posts available)
    if (posts.length === 0) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center py-10 px-4 text-white">
                <Container>
                    <div className="max-w-xl mx-auto rounded-3xl border border-white/10 bg-black/60 backdrop-blur-2xl shadow-2xl p-8 md:p-12 text-center flex flex-col items-center">
                        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
                            Welcome back, <span className="text-blue-400">{userData?.userName || "Developer"}</span>! <br /> <br />
                        </h1>
                        <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-400 mb-6 shadow-inner">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
                            </svg>
                        </div>

                        <h2 className="text-2xl font-bold tracking-tight text-white mb-2">
                            No Articles Published
                        </h2>

                        <p className="text-base text-white/50 max-w-sm mb-8 leading-relaxed">
                            The repository is currently empty. Start the engine by publishing your first technical breakthrough.
                        </p>

                        <Link to="/add-post">
                            <button className="px-6 py-2.5 rounded-xl bg-blue-600 text-sm font-semibold text-white border border-blue-500/20 shadow-lg shadow-blue-600/20 hover:bg-blue-500 hover:scale-105 transition duration-200">
                                Create First Post
                            </button>
                        </Link>
                    </div>
                </Container>
            </div>
        )
    }

    // State 4: Feed State (Logged in with posts available)
    return (
        <div className="min-h-screen py-10 px-4 text-white">
            <Container>
                <div className="max-w-7xl mx-auto mb-10 p-6 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl flex justify-between items-center flex-wrap gap-4 shadow-xl">
                    <div className="space-y-1">
                        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
                            Welcome back, <span className="text-blue-400">{userData?.userName || "Developer"}</span>!
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

                <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {posts.map((post) => (
                        <div key={post._id} className="hover:scale-[1.02] transition duration-300 h-full">
                            <PostCard {...post} />
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    )
}

export default Home