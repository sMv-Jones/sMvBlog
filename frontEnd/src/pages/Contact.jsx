import { Container } from "../components/index";

export default function Contact() {
    return (
        <div className="min-h-screen py-16 px-4 text-white font-sans">
            <Container>
                <div className="max-w-2xl mx-auto">

                    {/* Contact Info Card */}
                    <div className="rounded-3xl border border-white/10 bg-black/60 backdrop-blur-xl p-8 md:p-12 flex flex-col justify-between relative overflow-hidden group">
                        
                        {/* Subtle ambient background glow */}
                        <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none transition-all duration-700 group-hover:bg-blue-500/20" />
                        
                        <div className="relative z-10">
                            <h1 className="text-4xl font-black tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-400">
                                Let's Connect.
                            </h1>
                            <p className="text-zinc-400 text-base leading-relaxed mb-8">
                                Have an interesting project idea, a feedback suggestion, or just want to chat about development? Feel free to drop a line or catch me across my networks.
                            </p>

                            <div className="space-y-4">
                                {/* Email */}
                                <a 
                                    href="mailto:mohdafzal_MA@outlook.com" 
                                    className="flex items-center justify-between p-4 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/10 transition-all duration-300 group/link"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-11 h-11 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20 group-hover/link:scale-110 transition-transform duration-300">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-envelope" viewBox="0 0 16 16">
                                                <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.708-2.897L1 5.383z"/>
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-zinc-500 font-mono tracking-wider uppercase">EMAIL ME DIRECTLY</p>
                                            <p className="text-sm font-medium text-zinc-300 group-hover/link:text-white transition-colors">mohdafzal_MA@outlook.com</p>
                                        </div>
                                    </div>
                                    <span className="text-zinc-600 group-hover/link:text-white group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-all text-sm font-mono">↗</span>
                                </a>

                                {/* GitHub */}
                                <a 
                                    href="https://github.com/sMv-Jones" 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="flex items-center justify-between p-4 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/10 transition-all duration-300 group/link"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-11 h-11 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20 group-hover/link:scale-110 transition-transform duration-300">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-github" viewBox="0 0 16 16">
                                                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"/>
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-zinc-500 font-mono tracking-wider uppercase">OPEN SOURCE PROJECTS</p>
                                            <p className="text-sm font-medium text-zinc-300 group-hover/link:text-white transition-colors">github.com/sMv-Jones</p>
                                        </div>
                                    </div>
                                    <span className="text-zinc-600 group-hover/link:text-white group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-all text-sm font-mono">↗</span>
                                </a>

                                {/* LinkedIn */}
                                <a 
                                    href="https://linkedin.com/in/mohd-afzal-web-dev/" 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="flex items-center justify-between p-4 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/10 transition-all duration-300 group/link"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-11 h-11 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20 group-hover/link:scale-110 transition-transform duration-300">
                                            <svg xmlns="http://www.w3.org/2000/xl" width="18" height="18" fill="currentColor" className="bi bi-linkedin" viewBox="0 0 16 16">
                                                <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z"/>
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-zinc-500 font-mono tracking-wider uppercase">PROFESSIONAL NETWORK</p>
                                            <p className="text-sm font-medium text-zinc-300 group-hover/link:text-white transition-colors">linkedin.com/in/mohd-afzal-web-dev/</p>
                                        </div>
                                    </div>
                                    <span className="text-zinc-600 group-hover/link:text-white group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-all text-sm font-mono">↗</span>
                                </a>
                            </div>
                        </div>

                    </div>

                </div>
            </Container>
        </div>
    );
}