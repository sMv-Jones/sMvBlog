import { Button } from '../index'; // Adjust this import path to your project's structure

export default function DeleteConfirmationModal({ isOpen, onClose, onConfirm, title, message, children }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Modal Backdrop overlay */}
            <div 
                className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Shell Container */}
            <div className="relative w-full max-w-md transform rounded-3xl border border-white/10 bg-neutral-950 p-6 shadow-2xl transition-all animate-fadeIn text-white">
                
                {/* Header Content */}
                <h3 className="text-xl font-extrabold tracking-tight text-white mb-2">
                    {title || "Confirm Action"}
                </h3>
                
                {/* Body message content */}
                <p className="text-sm text-white/60 leading-relaxed mb-4">
                    {message || "Are you sure you want to proceed? This step is irreversible."}
                </p>

                {/* Inject dynamic layouts directly inside the form scope (e.g., OTP context input fields) */}
                {children && (
                    <div className="mb-6">
                        {children}
                    </div>
                )}
                
                {/* Footer Action items mapping custom Buttons */}
                <div className="flex items-center justify-end gap-3 border-t border-white/10 pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-semibold text-white/70 hover:text-white transition-colors duration-200"
                    >
                        Cancel
                    </button>
                    
                    <Button
                        onClick={onConfirm}
                        bgColor="bg-red-600/90"
                        textColor="text-white"
                        className="hover:bg-red-500/90 font-semibold text-sm py-2 px-5"
                    >
                        Delete Permanently
                    </Button>
                </div>
            </div>
        </div>
    );
}