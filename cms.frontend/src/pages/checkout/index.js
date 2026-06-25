import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Checkout() {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [form, setForm] = useState({
        fullName: "",
        phone: "",
        email: "",
        address: "",
        note: ""
    });

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        const cart = JSON.parse(localStorage.getItem("cart")) || [];

        if (!user) {
            navigate("/login");
            return;
        }

        if (cart.length === 0) {
            navigate("/cart");
            return;
        }

        setCartItems(cart);

        setForm(prev => ({
            ...prev,
            fullName: user.fullName || user.name || "",
            email: user.email || "",
            phone: localStorage.getItem("user_phone") || user.phone || user.phoneNumber || "",
            address: localStorage.getItem("user_address") || user.address || user.street || ""
        }));

    }, [navigate]);

    const totalPrice = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const validate = () => {
        if (!form.fullName.trim()) return SwalError("Vui lòng nhập họ tên");
        if (!form.phone.trim()) return SwalError("Vui lòng nhập số điện thoại");
        if (!/^[0-9]{10}$/.test(form.phone.trim())) return SwalError("Số điện thoại phải chứa đúng 10 chữ số");
        if (!form.address.trim()) return SwalError("Vui lòng cung cấp địa chỉ giao hàng");
        setError("");
        return true;
    };

    const SwalError = (msg) => {
        setError(msg);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return false;
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        const user = JSON.parse(localStorage.getItem("user"));

        try {
            setLoading(true);
            setError("");
            setSuccess("");

            const payload = {
                customerId: user.id,
                notes: form.note,
                items: cartItems.map(item => ({
                    productId: item.id,
                    quantity: item.quantity
                }))
            };

            const res = await fetch("https://localhost:7052/api/Orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Đặt hàng thất bại. Vui lòng thử lại!");
                return;
            }

            setSuccess("🎉 Đặt hàng thành công! Cảm ơn bạn đã mua sắm.");
            localStorage.removeItem("cart");
            window.dispatchEvent(new Event("cartUpdated"));

            setTimeout(() => {
                navigate("/");
            }, 2000);

        } catch (err) {
            setError("Lỗi kết nối hệ thống viễn thông!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="checkout-bg content-fade-in py-5">
            {/* Vòng tròn gradient trang trí nền chuyển động mờ ảo */}
            <div className="orb orb-1"></div>
            <div className="orb orb-2"></div>

            <div className="container position-relative" style={{ zIndex: 2 }}>
                {/* Breadcrumb */}
                <nav className="mb-4">
                    <ol className="breadcrumb small text-muted">
                        <li className="breadcrumb-item">
                            <Link to="/cart" className="text-decoration-none text-secondary custom-link">Giỏ hàng</Link>
                        </li>
                        <li className="breadcrumb-item active-gradient fw-bold">Xác nhận thanh toán</li>
                    </ol>
                </nav>

                <div className="row g-4">
                    {/* KHỐI NHẬP THÔNG TIN (BÊN TRÁI) */}
                    <div className="col-lg-7">
                        <div className="card border-0 shadow-premium card-custom-blur animate-card-entry">
                            <div className="card-body p-4 p-md-5">
                                <div className="d-flex align-items-center gap-3 mb-4">
                                    <div className="icon-badge dynamic-gradient-icon">📦</div>
                                    <h3 className="m-0 fw-bold title-gradient">Thông Tin Giao Hàng</h3>
                                </div>

                                {error && <div className="alert alert-custom alert-danger animate-shake">{error}</div>}
                                {success && <div className="alert alert-custom alert-success animate-pop">{success}</div>}

                                <form onSubmit={(e) => e.preventDefault()} className="mt-4">
                                    {/* Họ và tên (Disabled nhưng vẫn mướt) */}
                                    <div className="form-floating mb-4">
                                        <input
                                            name="fullName"
                                            type="text"
                                            className="form-control input-lock"
                                            id="floatingName"
                                            value={form.fullName}
                                            disabled
                                        />
                                        <label htmlFor="floatingName">Họ và tên khách hàng</label>
                                    </div>

                                    {/* Email (Disabled) */}
                                    <div className="form-floating mb-4">
                                        <input
                                            name="email"
                                            type="email"
                                            className="form-control input-lock"
                                            id="floatingEmail"
                                            value={form.email}
                                            disabled
                                        />
                                        <label htmlFor="floatingEmail">Địa chỉ Email</label>
                                    </div>

                                    {/* Số điện thoại (Hiệu ứng viền phát sáng động) */}
                                    <div className="form-floating mb-4 input-gradient-wrapper">
                                        <input
                                            name="phone"
                                            type="tel"
                                            className="form-control input-premium"
                                            id="floatingPhone"
                                            placeholder="Số điện thoại"
                                            value={form.phone}
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="floatingPhone">Số điện thoại liên hệ *</label>
                                        <div className="input-glow-line"></div>
                                    </div>

                                    {/* Địa chỉ nhận hàng */}
                                    <div className="form-floating mb-4 input-gradient-wrapper">
                                        <textarea
                                            name="address"
                                            className="form-control input-premium"
                                            id="floatingAddress"
                                            placeholder="Địa chỉ giao hàng"
                                            style={{ height: "110px" }}
                                            value={form.address}
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="floatingAddress">Địa chỉ giao hàng chi tiết *</label>
                                        <div className="input-glow-line"></div>
                                    </div>

                                    {/* Ghi chú đơn hàng */}
                                    <div className="form-floating mb-4 input-gradient-wrapper">
                                        <textarea
                                            name="note"
                                            className="form-control input-premium"
                                            id="floatingNote"
                                            placeholder="Ghi chú"
                                            style={{ height: "90px" }}
                                            value={form.note}
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="floatingNote">Ghi chú cho đơn hàng (Tùy chọn)</label>
                                        <div className="input-glow-line"></div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* TÓM TẮT ĐƠN HÀNG (BÊN PHẢI) */}
                    <div className="col-lg-5">
                        <div className="card border-0 shadow-premium sticky-top-card animate-card-entry" style={{ animationDelay: "0.15s" }}>
                            <div className="card-body p-4">
                                <div className="d-flex align-items-center gap-3 mb-4">
                                    <div className="icon-badge dynamic-gradient-icon">🛒</div>
                                    <h3 className="m-0 fw-bold title-gradient">Đơn Hàng</h3>
                                </div>

                                <div className="cart-items-preview-list group-scroll">
                                    {cartItems.map(item => (
                                        <div key={item.id} className="d-flex align-items-center justify-content-between py-3 border-bottom-dash item-hover-effect">
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="position-relative-wrapper">
                                                    <img
                                                        src={item.imageUrl}
                                                        alt={item.name}
                                                        className="rounded-3 border object-fit-cover img-premium-preview"
                                                        style={{ width: "60px", height: "60px" }}
                                                    />
                                                    <span className="position-absolute translate-middle badge rounded-pill bg-gradient-dark">
                                                        {item.quantity}
                                                    </span>
                                                </div>
                                                <div>
                                                    <h6 className="mb-0 fw-bold text-dark text-truncate" style={{ maxWidth: "180px" }}>{item.name}</h6>
                                                    <small className="text-muted-premium">{item.price.toLocaleString("vi-VN")} đ</small>
                                                </div>
                                            </div>
                                            <div className="fw-bold price-text-color">
                                                {(item.price * item.quantity).toLocaleString("vi-VN")} đ
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Chi phí tính toán phụ */}
                                <div className="mt-4 space-y-3">
                                    <div className="d-flex justify-content-between text-muted small">
                                        <span>Tạm tính</span>
                                        <span className="fw-medium">{totalPrice.toLocaleString("vi-VN")} đ</span>
                                    </div>
                                    <div className="d-flex justify-content-between text-muted small">
                                        <span>Phí vận chuyển</span>
                                        <span className="text-gradient-success fw-bold">Miễn phí</span>
                                    </div>
                                    <hr className="my-3 text-muted opacity-25" />
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span className="fw-bold text-dark fs-5">Tổng thanh toán</span>
                                        <span className="fw-black neon-price-text fs-4">{totalPrice.toLocaleString("vi-VN")} đ</span>
                                    </div>
                                </div>

                                <button
                                    className="btn btn-premium-pay w-100 mt-4 d-flex align-items-center justify-content-center gap-2"
                                    onClick={handleSubmit}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm dynamic-spinner" role="status" aria-hidden="true"></span>
                                            <span className="letter-spacing-glow">ĐANG XỬ LÝ GIAO DỊCH...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>🔒 XÁC NHẬN ĐẶT HÀNG</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* STYLESHEET HOÀN THIỆN ĐỈNH CAO - HOẠT ẢNH ĐỘNG HẤP DẪN */}
            <style>{`
                /* NỀN CHUYỂN ĐỘNG TRÊN CẢ TUYỆT VỜI */
                .checkout-bg {
                    background-color: #0b0f19;
                    background-image: 
                        radial-gradient(at 0% 0%, rgba(30, 41, 59, 0.5) 0px, transparent 50%),
                        radial-gradient(at 50% 0%, rgba(15, 23, 42, 0.8) 0px, transparent 50%),
                        radial-gradient(at 100% 100%, rgba(17, 24, 39, 0.6) 0px, transparent 50%);
                    min-height: 100vh;
                    position: relative;
                    overflow: hidden;
                }

                /* CÁC ĐỐM SÁNG ORB DI CHUYỂN CHẬM MƠ MÀNG */
                .orb {
                    position: absolute;
                    width: 400px;
                    height: 400px;
                    border-radius: 50%;
                    filter: blur(120px);
                    opacity: 0.25;
                    z-index: 1;
                    pointer-events: none;
                }
                .orb-1 {
                    background: linear-gradient(135deg, #a855f7, #6366f1);
                    top: -10%;
                    left: -10%;
                    animation: floatOrb 12s infinite alternate ease-in-out;
                }
                .orb-2 {
                    background: linear-gradient(135deg, #3b82f6, #ec4899);
                    bottom: -10%;
                    right: -10%;
                    animation: floatOrb 16s infinite alternate-reverse ease-in-out;
                }

                @keyframes floatOrb {
                    0% { transform: translate(0, 0) scale(1); }
                    100% { transform: translate(40px, 60px) scale(1.15); }
                }

                /* PREMIUM SHADOWS & BLUR GLASS */
                .shadow-premium {
                    box-shadow: 0 30px 60px rgba(0, 0, 0, 0.4) !important;
                    border: 1px solid rgba(255, 255, 255, 0.07) !important;
                    border-radius: 24px !important;
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }
                .card-custom-blur {
                    background: rgba(15, 23, 42, 0.65) !important;
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                }

                /* CHỮ & TIÊU ĐỀ GRADIENT */
                .title-gradient {
                    background: linear-gradient(135deg, #ffffff 30%, #94a3b8 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .active-gradient {
                    background: linear-gradient(90deg, #6366f1, #ec4899);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .text-muted-premium { color: #94a3b8; }
                .price-text-color { color: #f8fafc; }

                /* ICON BADGE SÁNG ĐỘNG */
                .dynamic-gradient-icon {
                    background: rgba(255, 255, 255, 0.05) !important;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    box-shadow: 0 4px 15px rgba(99, 102, 241, 0.15);
                }

                /* HỘP QUẤN INPUT ĐỂ TẠO HIỆU ỨNG VIỀN SÁNG ĐỘNG */
                .input-gradient-wrapper {
                    position: relative;
                    border-radius: 14px;
                    overflow: hidden;
                }
                .input-glow-line {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    height: 2px;
                    background: linear-gradient(90deg, transparent, #6366f1, #ec4899, transparent);
                    transform: scaleX(0);
                    transition: transform 0.4s ease;
                    z-index: 3;
                }
                .input-gradient-wrapper:focus-within .input-glow-line {
                    transform: scaleX(1);
                }

                /* INPUT TRẠNG THÁI CAO CẤP */
                .input-premium {
                    background-color: rgba(30, 41, 59, 0.4) !important;
                    border: 1px solid rgba(255, 255, 255, 0.1) !important;
                    border-radius: 14px !important;
                    color: #ffffff !important;
                    font-weight: 500;
                    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .input-premium:focus {
                    background-color: rgba(30, 41, 59, 0.7) !important;
                    border-color: rgba(99, 102, 241, 0.4) !important;
                    box-shadow: 0 0 20px rgba(99, 102, 241, 0.15) !important;
                }
                .form-floating > label {
                    color: #64748b;
                    transition: transform 0.25s ease, color 0.25s ease;
                }
                .input-premium:focus ~ label,
                .input-premium:not(:placeholder-shown) ~ label {
                    color: #a5b4fc !important;
                }

                /* KHÓA INPUT NHƯNG VẪN ĐẸP */
                .input-lock {
                    background-color: rgba(15, 23, 42, 0.5) !important;
                    border: 1px solid rgba(255, 255, 255, 0.04) !important;
                    border-radius: 14px !important;
                    color: #475569 !important;
                    cursor: not-allowed;
                }

                /* NÚT THANH TOÁN LUXURY VỚI HÀO QUANG CỰC ĐỈNH */
                .btn-premium-pay {
                    background: linear-gradient(135deg, #6366f1 0%, #4f46e5 50%, #d946ef 100%);
                    background-size: 200% auto;
                    color: #ffffff;
                    border: none;
                    border-radius: 16px;
                    padding: 18px;
                    font-size: 1.05rem;
                    font-weight: 800;
                    letter-spacing: 1px;
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    box-shadow: 0 10px 30px rgba(99, 102, 241, 0.35);
                }
                .btn-premium-pay:hover:not(:disabled) {
                    background-position: right center;
                    transform: translateY(-3px) scale(1.02);
                    box-shadow: 0 15px 35px rgba(217, 70, 239, 0.45);
                }
                .btn-premium-pay:active:not(:disabled) {
                    transform: translateY(-1px) scale(1);
                }

                /* GIÁ TIỀN NEON PHÁT SÁNG CHẸT MẮT */
                .neon-price-text {
                    color: #f43f5e;
                    font-weight: 900;
                    text-shadow: 0 0 12px rgba(244, 63, 94, 0.4);
                }
                .text-gradient-success {
                    background: linear-gradient(90deg, #10b981, #34d399);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                /* CHI TIẾT SẢN PHẨM HOẠT ẢNH */
                .bg-gradient-dark {
                    background: linear-gradient(135deg, #1e293b, #0f172a);
                    color: #fff;
                    border: 1px solid rgba(255,255,255,0.2);
                    top: -5px;
                    right: -5px;
                }
                .position-relative-wrapper { position: relative; }
                .img-premium-preview {
                    border: 1px solid rgba(255, 255, 255, 0.08) !important;
                }
                .item-hover-effect {
                    transition: transform 0.2s ease;
                }
                .item-hover-effect:hover {
                    transform: translateX(4px);
                }

                /* HIỆU ỨNG VÀO TRANG MƯỢT MÀ */
                .content-fade-in {
                    animation: pageBlurIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                .animate-card-entry {
                    opacity: 0;
                    transform: translateY(30px);
                    animation: cardSlideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                @keyframes pageBlurIn {
                    from { filter: blur(10px); opacity: 0; }
                    to { filter: blur(0); opacity: 1; }
                }
                @keyframes cardSlideUp {
                    to { opacity: 1; transform: translateY(0); }
                }

                /* SHAKE LỖI VÀ POP THÀNH CÔNG CHUYÊN NGHIỆP */
                .animate-shake { animation: shake 0.4s ease-in-out; }
                .animate-pop { animation: pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-8px); }
                    75% { transform: translateX(8px); }
                }
                @keyframes pop {
                    from { transform: scale(0.9); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .sticky-top-card {
                    position: sticky;
                    top: 30px;
                    z-index: 10;
                }
            `}</style>
        </div>
    );
}

export default Checkout;