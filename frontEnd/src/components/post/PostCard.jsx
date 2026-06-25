import { Link } from 'react-router-dom'

function PostCard({ title, featuredImage, slug, updatedAt, content, userName, displayName, className = "" }) {
  const cleanSnippet = content
    ? content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
    : ''

  const formattedDate = updatedAt
    ? new Date(updatedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    : ''

  // Checks if a custom height/flex system was passed from the parent. 
  // If not, we apply the default vertical flow layout classes.
  const hasCustomLayout = className.includes('h-') || className.includes('flex');
  
  return (
    <Link to={`/post/${slug}`} className={`block w-full group ${className}`}>
      <article
        className={`
          w-full
          rounded-2xl
          overflow-hidden
          border border-white/10
          bg-black/60 backdrop-blur-xl
          shadow-[0_0_18px_rgba(255,255,255,0.08)]
          hover:shadow-[0_0_30px_rgba(255,255,255,0.16)]
          transition-all duration-300
          ${hasCustomLayout ? 'h-full flex flex-col' : ''}
        `}
      >
        {/* IMAGE AREA */}
        {/* If custom layout is active, image box takes a percentage height, else uses your original static responsive heights */}
        <div className={`w-full overflow-hidden ${hasCustomLayout ? 'h-[45%]' : 'h-[180px] sm:h-[200px]'}`}>
          <img
            src={featuredImage}
            alt={title}
            className="
              w-full h-full object-cover
              group-hover:scale-105
              transition-transform duration-500
            "
          />
        </div>

        {/* CONTENT AREA */}
        {/* If custom layout is active, flex-1 forces the content area to claim all remaining card space nicely */}
        <div className={`p-4 sm:p-5 ${hasCustomLayout ? 'flex-1 flex flex-col justify-between' : ''}`}>
          <div>
            {formattedDate && (
              <time className="text-[11px] text-white/40 tracking-widest uppercase">
                {formattedDate}
              </time>
            )}

            <h2 className="
              mt-2
              text-base sm:text-lg md:text-xl
              font-semibold text-white
              line-clamp-2
              group-hover:text-blue-300
            ">
              {title}
            </h2>

            {cleanSnippet && (
              <p className="
                mt-2
                text-sm text-white/60
                line-clamp-2
              ">
                {cleanSnippet}
              </p>
            )}
          </div>

          {/* AUTHOR SECTION */}
          {displayName && (
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-2">
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-white/90">
                  {displayName}
                </span>
                {userName && (
                  <span className="text-xs text-white/40">
                    @{userName}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </article>
    </Link>
  )
}

export default PostCard