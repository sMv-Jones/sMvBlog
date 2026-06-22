import { useState, useEffect } from 'react'
import { PostCard } from '../../components/index'
import postServices from "../../services/post";
import { PostFilter } from "../../components/index"; // Adjust the import path as needed

function AllPosts() {
  const [posts, setPosts] = useState([])
  // State to hold the active filter variables
  const [activeFilters, setActiveFilters] = useState({})

  useEffect(() => {
    // Pass the active state object directly to your endpoint structure
    postServices.getUserPost(activeFilters).then((posts) => {
      if (posts) setPosts(posts)
    })
  }, [activeFilters]) // Listens to parameter changes to trigger update loops

  return (
    <div className="w-full py-8 px-4 sm:px-6 lg:px-10 text-white">
      {/* Integrated Filter view row */}
      <div className="max-w-7xl mx-auto relative z-40">
        <PostFilter onApplyFilters={setActiveFilters} hideUsername={true} />
      </div>

      {posts.length === 0 ? (
        /* Handles layout cleanly if filter variables yield 0 articles */
        <div className="max-w-7xl mx-auto mt-6 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl p-12 text-center flex flex-col items-center shadow-xl">
          <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-400 mb-4 shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">No Articles Found</h2>
          <p className="text-sm text-white/50 max-w-sm">
            No matching items found. Try altering your selected timeframe.
          </p>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div key={post._id} className="hover:scale-[1.02] transition duration-300 h-full">
              <PostCard {...post} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AllPosts