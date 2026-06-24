import API from '../api/client';

export class AuthService {
    // Helper to format consistent error objects across all methods
    #handleError(error, defaultMessage) {
        return {
            success: false,
            message: error.response?.data?.message || error.response?.data || defaultMessage
        };
    }

    async createAccount({ email, password, name }) {
        try {
            const response = await API.post('/auth/register', { email, password, name });
            return response.data;
        } catch (error) {
            console.error("Auth Service :: createAccount :: error", error);
            return this.#handleError(error, "Registration failed");
        }
    }

    async verifyEmail(OTP) {
        try {
            const response = await API.post('/auth/verify-email', { otp: OTP });
            return response.data;
        } catch (error) {
            console.error("Auth Service :: verifyEmail :: error", error);
            return this.#handleError(error, "Verification failed");
        }
    }

    async login({ email, password }) {
        try {
            const response = await API.post('/auth/login', { email, password });
            return response.data;
        } catch (error) {
            console.error("Auth Service :: login :: error", error);
            return this.#handleError(error, "Login failed");
        }
    }

    async getProfile(userName) {
        try {
            const response = await API.get(
                `/auth/profile${userName ? "?userName=" + userName : ""}`
            );
            return response.data;
        } catch (error) {
            console.error("Auth Service :: getProfile :: error", error);
            return this.#handleError(error, "Network error fetching profile");
        }
    }

    async getCurrentUser() {
        try {
            const response = await API.get('/auth/me');
            return response.data;
        } catch (error) {
            console.error("Auth Service :: getCurrentUser :: error", error);
            return { success: false, user: null };
        }
    }

    async logout() {
        try {
            await API.post('/auth/logout');
            return { success: true };
        } catch (error) {
            console.error("Auth Service :: logout :: error", error);
            return { success: false, message: "Logout anomaly encountered" };
        }
    }

    async updateProfile(formData) {
        try {
            const { data } = await API.put(`/auth/profile-update`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            return data;
        } catch (error) {
            console.error("Auth Service :: updateProfile :: error", error);
            return this.#handleError(error, "Connection anomaly encountered during update.");
        }
    }

    async sendPasswordOtp() {
        try {
            const { data } = await API.post(`/auth/send-password-otp`);
            return data;
        } catch (error) {
            console.error("Auth Service :: sendPasswordOtp :: error", error);
            return this.#handleError(error, "Failed to generate security token.");
        }
    }

    async sendDeleteAccountOtp() {
        try {
            const { data } = await API.post(`/auth/send-delete-otp`);
            return data;
        } catch (error) {
            console.error("Auth Service :: sendDeleteAccountOtp :: error", error);
            return this.#handleError(error, "Failed to generate security token.");
        }
    }

    async changePassword(passwordPayload) {
        try {
            const { data } = await API.post(`/auth/change-password`, passwordPayload);
            return data;
        } catch (error) {
            console.error("Auth Service :: changePassword :: error", error);
            return this.#handleError(error, "Connection error during password change.");
        }
    }

    async deleteAccount(deletePayload) {
        try {
            const { data } = await API.delete(`/auth/delete-account`, { data: deletePayload });
            return data;
        } catch (error) {
            console.error("Auth Service :: deleteAccount :: error", error);
            return this.#handleError(error, "Connection error during deletion.");
        }
    }
}

const authService = new AuthService();
export default authService;