import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    // State quản lý lỗi và thông báo thành công
    const [errors, setErrors] = useState({});
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [loading, setLoading] = useState(false);

    // Hàm kiểm tra lỗi thời gian thực khi gõ phím
    const validateField = (name, value) => {
        let errorMsg = "";

        switch (name) {
            case "email":
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!value) errorMsg = "Email không được để trống";
                else if (!emailRegex.test(value)) errorMsg = "Định dạng Email không hợp lệ";
                break;
            case "password":
                if (!value) errorMsg = "Mật khẩu không được để trống";
                else if (value.length < 6) errorMsg = "Mật khẩu phải có ít nhất 6 ký tự";
                break;
            default:
                break;
        }

        setErrors(prev => ({ ...prev, [name]: errorMsg }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        validateField(name, value);
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        // Kiểm tra lỗi trước khi submit
        let hasErrors = false;
        Object.keys(form).forEach(key => {
            if (!form[key]) {
                setErrors(prev => ({ ...prev, [key]: "Trường này là bắt buộc nhập" }));
                hasErrors = true;
            }
        });

        if (hasErrors || Object.values(errors).some(err => err)) return;

        try {
            setLoading(true);

            const res = await fetch("https://localhost:7052/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });

            const text = await res.text();
            let data;
            try {
                data = text ? JSON.parse(text) : {};
            } catch (err) {
                setErrors({ global: "Hệ thống phản hồi không hợp lệ" });
                return;
            }

            if (!res.ok) {
                // Nếu sai tài khoản hoặc mật khẩu, đẩy thông báo lỗi vào đúng ô hoặc lỗi chung
                if (data.message?.toLowerCase().includes("email") || data.message?.toLowerCase().includes("tài khoản")) {
                    setErrors(prev => ({ ...prev, navigate, email: data.message }));
                } else if (data.message?.toLowerCase().includes("mật khẩu") || data.message?.toLowerCase().includes("password")) {
                    setErrors(prev => ({ ...prev, password: data.message }));
                } else {
                    setErrors({ global: data.message || "Đăng nhập thất bại" });
                }
                return;
            }

            // ✅ LƯU THÔNG TIN USER VÀO LOCALSTORAGE
            // ✅ LƯU THÔNG TIN USER GỐC TỪ API
            localStorage.setItem("user", JSON.stringify(data.user));

            // ✅ ĐỒNG BỘ: Nếu tài khoản này đã từng lưu SĐT/Địa chỉ biệt lập trước đó, nạp luôn vào bộ nhớ máy
            if (data.user) {
                const savedPhone = localStorage.getItem(`user_phone_${data.user.email}`) || data.user.phone || "";
                const savedAddress = localStorage.getItem(`user_address_${data.user.email}`) || data.user.address || "";

                // Găm chặt theo Email để nếu đổi tài khoản khác không bị lẫn lộn dữ liệu
                localStorage.setItem("user_phone", savedPhone);
                localStorage.setItem("user_address", savedAddress);
            }
            window.dispatchEvent(new Event("userUpdated"));

            // ✅ BẬT POP-UP THÔNG BÁO THÀNH CÔNG ĐẸP MẮT
            setShowSuccessToast(true);

            // Chờ hiệu ứng chạy mượt mà khoảng 1.5 giây rồi chuyển hướng về Trang Chủ
            setTimeout(() => {
                setShowSuccessToast(false);
                navigate("/");
            }, 1800);

        } catch (error) {
            setErrors({ global: "Không thể kết nối đến máy chủ. Vui lòng thử lại sau!" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.pageContainer}>
            {/* Hiệu ứng bong bóng bay phía sau nền */}
            <div style={styles.backgroundCircles}>
                <div style={{ ...styles.circle, ...styles.circle1 }}></div>
                <div style={{ ...styles.circle, ...styles.circle2 }}></div>
            </div>

            {/* Form Đăng nhập chính */}
            <div style={styles.loginCard}>
                <h2 style={styles.title}>Chào Mừng Trở Lại</h2>
                <p style={styles.subtitle}>Vui lòng đăng nhập để tiếp tục hành trình của bạn</p>

                {/* Dòng hiển thị lỗi tổng quan từ server nếu có */}
                {errors.global && <div style={styles.globalError}>❌ {errors.global}</div>}

                <form onSubmit={handleLogin} style={styles.form}>
                    {/* Ô nhập Email */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        <div style={styles.inputGroup}>
                            <span style={styles.inputIcon}>✉️</span>
                            <input
                                name="email"
                                type="email"
                                placeholder="Địa chỉ Email"
                                value={form.email}
                                onChange={handleChange}
                                style={{
                                    ...styles.input,
                                    borderColor: errors.email ? "#ff4d4f" : "rgba(255, 255, 255, 0.3)"
                                }}
                                className="custom-input"
                            />
                        </div>
                        {errors.email && <span style={styles.errorMessage}>⚠️ {errors.email}</span>}
                    </div>

                    {/* Ô nhập Mật khẩu */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        <div style={styles.inputGroup}>
                            <span style={styles.inputIcon}>🔒</span>
                            <input
                                name="password"
                                type="password"
                                placeholder="Mật khẩu"
                                value={form.password}
                                onChange={handleChange}
                                style={{
                                    ...styles.input,
                                    borderColor: errors.password ? "#ff4d4f" : "rgba(255, 255, 255, 0.3)"
                                }}
                                className="custom-input"
                            />
                        </div>
                        {errors.password && <span style={styles.errorMessage}>⚠️ {errors.password}</span>}
                    </div>

                    {/* Nút bấm */}
                    <button
                        type="submit"
                        disabled={loading}
                        style={loading ? { ...styles.button, opacity: 0.7 } : styles.button}
                    >
                        {loading ? "Đang xác thực..." : "Đăng Nhập"}
                    </button>
                </form>

                <div style={styles.footerText}>
                    Chưa có tài khoản? <span style={styles.link} onClick={() => navigate("/register")}>Đăng ký ngay</span>
                </div>
            </div>

            {/* 🔥 POP-UP TOAST THÀNH CÔNG CỰC ĐẸP MẮT */}
            {showSuccessToast && (
                <div className="login-success-toast">
                    <div className="toast-icon">🎉</div>
                    <div>
                        <h5 style={{ margin: 0, fontWeight: "700", color: "#111" }}>Đăng Nhập Thành Công!</h5>
                        <p style={{ margin: "2px 0 0 0", fontSize: "0.85rem", color: "#666" }}>Chào mừng bạn quay trở lại Store.</p>
                    </div>
                </div>
            )}

            {/* Nhúng CSS Animation trực tiếp */}
            <style>{`
                @keyframes float {
                    0% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(180deg); }
                    100% { transform: translateY(0px) rotate(360deg); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes slideInUp {
                    from { opacity: 0; transform: translate(-50%, 50px); }
                    to { opacity: 1; transform: translate(-50%, 0); }
                }
                .custom-input:focus {
                    border-color: #6a11cb !important;
                    box-shadow: 0 0 8px rgba(106, 17, 203, 0.4) !important;
                    background: rgba(255, 255, 255, 1) !important;
                }
                .login-success-toast {
                    position: fixed;
                    bottom: 40px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: #ffffff;
                    padding: 16px 28px;
                    border-radius: 50px;
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    box-shadow: 0 15px 35px rgba(0,0,0,0.3);
                    z-index: 99999;
                    animation: slideInUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    border: 1px solid rgba(46, 204, 113, 0.2);
                    font-family: 'Segoe UI', sans-serif;
                }
                .toast-icon {
                    font-size: 1.6rem;
                    background: #e8f8f0;
                    width: 45px;
                    height: 45px;
                    display: flex;
                    align-items: center;
                    justifyContent: center;
                    border-radius: 50%;
                }
            `}</style>
        </div>
    );
}

const styles = {
    pageContainer: {
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
        overflow: "hidden",
        fontFamily: "'Segoe UI', Roboto, sans-serif",
    },
    backgroundCircles: { position: "absolute", width: "100%", height: "100%", zIndex: 1 },
    circle: {
        position: "absolute",
        borderRadius: "50%",
        background: "rgba(255, 255, 255, 0.1)",
        animation: "float 8s infinite ease-in-out",
    },
    circle1: { width: "250px", height: "250px", top: "10%", right: "15%" },
    circle2: { width: "350px", height: "350px", bottom: "-50px", left: "50px", animationDelay: "1.5s" },
    loginCard: {
        position: "relative",
        zIndex: 2,
        width: "100%",
        maxWidth: "420px",
        padding: "40px",
        borderRadius: "20px",
        background: "rgba(255, 255, 255, 0.15)",
        backdropFilter: "blur(15px)",
        WebkitBackdropFilter: "blur(15px)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.3)",
        color: "#fff",
        animation: "fadeIn 1s ease-out",
    },
    title: {
        textAlign: "center",
        fontSize: "2rem",
        fontWeight: "700",
        marginBottom: "10px",
        letterSpacing: "1px",
        background: "linear-gradient(to right, #ffffff, #e0e0e0)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
    },
    subtitle: { textAlign: "center", fontSize: "0.9rem", color: "#e0e0e0", marginBottom: "30px", lineHeight: "1.4" },
    form: { display: "flex", flexDirection: "column", gap: "16px" },
    inputGroup: { position: "relative", display: "flex", alignItems: "center" },
    inputIcon: { position: "absolute", left: "15px", fontSize: "1.1rem", opacity: 0.7 },
    input: {
        width: "100%",
        padding: "14px 12px 14px 45px",
        borderRadius: "10px",
        border: "1px solid rgba(255, 255, 255, 0.3)",
        background: "rgba(255, 255, 255, 0.1)",
        color: "#fff",
        fontSize: "1rem",
        outline: "none",
        transition: "all 0.3s ease",
    },
    errorMessage: {
        color: "#ffdddd",
        fontSize: "0.8rem",
        fontWeight: "600",
        textAlign: "left",
        paddingLeft: "5px",
    },
    globalError: {
        background: "rgba(231, 76, 60, 0.2)",
        border: "1px solid #e74c3c",
        padding: "10px",
        borderRadius: "8px",
        fontSize: "0.9rem",
        marginBottom: "15px",
        color: "#ffdddd",
        fontWeight: "500"
    },
    button: {
        width: "100%",
        padding: "14px",
        borderRadius: "10px",
        border: "none",
        background: "linear-gradient(to right, #6a11cb 0%, #2575fc 100%)",
        color: "#fff",
        fontSize: "1.1rem",
        fontWeight: "600",
        cursor: "pointer",
        boxShadow: "0 4px 15px rgba(106, 17, 203, 0.4)",
        transition: "all 0.3s ease",
        marginTop: "10px",
    },
    footerText: { textAlign: "center", marginTop: "25px", fontSize: "0.9rem", color: "#e0e0e0" },
    link: { color: "#fff", fontWeight: "700", cursor: "pointer", textDecoration: "underline", marginLeft: "5px" }
};

export default Login;