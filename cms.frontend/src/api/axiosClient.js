import axios from 'axios';

// 1. Khởi tạo một thực thể axios với cấu hình base chung
const axiosClient = axios.create({
    // ⚠️ LƯU Ý: Hãy kiểm tra chính xác Port Backend ASP.NET Core của bạn (7001, 5001, hoặc 7234...) và sửa lại bên dưới
    baseURL: 'https://localhost:7052/api',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // Thời gian tối đa chờ phản hồi từ server (10 giây)
});

// 2. Cấu hình Interceptor cho Response (Xử lý dữ liệu trả về tập trung)
axiosClient.interceptors.response.use(
    (response) => {
        // Nếu API trả về thành công (status 2xx), bóc tách lấy thẳng cục data bên trong JSON
        // Giúp ở Component ReactJS bạn không cần phải gõ .data nữa
        return response.data;
    },
    (error) => {
        // Xử lý các lỗi hệ thống tập trung tại đây (Ví dụ: Server sập, lỗi 404, lỗi 500)
        console.error('Lỗi kết nối API:', error.message);

        if (error.response) {
            // Lỗi từ phía Server trả về (Ví dụ: 400 Bad Request, 401 Unauthorized)
            console.error('Chi tiết lỗi từ Server:', error.response.status, error.response.data);
        }

        return Promise.reject(error);
    }
);

export default axiosClient;