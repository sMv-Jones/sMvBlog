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
            const response = await API.post('/auth/verify-email', { otp: OTP });
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || "Registration failed";
        }
    }


    async getProfile(userName) {
        try {
            const response = await API.get(
                `/auth/profile${userName ? "?userName=" + userName : ""}`
            );

            return response.data;
        } catch (error) {
            // return structured error instead of throwing
            return {
                success: false,
                message: error.response?.data?.message || "Network error"
            };
        }
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

    async updateProfile(formData) {
        try {
            const { data } = await API.put(`/auth/profile-update`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            return data;
        } catch (error) {
            console.error("Profile Update Exception:", error);
            throw error.response?.data ?? new Error("Connection anomaly encountered during update.");
        }
    };

    /**
      * DISPATCH PASSWORD CHANGE OTP
      */
    async sendPasswordOtp() {
        try {
            const { data } = await API.post(`/auth/send-password-otp`);
            return data;
        } catch (error) {
            console.error("Password OTP Dispatch Exception:", error);
            return {
                success: false,
                message: error.response?.data?.message || "Failed to generate security token."
            };
        }
    }

    /**
     * DISPATCH ACCOUNT DELETION OTP
     */
    async sendDeleteAccountOtp() {
        try {
            const { data } = await API.post(`/auth/send-delete-otp`);
            return data;
        } catch (error) {
            console.error("Delete Account OTP Dispatch Exception:", error);
            return {
                success: false,
                message: error.response?.data?.message || "Failed to generate security token."
            };
        }
    }

    /**
     * CHANGE PASSWORD
     * Expects payload: { currentPassword, newPassword, otp }
     */
    async changePassword(passwordPayload) {
        try {
            const { data } = await API.post(`/auth/change-password`, passwordPayload);
            return data;
        } catch (error) {
            console.error("Credential Modification Exception:", error);
            return {
                success: false,
                message: error.response?.data?.message || "Connection error during password change."
            };
        }
    }

    /**
     * DELETE ACCOUNT
     * Expects payload: { otp }
     */
    async deleteAccount(deletePayload) {
        try {
            const { data } = await API.delete(`/auth/delete-account`, { data: deletePayload });
            return data;
        } catch (error) {
            console.error("Account Termination Exception:", error);
            return {
                success: false,
                message: error.response?.data?.message || "Connection error during deletion."
            };
        }
    }
}

const authService = new AuthService();
export default authService;