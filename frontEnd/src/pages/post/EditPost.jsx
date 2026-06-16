import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, PostForm } from '../../components/index';
import postService from "../../services/post"; // FIX 1: Updated to match your singular service instance

function EditPost() {
    const [post, setPost] = useState(null); // FIX 2: Renamed setPosts to setPost for naming accuracy
    const { slug } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (slug) {
            postService.getPost(slug)
                .then((response) => {
                    // FIX 3: Extracted data property fallback safely in case your backend 
                    // returns the response wrapped in a data wrapper payload.
                    const fetchedPost = response?.data || response;

                    if (fetchedPost) {
                        setPost(fetchedPost);
                    } else {
                        navigate('/');
                    }
                })
                .catch((error) => {
                    console.error("Error fetching post for edit:", error);
                    navigate('/');
                });
        } else {
            navigate('/');
        }
    }, [slug, navigate]);

    return post ? (
        <div className='py-8'>
            <Container>
                <PostForm post={post} />
            </Container>
        </div>
    ) : null;
}

export default EditPost;