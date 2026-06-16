import API from '../api/client';

export class PostService {
    async createPost({ title, slug, content, imageFile, status }) {
        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('slug', slug);
            formData.append('content', content);
            formData.append('status', status);
            formData.append('image', imageFile); // The actual file object from <input type="file"/>

            const response = await API.post('/posts', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data;
        } catch (error) {
            console.error("Post Service :: createPost :: error", error);
            throw error.response?.data?.message || "Failed to create post";
        }
    }

    async updatePost(slug, { title, content, imageFile, status }) {
        try {
            const formData = new FormData();
            if(title) formData.append('title', title);
            if(content) formData.append('content', content);
            if(status) formData.append('status', status);
            if(imageFile) formData.append('image', imageFile);

            const response = await API.put(`/posts/${slug}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data;
        } catch (error) {
            console.error("Post Service :: updatePost :: error", error);
            throw error.response?.data?.message || "Failed to update post";
        }
    }

    async deletePost(slug) {
        try {
            await API.delete(`/posts/${slug}`);
            return true;
        } catch (error) {
            console.error("Post Service :: deletePost :: error", error);
            return false;
        }
    }

    async getPost(slug) {
        try {
            const response = await API.get(`/posts/${slug}`);
            return response.data;
        } catch (error) {
            console.error("Post Service :: getPost :: error", error);
            return null;
        }
    }
    async getUserPost(){
        try {
            const response = await API.get(`/posts/my-posts`);
            return response.data;
        } catch (error) {
            console.error("Post Service :: getPost :: error", error);
            return null;
        }
    }
    async getPosts(status = 'active') {
        try {
            const response = await API.get(`/posts?status=${status}`);
            return response.data;
        } catch (error) {
            console.error("Post Service :: getPosts :: error", error);
            return [];
        }
    }

}

const postService = new PostService();
export default postService;