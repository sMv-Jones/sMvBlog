import { Link } from 'react-router-dom'

function PostCard({ title, featuredImage, slug }) {

  return (
    <Link to={`/post/${slug}`}>
      <div className='w-full bg-gray-100 rounded-xl p-4'>
        <div className='w-full justify-center mb-4'>
          <img
            style={{
              flexShrink: 0,
              width: "20vw",
              height: "auto",
              objectFit: "cover"
            }}
            src={featuredImage}
            alt={title}
            className='rounded-xl' />
        </div>
        <h2
          className='text-xl font-bold'
        >{title}</h2>
      </div>
    </Link>
  )
}


export default PostCard