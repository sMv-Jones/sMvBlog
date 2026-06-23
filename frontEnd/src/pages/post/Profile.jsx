import { Container } from "../../components/index";
import { useParams } from 'react-router-dom';
// ==========================================
// 1. SAMPLE DATA MATRIX
// ==========================================
const SAMPLE_USER_DATA = {
    username: "@smv_dev",
    displayName: "S.M.V. Engineer",
    dateJoined: "Jan 2024",
    blogCount: 3,
    profilePhoto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    bio: "Full-stack developer architecting scalable engines, deep-diving into indexing algorithms, and occasionally writing front-end glassmorphism wrappers.",
    socials: [
        { name: "GitHub", url: "https://github.com" },
        { name: "LinkedIn", url: "https://linkedin.com" },
        { name: "Twitter", url: "https://twitter.com" }
    ],
    blogs: [
        { 
            id: "log-001", 
            title: "Optimizing MongoDB Indexes for Distributed Relational Frameworks", 
            date: "June 15, 2026", 
            excerpt: "An in-depth study of B-Tree modifications when handling complex sharded datasets over distributed networks.", 
            readTime: "5 min read" 
        },
        { 
            id: "log-002", 
            title: "The Anatomy of a High-Performance Glassmorphism UI", 
            date: "May 29, 2026", 
            excerpt: "How backdrop-blur-2xl impacts rendering repaint loops on mobile webKit layers and strategies to bypass GPU bottlenecks.", 
            readTime: "8 min read" 
        },
        { 
            id: "log-003", 
            title: "Building a State Management Engine from Scratch", 
            date: "April 12, 2026", 
            excerpt: "Ditching wrappers entirely to implement a raw event-driven state emitter inside clean architecture patterns.", 
            readTime: "12 min read" 
        }
    ]
};

// ==========================================
// 2. POST CARD COMPONENT
// ==========================================
export function PostCard({ blog }) {
    const { title, date, excerpt, readTime } = blog;
    
    return (
        <article className="rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl hover:bg-black/80 hover:border-white/20 hover:scale-[1.01] transition-all duration-300 p-6 shadow-xl cursor-pointer group">
            <div className="flex items-center justify-between gap-2 mb-3 text-xs text-white/40 font-mono">
                <span>{date}</span>
                <span>{readTime}</span>
            </div>
            <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors mb-2">
                {title}
            </h3>
            <p className="text-sm text-white/60 line-clamp-2 leading-relaxed">
                {excerpt}
            </p>
            <div className="mt-4 flex items-center text-xs font-semibold text-blue-400 group-hover:text-blue-300 transition-colors">
                Read Journal Entry <span className="transform group-hover:translate-x-1 transition-transform ml-1">&rarr;</span>
            </div>
        </article>
    );
}

// ==========================================
// 3. MAIN PROFILE DASHBOARD COMPONENT
// ==========================================
export default function Profile() {
    const { userName } = useParams();
    const userData = SAMPLE_USER_DATA;

    return (
        /* Changed from bg-slate-950 to bg-transparent to preserve your main background */
        <div className="w-full min-h-screen py-12 px-4 sm:px-6 lg:px-10 text-white bg-transparent">
            <Container>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start max-w-7xl mx-auto">
                    
                    {/* Left Column: Profile Card Sidebar */}
                    <aside className="lg:col-span-1 rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl shadow-xl p-8 text-center lg:sticky lg:top-10 relative z-10">
                        {/* Profile Photo */}
                        <div className="relative w-32 h-32 mx-auto mb-5">
                            <img 
                                src={userData.profilePhoto} 
                                alt={`${userData.displayName}'s avatar`} 
                                className="w-full h-full object-cover rounded-full border border-white/10 p-1.5 shadow-inner"
                            />
                            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500/20 to-transparent pointer-events-none" />
                        </div>

                        {/* Profile Info */}
                        <h1 className="text-2xl font-extrabold tracking-tight text-white mb-1">{userData.displayName}</h1>
                        <p className="text-blue-400 text-sm font-mono mb-4">{userData.username}</p>
                        
                        <p className="text-xs text-white/40 mb-6 font-mono">
                            Joined: <span className="text-white/70 font-sans font-medium">{userData.dateJoined}</span>
                        </p>

                        {/* Bio */}
                        <p className="text-white/70 text-sm leading-relaxed mb-6 border-t border-b border-white/10 py-5 text-left">
                            {userData.bio}
                        </p>

                        {/* Counter Stats Container */}
                        <div className="bg-black/8 border border-white/5 rounded-xl p-4 mb-6 shadow-inner">
                            <span className="block text-xs text-white/40 uppercase tracking-wider font-bold mb-1">Total Journals</span>
                            <span className="text-3xl font-black text-white">{userData.blogCount}</span>
                        </div>

                        {/* Map over Array of Social Links */}
                        <div className="flex flex-wrap justify-center gap-2">
                            {userData.socials?.map((social) => (
                                <a 
                                    key={social.name}
                                    href={social.url} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="px-4 py-1.5 text-xs font-medium rounded-full bg-black/8 border border-white/10 text-white/70 hover:bg-blue-500 hover:border-blue-400 hover:text-white transition-all duration-200 shadow-sm"
                                >
                                    {social.name}
                                </a>
                            ))}
                        </div>
                    </aside>

                    {/* Right Column: Blog Grid/Feed */}
                    <main className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between border-b border-white/5 pb-4">
                            <h2 className="text-2xl font-extrabold tracking-tight text-white">
                                Engineering Logs
                            </h2>
                            <span className="px-3 py-1 text-xs font-mono font-bold rounded-md bg-black/8 border border-white/10 text-white/50">
                                {userData.blogs?.length || 0} Entries
                            </span>
                        </div>

                        {/* Map over list of blogs wrapped in updated PostCard component */}
                        <div className="space-y-4">
                            {userData.blogs?.map((blogItem) => (
                                <PostCard 
                                    key={blogItem.id} 
                                    blog={blogItem} 
                                />
                            ))}
                        </div>
                    </main>

                </div>
            </Container>
        </div>
    );
}