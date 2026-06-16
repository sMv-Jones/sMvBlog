function Button({
    children,
    type = "button",
    bgColor = "bg-teal-600/90",
    textColor = "text-white",
    className = "",
    ...props
}) {
    return (
        <button
            type={type}
            className={`
                px-4 py-2 rounded-lg 
                ${bgColor} ${textColor} 
                backdrop-blur-md 
                hover:bg-cyan-600/90
                hover:shadow-md hover:shadow-black/30
                active:scale-95 
                transition-all duration-300 ease-in-out
                ${className}
            `}
            {...props}
        >
            {children}
        </button>
    );
}

export default Button;