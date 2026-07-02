import React, { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import authService from "../../services/authService";
import "./resetpassword.css"; // Dùng chung CSS cyber của bồ cho đẹp

function ResetPassword() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token"); // 🕵️‍♂️ Tự động bóc tách chuỗi token từ URL xuống
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleReset = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("❌ Mật khẩu xác nhận không trùng khớp!");
            return;
        }

        try {
            setLoading(true);
            setError("");
            setMessage("");

            // Gọi API lên Backend
            await authService.resetPassword(token, password);

            setMessage("🎉 ĐỒNG BỘ THÀNH CÔNG! Mật khẩu mới đã được cập nhật. Đang dịch chuyển về trang đăng nhập...");

            // Đợi 3 giây cho user kịp đọc thông báo rồi đá về trang Login
            setTimeout(() => {
                navigate("/login");
            }, 3000);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "❌ Mã cứu hộ đã hết hạn hoặc không hợp lệ. Vui lòng yêu cầu lại!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="forgot-password-page-cyber d-flex align-items-center justify-content-center">
            <div className="grid-overlay-cyber"></div>

            <div className="forgot-card-cyber shadow-premium-cyber position-relative z-3" style={{ zIndex: 10 }}>
                <h2 className="title-glow-cyber text-center mb-2 fw-mono">NEW PASSWORD</h2>
                <p className="text-muted-cyber text-center small mb-4">
                    Tiến hành mã hóa và thiết lập lại mật khẩu truy cập hệ thống của bồ.
                </p>

                {message && <div className="alert alert-success bg-opacity-10 border-success text-cyan-cyber small">{message}</div>}
                {error && <div className="alert alert-danger bg-opacity-10 border-danger text-danger small">{error}</div>}

                <form onSubmit={handleReset}>
                    {/* Ô nhập mật khẩu mới */}
                    <div className="mb-3 position-relative">
                        <label className="form-label-cyber fw-mono small mb-2 d-block">NEW_SECURE_PASSWORD</label>
                        <div className="input-group-cyber">
                            <span className="input-icon-cyber">🔑</span>
                            <input
                                type="password"
                                className="form-control-cyber"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {/* Ô xác nhận mật khẩu */}
                    <div className="mb-4 position-relative">
                        <label className="form-label-cyber fw-mono small mb-2 d-block">CONFIRM_PASSWORD</label>
                        <div className="input-group-cyber">
                            <span className="input-icon-cyber">🔄</span>
                            <input
                                type="password"
                                className="form-control-cyber"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
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
                        {loading ? "SAVING_DATA..." : "⚡ XÁC NHẬN THAY ĐỔI"}
                    </button>
                </form>

                <div className="text-center mt-3">
                    <Link to="/login" className="btn-back-to-login fw-mono small">
                        🛸 Quay lại đăng nhập
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;