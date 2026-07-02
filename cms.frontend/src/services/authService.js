import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL;
const BASE_URL = `${API_URL}/Auth`; // Điều chỉnh lại đúng chuỗi URL API Backend của bồ nhé

const authService = {
    // API gửi email yêu cầu cấp lại mật khẩu (Tiêu chí 46)
    forgotPassword: async (email) => {
        try {
            // Backend của bồ nhận vào chuỗi email hoặc một object { email } tùy bồ cấu hình ở Controller
            const response = await axios.post(`${BASE_URL}/forgot-password`, { email });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    resetPassword: async (token, newPassword) => {
        try {
            const response = await axios.post(`${BASE_URL}/reset-password`, { token, newPassword });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export default authService;