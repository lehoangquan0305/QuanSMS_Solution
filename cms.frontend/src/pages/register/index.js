import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        password: ""
    });

    // State lưu trữ lỗi của từng trường dữ liệu
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // Hàm kiểm tra lỗi Client-side khi người dùng nhập liệu
    const validateField = (name, value) => {
        let errorMsg = "";

        switch (name) {
            case "fullName":
                if (!value.trim()) errorMsg = "Họ và tên không được để trống";
                else if (value.trim().length < 3) errorMsg = "Họ và tên phải có ít nhất 3 ký tự";
                break;
            case "email":
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!value) errorMsg = "Email không được để trống";
                else if (!emailRegex.test(value)) errorMsg = "Định dạng Email không hợp lệ (Ví dụ: abc@gmail.com)";
                break;
            case "phone":
                const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})\b$/;
                if (!value) errorMsg = "Số điện thoại không được để trống";
                else if (!phoneRegex.test(value)) errorMsg = "Số điện thoại Việt Nam phải gồm 10 chữ số (bắt đầu bằng 03, 05, 07, 08, 09)";
                break;
            case "address":
                if (!value.trim()) errorMsg = "Địa chỉ không được để trống";
                break;
            case "password":
                if (!value) errorMsg = "Mật khẩu không được để trống";
                else if (value.length < 6) errorMsg = "Mật khẩu bảo mật phải có ít nhất 6 ký tự";
                break;
            default:
                break;
        }

        setErrors(prev => ({ ...prev, [name]: errorMsg }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));

        // Validate trực tiếp khi khách hàng gõ ký tự nào kiểm tra ký tự đó
        validateField(name, value);
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        // Chạy validate toàn bộ các ô một lần nữa trước khi bấm gửi lên server
        let validationErrors = {};
        Object.keys(form).forEach(key => {
            validateField(key, form[key]);
            // Kiểm tra thủ công để đưa vào mảng chặn submit
            if (!form[key].trim()) {
                validationErrors[key] = "Trường này là bắt buộc nhập";
            }
        });

        // Nếu còn bất kỳ ô nào có lỗi, chặn không cho gọi API
        if (Object.values(errors).some(error => error) || Object.keys(validationErrors).length > 0) {
            return;
        }

        setLoading(false);
        setLoading(true);

        try {
            const API_URL = process.env.REACT_APP_API_URL;
            const res = await fetch(`${API_URL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });

            const data = await res.json();

            if (!res.ok) {
                // 🔥 KIỂM TRA TRÙNG EMAIL HOẶC LỖI BACKEND TRẢ VỀ
                if (res.status === 400 || data.message?.toLowerCase().includes("email")) {
                    setErrors(prev => ({
                        ...prev,
                        email: data.message || "Email này đã được đăng ký trên hệ thống!"
                    }));
                } else {
                    alert(data.message || "Đăng ký thất bại, vui lòng kiểm tra lại thông tin");
                }
                return;
            }

            alert("Đăng ký thành công 🎉");
            navigate("/login");
        } catch (error) {
            alert("Không thể kết nối đến máy chủ. Vui lòng thử lại sau!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.pageContainer}>
            <div style={styles.backgroundCircles}>
                <div style={{ ...styles.circle, ...styles.circle1 }}></div>
                <div style={{ ...styles.circle, ...styles.circle2 }}></div>
            </div>

            <div style={styles.registerCard}>
                <h2 style={styles.title}>Tạo Tài Khoản</h2>
                <p style={styles.subtitle}>Khám phá những trải nghiệm tuyệt vời ngay hôm nay</p>

                <form onSubmit={handleRegister} style={styles.form}>
                    {[
                        { name: "fullName", type: "text", placeholder: "Họ và tên", icon: "👤" },
                        { name: "email", type: "email", placeholder: "Địa chỉ Email", icon: "✉️" },
                        { name: "phone", type: "tel", placeholder: "Số điện thoại", icon: "📞" },
                        { name: "address", type: "text", placeholder: "Địa chỉ", icon: "📍" },
                        { name: "password", type: "password", placeholder: "Mật khẩu", icon: "🔒" }
                    ].map((input, index) => {
                        const hasError = !!errors[input.name];
                        return (
                            <div key={index} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                <div style={styles.inputGroup}>
                                    <span style={styles.inputIcon}>{input.icon}</span>
                                    <input
                                        name={input.name}
                                        type={input.type}
                                        placeholder={input.placeholder}
                                        value={form[input.name]}
                                        onChange={handleChange}
                                        style={{
                                            ...styles.input,
                                            borderColor: hasError ? "#ff4d4f" : "rgba(255, 255, 255, 0.3)",
                                            boxShadow: hasError ? "0 0 5px rgba(255, 77, 79, 0.3)" : "none"
                                        }}
                                        className="custom-input"
                                    />
                                </div>
                                {/* Hiển thị dòng thông báo lỗi màu đỏ nếu có */}
                                {hasError && (
                                    <span style={styles.errorMessage}>
                                        ⚠️ {errors[input.name]}
                                    </span>
                                )}
                            </div>
                        );
                    })}

                    <button
                        type="submit"
                        disabled={loading}
                        style={loading ? { ...styles.button, opacity: 0.7 } : styles.button}
                    >
                        {loading ? "Đang xử lý..." : "Đăng Ký Ngay"}
                    </button>
                </form>

                <div style={styles.footerText}>
                    Đã có tài khoản? <span style={styles.link} onClick={() => navigate("/login")}>Đăng nhập</span>
                </div>
            </div>

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
                .custom-input:focus {
                    border-color: #6a11cb !important;
                    box-shadow: 0 0 8px rgba(106, 17, 203, 0.4) !important;
                    background: rgba(255, 255, 255, 1) !important;
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
    backgroundCircles: {
        position: "absolute",
        width: "100%",
        height: "100%",
        zIndex: 1,
    },
    circle: {
        position: "absolute",
        borderRadius: "50%",
        background: "rgba(255, 255, 255, 0.1)",
        animation: "float 8s infinite ease-in-out",
    },
    circle1: { width: "300px", height: "300px", top: "-50px", left: "-50px" },
    circle2: { width: "200px", height: "200px", bottom: "-30px", right: "-30px", animationDelay: "2s" },
    registerCard: {
        position: "relative",
        zIndex: 2,
        width: "100%",
        maxWidth: "450px",
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
    subtitle: { textAlign: "center", fontSize: "0.9rem", color: "#e0e0e0", marginBottom: "30px" },
    form: { display: "flex", flexDirection: "column", gap: "14px" }, // Thu nhỏ gap gốc để nhường chỗ hiển thị text lỗi
    inputGroup: { position: "relative", display: "flex", alignItems: "center" },
    inputIcon: { position: "absolute", left: "15px", fontSize: "1.1rem", opacity: 0.7 },
    input: {
        width: "100%",
        padding: "12px 12px 12px 45px",
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
        textShadow: "1px 1px 2px rgba(0,0,0,0.4)"
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
    footerText: { textAlign: "center", marginTop: "20px", fontSize: "0.9rem", color: "#e0e0e0" },
    link: { color: "#fff", fontWeight: "700", cursor: "pointer", textDecoration: "underline", marginLeft: "5px" }
};

export default Register;