import { Container, Button } from '../components/index'
import { useNavigate } from "react-router-dom";
import PostFilter from '../components/post/PostFilter';


export default function NotFound() {
    const navigate = useNavigate();
    return (
        <div className='w-full py-8'>
            <PostFilter onApplyFilters/>
            <Container>
                <h1 className='text-2xl font-bold'>Page Not Found</h1>
                <Button type="button" onClick={() => navigate(-1)}> Return BACk</Button>
            </Container>
        </div>
    )
}