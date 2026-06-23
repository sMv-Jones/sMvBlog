import { Container, Button } from '../components/index'
import { useNavigate } from "react-router-dom";

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen py-10 px-4 text-white flex items-center justify-center">
            <Container>
                <div className="max-w-xl mx-auto rounded-3xl border border-white/10 bg-black/60 backdrop-blur-2xl shadow-2xl p-8 md:p-12 text-center">
                    
                    {/* Status Code / Accent */}
                    <div className="text-6xl md:text-8xl font-extrabold text-blue-500 mb-4 tracking-tight animate-pulse">
                        404
                    </div>

                    {/* Heading */}
                    <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mb-3">
                        Page Not Found
                    </h1>

                    {/* Description */}
                    <p className="text-base md:text-lg text-white/70 max-w-sm mx-auto mb-8">
                        The blog or page you are looking for does not exist or has been moved.
                    </p>

                    <div className="h-px bg-white/10 my-6"></div>

                    {/* Action Button */}
                    <div className="flex justify-center">
                        <Button 
                            type="button" 
                            onClick={() => navigate(-1)}
                            className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-full transition-all duration-200 shadow-lg shadow-blue-500/20"
                        >
                            Return Back
                        </Button>
                    </div>

                </div>
            </Container>
        </div>
    );
}