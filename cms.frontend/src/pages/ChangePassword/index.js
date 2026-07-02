import React, { useState, useEffect } from "react";

function ChangePassword() {
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            setMessage({ type: "danger", text: "❌ Bạn cần đăng nhập để thực hiện chức năng này!" });
        }
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setMessage({ type: "", text: "" });

        if (!user) {
            setMessage({ type: "danger", text: "❌ Không tìm thấy thông tin người dùng!" });
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setMessage({ type: "danger", text: "❌ Mật khẩu mới và Xác nhận mật khẩu không khớp!" });
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("https://localhost:7052/api/auth/change-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: user.id,
                    oldPassword: formData.oldPassword,
                    newPassword: formData.newPassword,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage({ type: "success", text: "🎉 Đổi mật khẩu thành công!" });
                setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
            } else {
                setMessage({ type: "danger", text: `❌ ${data.message || "Đổi mật khẩu thất bại!"}` });
            }
        } catch (err) {
            console.error(err);
            setMessage({ type: "danger", text: "❌ Lỗi kết nối đến server!" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Phần Style Cyberpunk nhúng trực tiếp */}
            <style>{`
        .cyber-body-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 80vh;
          font-family: 'Segoe UI', Roboto, sans-serif;
          padding: 20px;
        }

        .cyber-card {
          position: relative;
          background: #0d0e15;
          border: 2px solid #00ffcc;
          box-shadow: 0 0 20px rgba(0, 255, 204, 0.2), inset 0 0 15px rgba(0, 255, 204, 0.1);
          border-radius: 12px;
          padding: 40px;
          width: 100%;
          max-width: 450px;
          overflow: hidden;
          color: #ffffff;
        }

        .cyber-shimmer {
          position: absolute;
          top: 0;
          left: -100%;
          width: 50%;
          height: 100%;
          background: linear-gradient(
            to right,
            transparent,
            rgba(0, 255, 204, 0.1),
            transparent
          );
          transform: skewX(-25deg);
          animation: shimmer 4s infinite linear;
        }

        @keyframes shimmer {
          0% { left: -150%; }
          100% { left: 150%; }
        }

        .cyber-title {
          text-align: center;
          font-size: 24px;
          font-weight: 800;
          letter-spacing: 2px;
          margin-bottom: 30px;
          color: #00ffcc;
          text-shadow: 0 0 10px rgba(0, 255, 204, 0.5);
        }

        .cyber-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .cyber-label {
          font-size: 13px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #ff007f;
          text-shadow: 0 0 5px rgba(255, 0, 127, 0.3);
        }

        .cyber-input {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(0, 255, 204, 0.3);
          border-radius: 6px;
          padding: 12px 16px;
          color: #fff;
          font-size: 15px;
          transition: all 0.3s ease;
        }

        .cyber-input:focus {
          outline: none;
          border-color: #00ffcc;
          background: rgba(0, 255, 204, 0.05);
          box-shadow: 0 0 10px rgba(0, 255, 204, 0.3);
        }

        .cyber-alert {
          padding: 12px;
          border-radius: 6px;
          font-size: 14px;
          margin-bottom: 20px;
          text-align: center;
          border: 1px solid;
        }

        .alert-success {
          background: rgba(46, 204, 113, 0.15);
          color: #2ecc71;
          border-color: #2ecc71;
          box-shadow: 0 0 10px rgba(46, 204, 113, 0.2);
        }

        .alert-danger {
          background: rgba(231, 76, 60, 0.15);
          color: #e74c3c;
          border-color: #e74c3c;
          box-shadow: 0 0 10px rgba(231, 76, 60, 0.2);
        }

        .cyber-btn {
          position: relative;
          background: transparent;
          border: 2px solid #ff007f;
          color: #ff007f;
          padding: 14px;
          font-size: 16px;
          font-weight: 700;
          letter-spacing: 2px;
          border-radius: 6px;
          cursor: pointer;
          overflow: hidden;
          transition: all 0.3s ease;
          margin-top: 10px;
        }

        .cyber-btn:hover:not(:disabled) {
          background: #ff007f;
          color: #000;
          box-shadow: 0 0 15px rgba(255, 0, 127, 0.6);
        }

        .cyber-btn:disabled {
          border-color: #555;
          color: #555;
          cursor: not-allowed;
        }

        .spinner {
          display: inline-block;
          animation: pulse 1s infinite alternate;
        }

        @keyframes pulse {
          0% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>

            {/* Giao diện hiển thị */}
            <div className="cyber-body-wrapper">
                <div className="cyber-card">
                    <div className="cyber-shimmer"></div>
                    <h2 className="cyber-title">🔒 ĐỔI MẬT KHẨU</h2>

                    {message.text && (
                        <div className={`cyber-alert alert-${message.type}`}>
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleChangePassword} className="cyber-form">

                        <div className="form-group">
                            <label className="cyber-label">Mật khẩu hiện tại</label>
                            <input
                                type="password"
                                name="oldPassword"
                                className="cyber-input"
                                placeholder="••••••••"
                                value={formData.oldPassword}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="cyber-label">Mật khẩu mới</label>
                            <input
                                type="password"
                                name="newPassword"
                                className="cyber-input"
                                placeholder="••••••••"
                                value={formData.newPassword}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="cyber-label">Xác nhận mật khẩu mới</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                className="cyber-input"
                                placeholder="••••••••"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <button type="submit" className="cyber-btn" disabled={loading}>
                            {loading ? (
                                <span className="spinner">ĐANG XỬ LÝ...</span>
                            ) : (
                                "CẬP NHẬT MẬT KHẨU"
                            )}
                        </button>

                    </form>
                </div>
            </div>
        </>
    );
}

export default ChangePassword;