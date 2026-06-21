import { useState } from "react";
import { Container } from "../components/index";

export default function Contact() {
    const [formData, setFormData] = useState({ name: "", email: "", message: "" });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle your form submission logic here (e.g., API endpoint call)
        alert("Thanks for reaching out! This is a demo submission.");
        setFormData({ name: "", email: "", message: "" });
    };

    return (
        <div className="min-h-screen py-10 px-4 text-white">
            <Container>
                <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-8">
                    
                    {/* Left: Contact Info / Links */}
                    <div className="flex-1 rounded-3xl border border-white/10 bg-black/60 backdrop-blur-2xl p-6 md:p-10 flex flex-col justify-between">
                        <div>
                            <h1 className="text-4xl font-extrabold mb-4">Let's Connect.</h1>
                            <p className="text-white/70 mb-8">
                                Have an interesting project idea, a feedback suggestion, or just want to chat about development? Feel free to drop a line or catch me across my networks.
                            </p>

                            <div className="space-y-4">
                                {/* Email */}
                                <a href="mailto:mohdafzal_MA@outlook.com" className="flex items-center gap-4 p-4 rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 transition group">
                                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">@</div>
                                    <div>
                                        <p className="text-xs text-white/40 font-mono">EMAIL ME DIRECTLY</p>
                                        <p className="text-sm font-semibold text-white/90 group-hover:text-white">mohdafzal_MA@outlook.com</p>
                                    </div>
                                </a>

                                {/* GitHub */}
                                <a href="https://github.com/sMv-Jones" target="_blank" rel="noreferrer" className="flex items-center gap-4 p-4 rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 transition group">
                                    <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">GH</div>
                                    <div>
                                        <p className="text-xs text-white/40 font-mono">OPEN SOURCE PROJECTS</p>
                                        <p className="text-sm font-semibold text-white/90 group-hover:text-white">github.com/sMv-Jones</p>
                                    </div>
                                </a>

                                {/* LinkedIn */}
                                <a href="https://linkedin.com/in/mohd-afzal-web-dev/" target="_blank" rel="noreferrer" className="flex items-center gap-4 p-4 rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 transition group">
                                    <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">LN</div>
                                    <div>
                                        <p className="text-xs text-white/40 font-mono">PROFESSIONAL NETWORK</p>
                                        <p className="text-sm font-semibold text-white/90 group-hover:text-white">linkedin.com/in/mohd-afzal-web-dev/</p>
                                    </div>
                                </a>
                            </div>
                        </div>

                    </div>

                    {/* Right: Message Form */}
                    <div className="flex-1 rounded-3xl border border-white/10 bg-black/50 backdrop-blur-xl p-6 md:p-10">
                        <h2 className="text-2xl font-bold mb-6">Send a Message</h2>
                        
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-xs font-mono text-white/50 mb-2 uppercase tracking-wider">Your Name</label>
                                <input 
                                    type="text" 
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 focus:outline-none transition text-white"
                                    placeholder="John Doe"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-mono text-white/50 mb-2 uppercase tracking-wider">Your Email</label>
                                <input 
                                    type="email" 
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 focus:outline-none transition text-white"
                                    placeholder="john@example.com"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-mono text-white/50 mb-2 uppercase tracking-wider">Message</label>
                                <textarea 
                                    rows="5"
                                    required
                                    value={formData.message}
                                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500 focus:outline-none transition text-white resize-none"
                                    placeholder="Write your message here..."
                                ></textarea>
                            </div>

                            <button 
                                type="submit" 
                                className="w-full py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold tracking-wide shadow-lg transition active:scale-[0.98]"
                            >
                                Send Message
                            </button>
                        </form>
                    </div>

                </div>
            </Container>
        </div>
    );
}