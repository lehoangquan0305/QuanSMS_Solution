import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Profile() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        address: ""
    });
    const [message, setMessage] = useState({ type: "", text: "" });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser) {
            navigate("/login");
            return;
        }
        setUser(storedUser);

        const savedPhone = localStorage.getItem("user_phone") || "";
        const savedAddress = localStorage.getItem("user_address") || "";

        setFormData({
            fullName: storedUser.fullName || storedUser.name || "",
            email: storedUser.email || "",
            phone: savedPhone || storedUser.phone || "",
            address: savedAddress || storedUser.address || ""
        });
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: "", text: "" });

        try {
            const API_URL = process.env.REACT_APP_API_URL;
            const res = await fetch(`${API_URL}/auth/update-profile`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    Id: user?.id || user?.Id,
                    FullName: formData.fullName,
                    Phone: formData.phone,
                    Address: formData.address,
                    Email: formData.email,
                    Password: "NoPasswordChange"
                })
            });

            const data = await res.json();

            if (!res.ok) {
                setMessage({ type: "danger", text: data.message || "❌ Lỗi cập nhật lên Server." });
                return;
            }

            localStorage.setItem("user", JSON.stringify(data.user));
            setUser(data.user);

            const emailKey = data.user.email.trim();
            localStorage.setItem("user_phone", data.user.phone || "");
            localStorage.setItem("user_address", data.user.address || "");
            localStorage.setItem(`user_phone_${emailKey}`, data.user.phone || "");
            localStorage.setItem(`user_address_${emailKey}`, data.user.address || "");

            window.dispatchEvent(new Event("userUpdated"));

            setMessage({ type: "success", text: "🎉 Đồng bộ cơ sở dữ liệu cốt lõi thành công vĩnh viễn!" });
            setIsEditing(false);
        } catch (err) {
            setMessage({ type: "danger", text: "❌ Thiết lập kết nối Server thất bại." });
        } finally {
            setLoading(false);
        }
    };

    if (!user) return (
        <div className="loader-container">
            <div className="spinner-cyber"></div>
            <p className="loading-text-glow">ĐANG NẠP THÔNG TIN CỐT LÕI...</p>
        </div>
    );

    return (
        <div className="profile-cyber-bg py-5">
            <div className="container position-relative z-2">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        {/* Khung chứa Kính Cường Lực Cao Cấp (Glassmorphism) */}
                        <div className="cyber-card profile-main-card overflow-hidden rounded-4 position-relative">
                            <div className="cyber-shimmer"></div>

                            {/* Khối che phủ phía trên tích hợp lưới sóng động nghệ thuật */}
                            <div className="profile-cyber-cover">
                                <div className="grid-overlay"></div>
                                <div className="avatar-cyber-ring animate-spin-slow"></div>
                                <div className="profile-avatar-cyber-wrapper shadow">
                                    <span className="avatar-cyber-emoji">👟</span>
                                </div>
                            </div>

                            <div className="card-body p-4 p-md-5 pt-5 text-center mt-4 position-relative z-3">
                                <h2 className="fw-black text-white text-glow mb-1 animate-text-slide">
                                    {formData.fullName.toUpperCase()}
                                </h2>
                                <p className="text-cyan small fw-mono tracking-widest text-uppercase mb-4">
                                    ⚡ PREMIUM CYBER ACCOUNT ADIDAS MASTER
                                </p>

                                {message.text && (
                                    <div className={`alert-cyber alert-cyber-${message.type} animate-pop mb-4`}>
                                        {message.text}
                                    </div>
                                )}

                                <form onSubmit={handleSave} className="text-start mt-4">
                                    <div className="row g-4">
                                        <div className="col-md-6">
                                            <div className="form-floating cyber-floating">
                                                <input
                                                    type="text"
                                                    name="fullName"
                                                    className={`form-control ${isEditing ? "input-cyber-active" : "input-cyber-readonly"}`}
                                                    id="pName"
                                                    placeholder="Họ và tên"
                                                    value={formData.fullName}
                                                    onChange={handleChange}
                                                    disabled={!isEditing}
                                                    required
                                                />
                                                <label htmlFor="pName" className="fw-mono">HỌ VÀ TÊN KHÁCH HÀNG</label>
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <div className="form-floating cyber-floating">
                                                <input
                                                    type="email"
                                                    name="email"
                                                    className="form-control input-cyber-readonly"
                                                    id="pEmail"
                                                    placeholder="Email"
                                                    value={formData.email}
                                                    disabled
                                                />
                                                <label htmlFor="pEmail" className="fw-mono">ĐỊA CHỈ EMAIL ĐỊNH DANH</label>
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <div className="form-floating cyber-floating">
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    className={`form-control ${isEditing ? "input-cyber-active" : "input-cyber-readonly"}`}
                                                    id="pPhone"
                                                    placeholder="Số điện thoại"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    disabled={!isEditing}
                                                />
                                                <label htmlFor="pPhone" className="fw-mono">SỐ ĐIỆN THOẠI LIÊN HỆ</label>
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <div className="form-floating cyber-floating">
                                                <input
                                                    type="text"
                                                    name="address"
                                                    className={`form-control ${isEditing ? "input-cyber-active" : "input-cyber-readonly"}`}
                                                    id="pAddress"
                                                    placeholder="Địa chỉ"
                                                    value={formData.address}
                                                    onChange={handleChange}
                                                    disabled={!isEditing}
                                                />
                                                <label htmlFor="pAddress" className="fw-mono">ĐỊA CHỈ NHẬN HÀNG MẶC ĐỊNH</label>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Khu vực nút bấm thông minh chuyển đổi trạng thái mượt */}
                                    <div className="d-flex justify-content-end gap-3 mt-5 pt-3 border-top border-cyber">
                                        {!isEditing ? (
                                            <button
                                                type="button"
                                                className="btn-cyber-profile btn-cyber-profile-edit px-4 py-2.5 fw-mono"
                                                onClick={() => setIsEditing(true)}
                                            >
                                                📝 CẬP NHẬT THÔNG TIN
                                            </button>
                                        ) : (
                                            <>
                                                <button
                                                    type="button"
                                                    className="btn-cyber-profile btn-cyber-profile-cancel px-4 py-2.5 fw-mono"
                                                    onClick={() => {
                                                        setIsEditing(false);
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            fullName: user.fullName || "",
                                                            phone: localStorage.getItem("user_phone") || "",
                                                            address: localStorage.getItem("user_address") || ""
                                                        }));
                                                    }}
                                                >
                                                    HỦY BỎ
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="btn-cyber-profile btn-cyber-profile-save px-4 py-2.5 fw-mono"
                                                    disabled={loading}
                                                >
                                                    {loading ? "⌛ ĐANG LƯU..." : "💾 XÁC NHẬN LƯU"}
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* HỆ THỐNG CSS PHONG CÁCH TƯƠNG LAI HOÀN CHỈNH */}
            <style>{`
                .profile-cyber-bg { 
                    background: radial-gradient(circle at 50% 0%, #111827 0%, #030712 100%); 
                    min-height: 90vh; 
                    font-family: 'Segoe UI', Roboto, sans-serif;
                }
                .fw-black { font-weight: 900 !important; }
                .fw-mono { font-family: SFMono-Regular, Menlo, Monaco, Consolas, monospace !important; }
                
                /* Thẻ Kính Cường Lực Cao Cấp (Glassmorphism) */
                .cyber-card {
                    background: rgba(17, 24, 39, 0.65);
                    backdrop-filter: blur(16px);
                    border: 1px solid rgba(6, 182, 212, 0.15);
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6);
                }
                .border-cyber { border-color: rgba(6, 182, 212, 0.15) !important; }

                /* Dải sáng quét qua thẻ ngẫu nhiên định kỳ */
                .cyber-shimmer {
                    position: absolute; top: 0; left: -100%; width: 50%; height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(6, 182, 212, 0.04), transparent);
                    transform: skewX(-25deg);
                    animation: shimmerAction 6s infinite linear;
                    z-index: 1;
                }
                @keyframes shimmerAction { 0% { left: -150%; } 100% { left: 150%; } }

                /* Khối bọc Ảnh Bìa tích hợp lưới không gian kỹ thuật số */
                .profile-cyber-cover { 
                    height: 160px; 
                    background: linear-gradient(135deg, #020617 0%, #0f172a 100%); 
                    position: relative; 
                    border-bottom: 1px solid rgba(6, 182, 212, 0.15);
                }
                .grid-overlay {
                    position: absolute; top: 0; left: 0; right: 0; bottom: 0;
                    background-image: linear-gradient(rgba(6, 182, 212, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.05) 1px, transparent 1px);
                    background-size: 20px 20px;
                }

                /* Hào quang xoay quanh Avatar */
                .avatar-cyber-ring {
                    width: 114px; height: 114px;
                    border: 2px dashed rgba(34, 211, 238, 0.4);
                    border-radius: 50%;
                    position: absolute; bottom: -57px; left: 50%;
                    margin-left: -57px; z-index: 2;
                }
                .animate-spin-slow { animation: spinAround 12s linear infinite; }
                @keyframes spinAround { to { transform: rotate(360deg); } }

                /* Khung bọc Avatar của tài khoản */
                .profile-avatar-cyber-wrapper { 
                    width: 100px; height: 100px; 
                    background: #090d16; 
                    border-radius: 50%; 
                    position: absolute; bottom: -50px; left: 50%; 
                    transform: translateX(-50%); 
                    display: flex; align-items: center; justify-content: center; 
                    border: 3px solid #22d3ee; 
                    box-shadow: 0 0 20px rgba(34, 211, 238, 0.4) !important;
                    z-index: 3;
                }
                .avatar-cyber-emoji { font-size: 2.6rem; filter: drop-shadow(0 0 5px rgba(255,255,255,0.2)); }
                
                /* Font phát hào quang đặc trưng */
                .text-glow { text-shadow: 0 0 15px rgba(6, 182, 212, 0.4); }
                .text-cyan { color: #22d3ee !important; letter-spacing: 2px; }

                /* Nhãn đầu vào dạng nổi tùy biến (Cyber Floating Labels) */
                .cyber-floating > .form-control {
                    background: rgba(15, 23, 42, 0.6) !important;
                    color: #ffffff !important;
                    border: 1px solid rgba(6, 182, 212, 0.2);
                    border-radius: 12px;
                    padding-top: 1.625rem; padding-bottom: 0.625rem;
                }
                .cyber-floating > label { color: #6b7280; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.5px; transition: color 0.2s; }
                .cyber-floating > .form-control:focus ~ label { color: #22d3ee; }
                
                .input-cyber-active:focus {
                    border-color: #06b6d4 !important;
                    box-shadow: 0 0 15px rgba(6, 182, 212, 0.2) !important;
                }
                .input-cyber-readonly {
                    background: rgba(255, 255, 255, 0.02) !important;
                    border-color: rgba(255, 255, 255, 0.04) !important;
                    color: #9ca3af !important;
                    cursor: not-allowed;
                }

                /* Nút bấm điều hướng thông tin */
                .btn-cyber-profile {
                    font-weight: 700; border-radius: 10px; letter-spacing: 1px; font-size: 0.85rem;
                    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .btn-cyber-profile-edit {
                    background: transparent; border: 1px solid #06b6d4; color: #22d3ee;
                }
                .btn-cyber-profile-edit:hover {
                    background: #06b6d4; color: #030712; font-weight: 800;
                    box-shadow: 0 0 15px rgba(6, 182, 212, 0.4);
                }
                .btn-cyber-profile-save {
                    background: linear-gradient(45deg, #06b6d4, #3b82f6); border: none; color: #fff;
                }
                .btn-cyber-profile-save:hover {
                    transform: translateY(-1px); box-shadow: 0 0 20px rgba(6, 182, 212, 0.4);
                }
                .btn-cyber-profile-cancel {
                    background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255,255,255,0.1); color: #9ca3af;
                }
                .btn-cyber-profile-cancel:hover { background: rgba(255, 255, 255, 0.1); color: #fff; }

                /* Hệ thống cảnh báo phát quang độc quyền */
                .alert-cyber {
                    padding: 12px 20px; border-radius: 12px; font-weight: 600; font-size: 0.9rem; text-align: left;
                }
                .alert-cyber-success { background: rgba(16, 185, 129, 0.1); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.2); box-shadow: 0 0 10px rgba(16, 185, 129, 0.1); }
                .alert-cyber-danger { background: rgba(239, 68, 68, 0.1); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.2); box-shadow: 0 0 10px rgba(239, 68, 68, 0.1); }

                /* Hiệu ứng chuyển cảnh động */
                .profile-main-card { animation: profilePopIn 0.5s ease-out forwards; }
                @keyframes profilePopIn { from { opacity: 0; transform: scale(0.97) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
                .animate-text-slide { animation: textSlideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                @keyframes textSlideIn { from { opacity: 0; transform: translateX(-15px); } to { opacity: 1; transform: translateX(0); } }
                .animate-pop { animation: alertPop 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                @keyframes alertPop { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }

                /* Hiệu ứng chờ tải */
                .loader-container { min-height: 80vh; display: flex; flex-direction: column; justify-content: center; align-items: center; background: #030712; }
                .spinner-cyber {
                    width: 45px; height: 45px; border-radius: 50%;
                    border: 3px solid transparent; border-top-color: #06b6d4; border-bottom-color: #3b82f6;
                    animation: spinCyber 1s infinite cubic-bezier(0.5, 0, 0.5, 1);
                }
                .loading-text-glow { font-family: monospace; color: #22d3ee; font-weight: bold; margin-top: 20px; letter-spacing: 1.5px; animation: textBlink 1.5s infinite; }
                @keyframes spinCyber { to { transform: rotate(360deg); } }
                @keyframes textBlink { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }
            `}</style>
        </div>
    );
}

export default Profile;