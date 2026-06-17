import { useState, useEffect } from 'react'
import { Container, PostCard } from '../../components/index'
import postServices from "../../services/post";

function AllPosts() {
    const [posts, setPosts] = useState([])
    useEffect(() => {
        postServices.getUserPost().then((posts) => {
        if (posts) {
            setPosts(posts)
        }
    })
    }, [])
    return (
        <div className='w-full py-8'>
            <Container>
                <div className='flex flex-wrap'>
                    {posts.map((post) => (
                        <div key={post._id} className='p-2 w-1/4'>
                            <PostCard {...post} />
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    )
}

export default AllPosts