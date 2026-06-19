import { Container } from "../components/index"

export default function About() {
    return (
        <div className="min-h-screen py-10 px-4 text-white">
            <Container>
                <div className="max-w-4xl mx-auto rounded-3xl border border-white/10 bg-black/60 backdrop-blur-2xl shadow-2xl p-6 md:p-12">
                    
                    {/* Header */}
                    <div className="text-center md:text-left mb-8">
                        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4">
                            About <span className="text-blue-500">sMv|Blog</span>
                        </h1>
                        <p className="text-lg text-white/70 max-w-2xl">
                            Welcome to sMv|Blog, an engineering journal dedicated to full-stack development, database architecture, and technical writing.
                        </p>
                    </div>

                    <div className="h-px bg-white/10 my-8"></div>

                    {/* Content Sections */}
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-2xl font-bold mb-3 text-blue-400">Who Am I?</h2>
                            <p className="text-white/80 leading-relaxed">
                                Hello, I'm the mind behind sMv|Blog. I am a passionate developer who loves exploring new engineering horizons, building robust full-stack applications, and breaking down complex technical concepts into readable documentation and articles.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold mb-3 text-blue-400">What You'll Find Here</h2>
                            <p className="text-white/80 leading-relaxed mb-4">
                                This platform functions as an open-source engineering journal. I regularly write about:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-white/70">
                                <li>Full-stack web architecture and database design.</li>
                                <li>Performance optimizations and secure coding practices.</li>
                                <li>Deep dives into modern frameworks and tools.</li>
                                <li>Personal projects, failures, and breakthrough lessons.</li>
                            </ul>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold mb-3 text-blue-400">The Stack Behind SMV Blog</h2>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {["React", "Node.js", "MongoDB", "Tailwind CSS", "Redux Toolkit"].map((tech) => (
                                    <span key={tech} className="px-3 py-1 text-sm font-medium rounded-full bg-white/5 border border-white/10 text-white/80">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </Container>
        </div>
    );
}