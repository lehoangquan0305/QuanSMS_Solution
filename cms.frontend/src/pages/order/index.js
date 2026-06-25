import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Orders() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser) {
            navigate("/login");
            return;
        }
        setUser(storedUser);

        const fetchOrders = async () => {
            try {
                const customerId = storedUser.id || storedUser.Id;
                const res = await fetch(`https://localhost:7052/api/orders/customer/${customerId}`);
                if (res.ok) {
                    const data = await res.json();
                    setOrders(data);
                }
            } catch (err) {
                console.error("❌ Lỗi kết nối API đơn hàng:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [navigate]);

    const formatDate = (dateStr) => {
        if (!dateStr) return "Chưa rõ ngày";
        return new Date(dateStr).toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    // Hàm xuất badge trạng thái phát sáng cực chất theo logic text
    const renderStatusBadge = (status) => {
        const statusStr = (status || "").toLowerCase();
        if (statusStr.includes("giao") || statusStr.includes("shipping")) {
            return <span className="badge-cyber badge-cyber-info">🚚 Đang giao hàng</span>;
        }
        if (statusStr.includes("thành") || statusStr.includes("complete")) {
            return <span className="badge-cyber badge-cyber-success">✅ Đã hoàn thành</span>;
        }
        if (statusStr.includes("hủy") || statusStr.includes("cancel")) {
            return <span className="badge-cyber badge-cyber-danger">❌ Đã hủy đơn</span>;
        }
        return <span className="badge-cyber badge-cyber-warning">⏳ Chờ xử lý</span>;
    };

    if (loading) return (
        <div className="loader-container">
            <div className="spinner-cyber"></div>
            <p className="loading-text-glow">ĐANG KẾT NỐI TRUNG TÂM DỮ LIỆU ĐƠN HÀNG...</p>
        </div>
    );

    return (
        <div className="orders-cyber-bg py-5">
            <div className="container position-relative z-2">

                {/* Header trang danh sách với hiệu ứng chữ trượt và đổ bóng neon */}
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3">
                    <div>
                        <h2 className="fw-black text-white text-glow mb-1 animate-text-slide">
                            QUẢN LÝ <span className="text-gradient">ĐƠN HÀNG</span>
                        </h2>
                        <p className="text-muted-cyber small mb-0 fw-mono">Hệ thống theo dõi lịch sử và trạng thái kiện hàng của bạn</p>
                    </div>
                    <span className="fw-bold text-cyan text-uppercase fs-7 tracking-wider px-3 py-1 bg-cyber-tag rounded-3 fw-mono">
                        👤 KH: {user?.fullName || user?.FullName}
                    </span>
                </div>

                {orders.length === 0 ? (
                    /* Giao diện trống khi chưa mua hàng */
                    <div className="cyber-card text-center p-5 rounded-4 position-relative overflow-hidden animate-fade-in">
                        <div className="fs-1 mb-3 animate-bounce">🛍️</div>
                        <h4 className="fw-bold text-white mb-2 text-glow">Lịch sử đơn hàng trống!</h4>
                        <p className="text-muted-cyber small mb-4">Hệ thống chưa ghi nhận bất kỳ giao dịch nào từ tài khoản này.</p>
                        <button className="btn-cyber btn-cyber-primary px-4 py-2" onClick={() => navigate("/")}>
                            🛒 Khám phá cửa hàng ngay
                        </button>
                    </div>
                ) : (
                    /* Danh sách đơn hàng dạng thẻ cao cấp đổ thác */
                    <div className="row g-4">
                        {orders.map((order, index) => (
                            <div className="col-12" key={order.id || order.Id}>
                                <div
                                    className="cyber-card order-row-card p-4 rounded-4 position-relative overflow-hidden"
                                    style={{ animationDelay: `${index * 0.08}s` }}
                                >
                                    {/* Dải sáng quét qua thẻ định kỳ */}
                                    <div className="cyber-shimmer"></div>

                                    <div className="row align-items-center g-3">
                                        {/* Mã đơn & Ngày đặt */}
                                        <div className="col-md-3">
                                            <span className="text-cyan small fw-mono text-uppercase d-block mb-1">MÃ ĐƠN HÀNG</span>
                                            <h5 className="fw-black text-white mb-2 text-hover-glow">#{order.id || order.Id}</h5>
                                            <span className="text-muted-cyber text-xs d-block fw-mono">
                                                📅 {formatDate(order.orderDate || order.OrderDate)}
                                            </span>
                                        </div>

                                        {/* Ghi chú đơn hàng */}
                                        <div className="col-md-4">
                                            <span className="text-cyan small fw-mono text-uppercase d-block mb-1">GHI CHÚ HỆ THỐNG</span>
                                            <p className="text-white-50 small mb-0 text-truncate" style={{ maxWidth: "280px" }}>
                                                {order.notes || order.Notes || "Không có ghi chú bổ sung"}
                                            </p>
                                        </div>

                                        {/* Trạng thái phát quang thông minh */}
                                        <div className="col-md-3 text-md-center">
                                            <span className="text-cyan small fw-mono text-uppercase d-none d-md-block mb-2">TRẠNG THÁI</span>
                                            {renderStatusBadge(order.status || order.Status)}
                                        </div>

                                        {/* Nút bấm chuyển tiếp với hiệu ứng quét neon khi di chuột */}
                                        <div className="col-md-2 text-md-end">
                                            <button
                                                className="btn-cyber btn-cyber-outline w-100 py-2.5"
                                                onClick={() => navigate(`/orders/${order.id || order.Id}`)}
                                            >
                                                🔍 CHI TIẾT
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* HỆ THỐNG TOÀN BỘ CSS PHỤC VỤ STYLE VIP PRO */}
            <style>{`
                .orders-cyber-bg { 
                    background: radial-gradient(circle at 50% 0%, #111827 0%, #030712 100%); 
                    min-height: 90vh; 
                    font-family: 'Segoe UI', Roboto, sans-serif;
                }
                .fw-black { font-weight: 900 !important; }
                .fw-mono { font-family: SFMono-Regular, Menlo, Monaco, Consolas, monospace !important; }
                .fs-7 { font-size: 0.85rem; }
                .text-xs { font-size: 0.78rem; }
                
                /* Thẻ Kính Cường Lực Cao Cấp (Glassmorphism) */
                .cyber-card {
                    background: rgba(17, 24, 39, 0.65);
                    backdrop-filter: blur(16px);
                    border: 1px solid rgba(6, 182, 212, 0.15);
                    box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.5);
                }

                /* Hoạt họa đổ dòng thác (Cascade Row Animations) */
                .order-row-card {
                    opacity: 0;
                    transform: translateY(20px);
                    animation: rowSlideUp 0.5s ease-out forwards;
                    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
                }
                .order-row-card:hover {
                    transform: translateY(-3px) scale(1.005);
                    border-color: rgba(6, 182, 212, 0.4);
                    box-shadow: 0 25px 50px rgba(6, 182, 212, 0.08), 0 0 30px rgba(6, 182, 212, 0.03);
                }

                /* Dải quét sáng mượt mà định kỳ */
                .cyber-shimmer {
                    position: absolute; top: 0; left: -100%; width: 50%; height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(6, 182, 212, 0.04), transparent);
                    transform: skewX(-25deg);
                    animation: shimmerAction 7s infinite linear;
                }
                @keyframes shimmerAction { 0% { left: -150%; } 100% { left: 150%; } }

                /* Màu sắc và Chữ phát quang */
                .text-glow { text-shadow: 0 0 15px rgba(6, 182, 212, 0.4); }
                .text-cyan { color: #22d3ee !important; }
                .text-muted-cyber { color: #9ca3af; }
                .text-hover-glow:hover { color: #22d3ee !important; text-shadow: 0 0 10px rgba(34, 211, 238, 0.6); }
                .text-gradient { background: linear-gradient(45deg, #06b6d4, #3b82f6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
                .bg-cyber-tag { background: rgba(6, 182, 212, 0.08); border: 1px solid rgba(6, 182, 212, 0.15); }

                /* Nút bấm Phong cách Tương lai */
                .btn-cyber {
                    font-weight: 700; border-radius: 8px; letter-spacing: 1px; font-family: monospace;
                    transition: all 0.25s ease; position: relative; overflow: hidden;
                }
                .btn-cyber-outline {
                    background: transparent; border: 1px solid #06b6d4; color: #22d3ee;
                    box-shadow: inset 0 0 0 rgba(6, 182, 212, 0);
                }
                .btn-cyber-outline:hover {
                    background: #06b6d4; color: #030712; font-weight: 800;
                    box-shadow: 0 0 15px rgba(6, 182, 212, 0.5);
                }
                .btn-cyber-primary {
                    background: linear-gradient(45deg, #06b6d4, #3b82f6); border: none; color: #fff;
                }
                .btn-cyber-primary:hover {
                    transform: translateY(-1px); box-shadow: 0 0 20px rgba(6, 182, 212, 0.4);
                }

                /* Hệ thống Badge Cyber phát quang đa sắc */
                .badge-cyber {
                    padding: 8px 18px; font-weight: 800; border-radius: 50px; text-transform: uppercase; 
                    letter-spacing: 0.5px; font-size: 0.78rem; font-family: monospace; display: inline-block;
                }
                .badge-cyber-warning { background: rgba(245, 158, 11, 0.12); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.25); box-shadow: 0 0 12px rgba(245, 158, 11, 0.1); }
                .badge-cyber-info { background: rgba(6, 182, 212, 0.12); color: #22d3ee; border: 1px solid rgba(6, 182, 212, 0.25); box-shadow: 0 0 12px rgba(6, 182, 212, 0.1); }
                .badge-cyber-success { background: rgba(16, 185, 129, 0.12); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.25); box-shadow: 0 0 12px rgba(16, 185, 129, 0.1); }
                .badge-cyber-danger { background: rgba(239, 68, 68, 0.12); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.25); box-shadow: 0 0 12px rgba(239, 68, 68, 0.1); }

                /* Hoạt họa chuyển động mượt */
                @keyframes rowSlideUp { to { opacity: 1; transform: translateY(0); } }
                .animate-text-slide { animation: textSlideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                @keyframes textSlideIn { from { opacity: 0; transform: translateX(-15px); } to { opacity: 1; transform: translateX(0); } }
                .animate-bounce { animation: bounceIcon 2s infinite ease-in-out; }
                @keyframes bounceIcon { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }

                /* Màn hình chờ nạp dữ liệu quay Cyber */
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

export default Orders;