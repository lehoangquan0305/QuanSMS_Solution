import React, { useState } from "react";
import { Link } from "react-router-dom";
import authService from "../../services/authService";
import "./forgotpassword.css";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        setError("");

        try {
            // 🔥 TIÊU CHÍ 46: Gọi API kết nối trực tiếp đến Backend
            await authService.forgotPassword(email);

            setMessage("🚀 Yêu cầu thành công! Vui lòng kiểm tra hộp thư email của bạn để nhận mã khôi phục.");
            setEmail(""); // Xóa trống ô nhập sau khi gửi thành công
        } catch (err) {
            console.error(err);
            setError("❌ Email không tồn tại trong hệ thống hoặc đã xảy ra lỗi. Vui lòng thử lại!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="forgot-password-page-cyber d-flex align-items-center justify-content-center">
            {/* Lưới điện phát quang nền */}
            <div className="grid-overlay-cyber"></div>

            {/* ✅ ĐÃ GIA CỐ: Thêm zIndex trực tiếp vào style để form không bị chìm xuống dưới lớp nền */}
            <div
                className="forgot-card-cyber shadow-premium-cyber position-relative animate-fade-in-cyber"
                style={{ zIndex: 10 }}
            >
                <h2 className="title-glow-cyber text-center mb-2 fw-mono">PASSWORD RECOVERY</h2>
                <p className="text-muted-cyber text-center small mb-4">
                    Nhập email tài khoản của bạn để trích xuất và thiết lập lại mật khẩu truy cập hệ thống.
                </p>

                {message && <div className="alert alert-success bg-opacity-10 border-success text-cyan-cyber small">{message}</div>}
                {error && <div className="alert alert-danger bg-opacity-10 border-danger text-danger small">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4 position-relative">
                        <label className="form-label-cyber fw-mono small mb-2 d-block">SECURE_EMAIL_ADDRESS</label>
                        <div className="input-group-cyber">
                            <span className="input-icon-cyber">📧</span>
                            <input
                                type="email"
                                className="form-control-cyber"
                                placeholder="name@domain.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn-cyber-primary w-100 py-3 fw-bold fw-mono mb-3"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2"></span>
                                SENDING_REQUEST...
                            </>
                        ) : (
                            "⚡ GỬI YÊU CẦU KHÔI PHỤC"
                        )}
                    </button>
                </form>

                <div className="text-center mt-3">
                    <Link to="/login" className="btn-back-to-login fw-mono small" style={{ position: "relative", zIndex: 11 }}>
                        🛸 ⟨ QUAY LẠI ĐĂNG NHẬP
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;