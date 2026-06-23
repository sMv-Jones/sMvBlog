import API from '../api/client';

export class AuthService {
    async createAccount({ email, password, name }) {
        try {
            const response = await API.post('/auth/register', { email, password, name });
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || "Registration failed";
        }
    }
    async verifyEmail(OTP) {
        try {
            const response = await API.post('/auth/verify-email', { otp:OTP });
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || "Registration failed";
        }
    }
    async verifyOTP() {
    // logic hitting your API endpoint (e.g., /api/v1/users/verify)
}
    async login({ email, password }) {
        try {
            const response = await API.post('/auth/login', { email, password });
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || "Login failed";
        }
    }

    async getCurrentUser() {
        try {
            const response = await API.get('/auth/me');
            return response.data;
        } catch {
            return { success: false, user: null };
        }
    }

    async logout() {
        try {
            await API.post('/auth/logout');
            return true;
        } catch (error) {
            console.error("Auth Service :: logout :: error", error);
            return false;
        }
    }
}

const authService = new AuthService();
export default authService;