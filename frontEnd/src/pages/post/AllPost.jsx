import { useState, useEffect } from 'react'
import { PostCard } from '../../components/index'
import postServices from "../../services/post";

function AllPosts() {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    postServices.getUserPost().then((posts) => {
      if (posts) setPosts(posts)
    })
  }, [])

  return (
    <div className="w-full py-8 px-4 sm:px-6 lg:px-10">
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {posts.map((post) => (
          <PostCard key={post._id} {...post} />
        ))}

      </div>
    </div>
  )
}

export default AllPosts