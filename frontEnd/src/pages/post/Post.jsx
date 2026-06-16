import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import postService from "../../services/post"; // Updated to matching singular import instance
import { Button, Container } from "../../components/index";
import parse from "html-react-parser";
import { useSelector } from "react-redux";

export default function Post() {
    const [post, setPost] = useState(null);
    const { slug } = useParams();
    const navigate = useNavigate();

    const userData = useSelector((state) => state.auth.userData);

    // FIX 1: Robust Author Check. Handles situations where userId is an object or string,
    // and checks both traditional mongo '_id' and virtualized 'id' fields.
    const getAuthorId = (postObj) => {
        if (!postObj?.userId) return null;
        return typeof postObj.userId === "object" ? postObj.userId._id || postObj.userId.id : postObj.userId;
    };

    const currentUserId = userData?._id || userData?.id;
    const postAuthorId = getAuthorId(post);
    
    const isAuthor = postAuthorId && currentUserId ? String(postAuthorId) === String(currentUserId) : false;

    useEffect(() => {
        if (slug) {
            postService.getPost(slug).then((response) => {
                // Adjusting dynamically if your Express API returns the post wrapped in a data object
                const postData = response?.data || response; 
                if (postData) {
                    setPost(postData);
                } else {
                    navigate("/");
                }
            }).catch(() => navigate("/"));
        } else {
            navigate("/");
        }
    }, [slug, navigate]);

    const handleDeletePost = () => {
        // FIX  2: Using post.slug instead of post._id because your Express service uses slugs for queries
        const identifier = post.slug || post._id;
        
        postService.deletePost(identifier).then((success) => {
            if (success) {
                // Note: postService.deleteFile(post.featuredImage) was removed here
                // because your Express backend handles image deletion inside deletePost automatically!
                navigate("/");
            }
        });
    };

    return post ? (
        <div className="py-8">
            <Container>
                <div className="w-full flex justify-center mb-4 relative border rounded-xl p-2">
                    <img
                        style={{
                            flexShrink: 0,
                            width: "15vw",
                            height: "auto",
                            objectFit: "cover"
                        }}
                        src={post.featuredImage}
                        alt={post.title}
                        className="rounded-xl"
                    />

                    {isAuthor && (
                        <div className="absolute right-6 top-6">
                            {/* FIX 3: Routing to edit page via slug instead of database _id */}
                            <Link to={`/edit-post/${post.slug || post._id}`}>
                                <Button bgColor="bg-green-500" className="mr-3">
                                    Edit
                                </Button>
                            </Link>
                            <Button bgColor="bg-red-500" onClick={handleDeletePost}>
                                Delete
                            </Button>
                        </div>
                    )}
                </div>
                <div className="w-full mb-6">
                    <h1 className="text-2xl font-bold">{post.title}</h1>
                </div>
                <div className="browser-css">
                    {parse(post.content)}
                </div>
            </Container>
        </div>
    ) : null;
}