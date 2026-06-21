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
            if (title) formData.append('title', title);
            if (content) formData.append('content', content);
            if (status) formData.append('status', status);
            if (imageFile) formData.append('image', imageFile);

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
    // 1. Updated & Validated: Fetches user's own posts with an optional timeframe filter
    async getUserPost(filters = {}) {
        try {
            const { time } = filters;
            const params = new URLSearchParams();

            // Whitelist structural timeframe check
            const allowedTimeframes = ['1day', '1week', '1month', '1year'];
            if (time && allowedTimeframes.includes(time)) {
                params.append('time', time);
            }

            const queryString = params.toString() ? `?${params.toString()}` : '';
            const response = await API.get(`/posts/my-posts${queryString}`);
            return response.data;
        } catch (error) {
            console.error("Post Service :: getUserPost :: error", error);
            return null;
        }
    }

    // 2. Updated & Sanitized: Fetches public active posts with username and timeframe filters
    async getPosts(filters = {}) {
        try {
            const { userName, time, status = 'active' } = filters;
            const params = new URLSearchParams();

            if (status) params.append('status', status);

            // Sanitize & validate username syntax format before adding to layout query
            if (userName) {
                const cleanUsername = String(userName).trim();
                if (/^[a-zA-Z0-9_-]+$/.test(cleanUsername)) {
                    params.append('userName', cleanUsername);
                } else {
                    console.warn("Post Service :: getPosts :: Blocked invalid username syntax client-side");
                    // Instead of hitting the backend with bad payloads, skip it or fail early
                    return [];
                }
            }

            // Whitelist structural timeframe check
            const allowedTimeframes = ['1day', '1week', '1month', '1year'];
            if (time && allowedTimeframes.includes(time)) {
                params.append('time', time);
            }

            const queryString = params.toString() ? `?${params.toString()}` : '';
            const response = await API.get(`/posts${queryString}`);
            return response.data;
        } catch (error) {
            console.error("Post Service :: getPosts :: error", error);
            return [];
        }
    }
}

const postService = new PostService();
export default postService;