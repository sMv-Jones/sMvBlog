import { useEffect, useState } from 'react'
import postService from "../services/post";
import { Container, PostCard } from '../components/index'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
function Home() {
    const [posts, setPosts] = useState([])
    const AuthStatus = useSelector(state => state.auth.status)
    useEffect(() => {
        postService.getPosts().then((posts) => {
            if (posts) {
                setPosts(posts)
            }
        })
    }, [])

    if (!AuthStatus) {
        return (
            <div className="w-full py-8 mt-4 text-center">
                <Container>
                    <div className="flex flex-wrap">
                        <div className="p-2 w-full">
                            <h1 className="text-2xl font-bold hover:text-gray-500">
                                <Link to='/signup'>
                                    Link New User! Register Here
                                </ Link >
                            </h1>
                            <h1 className="text-2xl font-bold hover:text-gray-500">
                            <Link to='/login'>
                                    Link Login to read posts
                                </ Link >
                            </h1>
                        </div>
                    </div>
                </Container>
            </div>
        )
    }
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

export default Home