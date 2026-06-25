import { useState, useEffect, useRef } from 'react';
import Button from '../common/Button';

const PostFilter = ({ onApplyFilters, hideUsername = false }) => {
    const [userName, setUserName] = useState('');
    const [time, setTime] = useState('');
    const [error, setError] = useState('');
    
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const timeframes = [
        { value: "", label: "All Time" },
        { value: "1day", label: "Past 24 Hours" },
        { value: "1week", label: "Past Week" },
        { value: "1month", label: "Past Month" },
        { value: "1year", label: "Past Year" }
    ];

    const currentSelectedLabel = timeframes.find(tf => tf.value === time)?.label || "All Time";

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        const cleanUsername = userName.trim();

        if (!hideUsername && cleanUsername && !/^[a-zA-Z0-9_-]+$/.test(cleanUsername)) {
            setError('Valid usernames contain letters, numbers, _ or - only.');
            return;
        }

        onApplyFilters({
            ...(!hideUsername && cleanUsername && { userName: cleanUsername }),
            ...(time && { time })
        });
    };

    const handleReset = () => {
        setUserName('');
        setTime('');
        setError('');
        onApplyFilters({});
    };

    return (
        <div className="w-full mt-6 mb-8">
            <form 
                onSubmit={handleSubmit} 
                className={`flex flex-wrap items-end gap-4 p-5 rounded-2xl border bg-black/60 backdrop-blur-xl shadow-xl transition-all duration-300 ${
                    error ? 'border-red-500/30 bg-red-950/10' : 'border-white/10'
                }`}
            >
                {/* Username Input - Conditionally Rendered */}
                {!hideUsername && (
                    <div className="flex flex-col gap-1.5 flex-1 min-w-[200px]">
                        <label className="text-xs font-semibold tracking-wider text-white/60 uppercase">
                            Author Username
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. john_doe"
                            value={userName}
                            onChange={(e) => {
                                setUserName(e.target.value);
                                if(error) setError('');
                            }}
                            maxLength={30}
                            className={`w-full px-4 py-2.5 bg-white/5 border rounded-xl text-sm text-white placeholder-white/30 outline-none focus:outline-none focus:ring-2 transition-all duration-200 ${
                                error 
                                    ? 'border-red-500/40 focus:ring-red-500/30' 
                                    : 'border-white/10 focus:border-blue-500/50 focus:ring-blue-500/20'
                            }`}
                        />
                    </div>
                )}

                {/* Custom Glass Dropdown Container */}
                <div className="flex flex-col gap-1.5 flex-1 min-w-[160px] relative" ref={dropdownRef}>
                    <label className="text-xs font-semibold tracking-wider text-white/60 uppercase">
                        Timeframe
                    </label>
                    
                    <button
                        type="button"
                        onClick={() => setIsOpen(!isOpen)}
                        className="w-full flex items-center justify-between px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white/80 outline-none focus:outline-none focus:ring-2 focus:border-blue-500/50 focus:ring-blue-500/20 transition-all duration-200 shadow-xl text-left"
                    >
                        <span>{currentSelectedLabel}</span>
                        <svg 
                            className={`h-4 w-4 text-white/40 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
                            xmlns="http://www.w3.org/2000/svg" 
                            viewBox="0 0 20 20" 
                            fill="currentColor"
                        >
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
                        </svg>
                    </button>

                    {isOpen && (
                        <div className="absolute left-0 right-0 top-full mt-2 z-50 rounded-xl border border-white/10 bg-black/80 backdrop-blur-2xl shadow-2xl overflow-hidden p-1.5 animate-fadeIn">
                            {timeframes.map((tf) => (
                                <button
                                    key={tf.value}
                                    type="button"
                                    onClick={() => {
                                        setTime(tf.value);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full px-3 py-2 text-left text-sm rounded-lg transition-all duration-150 ${
                                        time === tf.value
                                            ? 'bg-blue-600 text-white font-medium'
                                            : 'text-white/70 hover:bg-white/10 hover:text-white'
                                    }`}
                                >
                                    {tf.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Action Controls */}
                <div className="flex gap-3 w-full lg:w-auto">
                    <Button 
                        type="submit" 
                        className="flex-1 lg:flex-none px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded-xl transition duration-200 active:scale-95 shadow-md shadow-blue-600/10 border border-blue-500/20"
                    >
                        Apply Filters
                    </Button>
                    <Button 
                        type="button" 
                        onClick={handleReset} 
                        className="flex-1 lg:flex-none px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white/80 font-semibold text-sm rounded-xl border border-white/10 transition duration-200 active:scale-95"
                    >
                        Reset
                    </Button>
                </div>
            </form>
            
            {error && (
                <p className="text-xs text-red-400 mt-2 ml-2 font-medium flex items-center gap-1">
                    ⚠️ {error}
                </p>
            )}
        </div>
    );
};

export default PostFilter;