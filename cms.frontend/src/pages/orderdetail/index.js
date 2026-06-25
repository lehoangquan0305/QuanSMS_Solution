import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function OrderDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrderDetail = async () => {
            try {
                const res = await fetch(`https://localhost:7052/api/orders/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setOrderData(data);
                } else {
                    console.error("❌ Không tìm thấy đơn hàng này");
                }
            } catch (err) {
                console.error("❌ Lỗi kết nối API:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrderDetail();
    }, [id]);

    const targetItems = orderData?.items || orderData?.Items || [];
    const targetInfo = orderData?.orderInfo || orderData?.OrderInfo || null;

    const calculateTotal = () => {
        return targetItems.reduce((sum, item) => {
            const quantity = item.quantity || item.Quantity || 0;
            const unitPrice = item.unitPrice || item.UnitPrice || 0;
            return sum + (quantity * unitPrice);
        }, 0);
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
    };

    if (loading) return (
        <div className="loader-container">
            <div className="spinner-cyber"></div>
            <p className="loading-text-glow">ĐANG QUÉT DỮ LIỆU HỆ THỐNG #{id}...</p>
        </div>
    );

    if (!orderData || !targetInfo) return <div className="text-center py-5 text-danger fw-bold">❌ Không tìm thấy dữ liệu đơn hàng!</div>;

    // Xác định bước tiến trình dựa trên trạng thái
    const statusStr = (targetInfo.status || targetInfo.Status || "").toLowerCase();
    let currentStep = 1;
    if (statusStr.includes("giao") || statusStr.includes("shipping")) currentStep = 2;
    if (statusStr.includes("thành") || statusStr.includes("complete")) currentStep = 3;
    if (statusStr.includes("hủy") || statusStr.includes("cancel")) currentStep = 0; // Đơn bị hủy

    return (
        <div className="order-detail-cyber-bg py-5">
            <div className="container position-relative z-2">
                {/* Nút quay lại với hiệu ứng hover trượt trái */}
                <button className="btn-back-glow mb-4" onClick={() => navigate("/orders")}>
                    <span className="arrow">←</span> Quay lại danh sách đơn hàng
                </button>

                {/* Khung chứa hiệu ứng Kính cường lực (Glassmorphism) */}
                <div className="cyber-card p-4 p-md-5 rounded-4 position-relative overflow-hidden">
                    <div className="cyber-shimmer"></div>

                    {/* Header đơn hàng - Hiệu ứng Glow chữ */}
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center border-bottom border-cyber pb-4 mb-5 g-3">
                        <div>
                            <h2 className="fw-black text-white text-glow mb-2 animate-text-slide">
                                CHI TIẾT ĐƠN HÀNG <span className="text-gradient">#{targetInfo.id || targetInfo.Id}</span>
                            </h2>
                            <span className="text-cyan small fw-mono">
                                📅 THỜI GIAN: {new Date(targetInfo.orderDate || targetInfo.OrderDate).toLocaleString("vi-VN")}
                            </span>
                        </div>
                        <div className="mt-2 mt-md-0">
                            <span className={`badge-cyber ${currentStep === 0 ? "badge-cyber-danger" : "badge-cyber-success"}`}>
                                {targetInfo.status || targetInfo.Status}
                            </span>
                        </div>
                    </div>

                    {/* TRÊN CÙNG: THANH TIẾN TRÌNH HOẠT HỌA (TRACKER LINH HOẠT) */}
                    {currentStep > 0 && (
                        <div className="row justify-content-center mb-5">
                            <div className="col-12 col-lg-10">
                                <div className="timeline-space">
                                    <div className="timeline-progress-bar">
                                        <div
                                            className="timeline-progress-fill"
                                            style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
                                        ></div>
                                    </div>
                                    <div className="d-flex justify-content-between position-relative w-100">
                                        <div className={`step-node ${currentStep >= 1 ? "active" : ""}`}>
                                            <div className="step-circle">⏳</div>
                                            <span className="step-label">Chờ xử lý</span>
                                        </div>
                                        <div className={`step-node ${currentStep >= 2 ? "active" : ""}`}>
                                            <div className="step-circle">🚚</div>
                                            <span className="step-label">Đang giao</span>
                                        </div>
                                        <div className={`step-node ${currentStep >= 3 ? "active" : ""}`}>
                                            <div className="step-circle">✅</div>
                                            <span className="step-label">Đã hoàn thành</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* DANH SÁCH SẢN PHẨM HOẠT HỌA HOVER */}
                    <h5 className="fw-bold text-white mb-3 tracking-wide d-flex align-items-center">
                        <span className="cyber-dot me-2"></span> DANH SÁCH SẢN PHẨM ĐÃ ĐẶT
                    </h5>
                    <div className="table-responsive mb-4">
                        <table className="table cyber-table align-middle">
                            <thead>
                                <tr>
                                    <th className="py-3 px-4 text-cyan small fw-mono text-uppercase">Tên sản phẩm</th>
                                    <th className="py-3 text-cyan small fw-mono text-uppercase text-center">Số lượng</th>
                                    <th className="py-3 text-cyan small fw-mono text-uppercase text-end">Đơn giá</th>
                                    <th className="py-3 px-4 text-cyan small fw-mono text-uppercase text-end">Thành tiền</th>
                                </tr>
                            </thead>
                            <tbody>
                                {targetItems.map((item, index) => {
                                    const q = item.quantity || item.Quantity || 0;
                                    const p = item.unitPrice || item.UnitPrice || 0;
                                    return (
                                        <tr key={item.id || item.Id} className="cyber-tr" style={{ animationDelay: `${index * 0.1}s` }}>
                                            <td className="py-3 px-4 fw-bold text-white text-hover-glow">
                                                {item.productName || item.ProductName || `Sản phẩm (#${item.productId || item.ProductId})`}
                                            </td>
                                            <td className="py-3 text-center fw-bold text-cyan">x{q}</td>
                                            <td className="py-3 text-end text-muted-cyber">{formatCurrency(p)}</td>
                                            <td className="py-3 px-4 text-end fw-black text-cyan-glow">
                                                {formatCurrency(q * p)}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* KHỐI TỔNG KẾT VÀ GHI CHÚ */}
                    <div className="row g-4 mt-2">
                        <div className="col-md-7">
                            <div className="cyber-notes-box p-3 rounded-3 position-relative">
                                <span className="text-cyan small fw-mono d-block mb-2">📝 GHI CHÚ ĐƠN HÀNG</span>
                                <p className="small mb-0 text-white-50">
                                    {targetInfo.notes || targetInfo.Notes || "Hệ thống không ghi nhận ghi chú bổ sung nào từ khách hàng."}
                                </p>
                            </div>
                        </div>
                        <div className="col-md-5 text-end">
                            <div className="d-flex justify-content-between mb-2 px-2">
                                <span className="text-muted-cyber fw-semibold">Tạm tính:</span>
                                <span className="text-white fw-semibold">{formatCurrency(calculateTotal())}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-3 px-2">
                                <span className="text-muted-cyber fw-semibold">Phí vận chuyển:</span>
                                <span className="text-gradient fw-bold">FREE SHIPPING</span>
                            </div>
                            <div className="d-flex justify-content-between cyber-total-bar pt-3 px-2">
                                <h5 className="fw-black text-white m-0 d-flex align-items-center">TỔNG TOÀN BỘ:</h5>
                                <h4 className="fw-black text-gradient-price m-0 animate-pulse">{formatCurrency(calculateTotal())}</h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* TOÀN BỘ HỆ THỐNG CSS CAO CẤP TỰ ĐỘNG BẮN VÀO TRANG */}
            <style>{`
                .order-detail-cyber-bg { 
                    background: radial-gradient(circle at 50% 0%, #111827 0%, #030712 100%); 
                    min-height: 90vh; 
                    font-family: 'Segoe UI', Roboto, sans-serif;
                }
                .fw-black { font-weight: 900 !important; }
                .fw-mono { font-family: SFMono-Regular, Menlo, Monaco, Consolas, monospace !important; }
                
                /* Nút quay lại độc lạ hi-tech */
                .btn-back-glow {
                    background: transparent;
                    border: none;
                    color: #9ca3af;
                    font-weight: 700;
                    transition: all 0.3s ease;
                    position: relative;
                }
                .btn-back-glow .arrow { display: inline-block; transition: transform 0.3s ease; }
                .btn-back-glow:hover { color: #06b6d4; }
                .btn-back-glow:hover .arrow { transform: translateX(-5px); }

                /* Thẻ Kính Cường Lực Cao Cấp (Glassmorphism) */
                .cyber-card {
                    background: rgba(17, 24, 39, 0.7);
                    backdrop-filter: blur(16px);
                    border: 1px solid rgba(6, 182, 212, 0.15);
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(6, 182, 212, 0.03);
                }
                .border-cyber { border-color: rgba(6, 182, 212, 0.15) !important; }
                
                /* Hiệu ứng quét sáng lướt qua thẻ ngẫu nhiên */
                .cyber-shimmer {
                    position: absolute; top: 0; left: -100%; width: 50%; height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(6, 182, 212, 0.05), transparent);
                    transform: skewX(-25deg);
                    animation: shimmerAction 6s infinite linear;
                }
                @keyframes shimmerAction { 0% { left: -150%; } 100% { left: 150%; } }

                /* Chữ Đổ Hào Quang & Dải Màu */
                .text-glow { text-shadow: 0 0 15px rgba(6, 182, 212, 0.4); }
                .text-cyan { color: #22d3ee !important; }
                .text-cyan-glow { color: #22d3ee; text-shadow: 0 0 10px rgba(34, 211, 238, 0.3); }
                .text-muted-cyber { color: #9ca3af; }
                .text-gradient { background: linear-gradient(45deg, #06b6d4, #3b82f6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
                .text-gradient-price { background: linear-gradient(45deg, #f43f5e, #f59e0b); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }

                /* Badge trạng thái phát quang */
                .badge-cyber {
                    padding: 8px 24px; font-weight: 800; border-radius: 50px; text-transform: uppercase; letter-spacing: 1px; font-size: 0.85rem;
                }
                .badge-cyber-success { background: rgba(16, 185, 129, 0.15); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3); box-shadow: 0 0 15px rgba(16, 185, 129, 0.2); }
                .badge-cyber-danger { background: rgba(239, 68, 68, 0.15); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3); box-shadow: 0 0 15px rgba(239, 68, 68, 0.2); }

                /* CHẤT RIÊNG: BỘ ĐO TIẾN TRÌNH HOẠT HỌA (TIMELINE) */
                .timeline-space { position: relative; display: flex; align-items: center; padding: 20px 0; }
                .timeline-progress-bar { position: absolute; top: 38px; left: 0; width: 100%; height: 4px; background: rgba(255,255,255,0.08); z-index: 1; border-radius: 2px; }
                .timeline-progress-fill { height: 100%; background: linear-gradient(90deg, #06b6d4, #3b82f6); transition: width 1s ease-in-out; }
                .step-node { position: relative; z-index: 2; display: flex; flex-direction: column; align-items: center; }
                .step-circle {
                    width: 40px; height: 40px; border-radius: 50%; background: #1f2937; border: 2px solid rgba(255,255,255,0.1);
                    display: flex; align-items: center; justify-content: center; font-size: 1.1rem; transition: all 0.4s ease;
                }
                .step-label { margin-top: 10px; font-size: 0.8rem; font-weight: 700; color: #6b7280; transition: color 0.4s ease; }
                .step-node.active .step-circle {
                    background: #030712; border-color: #06b6d4; box-shadow: 0 0 15px rgba(6, 182, 212, 0.6); transform: scale(1.1);
                }
                .step-node.active .step-label { color: #22d3ee; text-shadow: 0 0 8px rgba(34, 211, 238, 0.2); }

                /* BẢNG DỮ LIỆU HI-TECH VỚI HOẠT HỌA CHẠY DÒNG */
                .cyber-dot { width: 8px; height: 8px; border-radius: 50%; background: #06b6d4; display: inline-block; box-shadow: 0 0 8px #06b6d4; }
                .cyber-table { margin-top: 15px; }
                .cyber-table thead { background: rgba(255, 255, 255, 0.03); border-bottom: 2px solid rgba(6, 182, 212, 0.2); }
                .cyber-tr { 
                    border-bottom: 1px solid rgba(255,255,255,0.04); opacity: 0; transform: translateY(15px);
                    animation: rowFadeIn 0.5s ease-out forwards;
                }
                .cyber-tr:hover { background: rgba(6, 182, 212, 0.03); transition: background 0.2s; }
                .text-hover-glow:hover { color: #22d3ee !important; text-shadow: 0 0 8px rgba(34, 211, 238, 0.5); cursor: default; }

                /* Hộp ghi chú */
                .cyber-notes-box { background: rgba(255, 255, 255, 0.02); border-left: 3px solid #3b82f6; }
                .cyber-total-bar { border-top: 1px dashed rgba(6, 182, 212, 0.3) !important; }

                /* HIỆU ỨNG HOẠT HỌA GỐC (KEYFRAMES) */
                @keyframes rowFadeIn { to { opacity: 1; transform: translateY(0); } }
                .animate-text-slide { animation: textSlideIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                @keyframes textSlideIn { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
                .animate-pulse { animation: pulseGlow 2s infinite ease-in-out; }
                @keyframes pulseGlow { 0%, 100% { transform: scale(1); filter: drop-shadow(0 0 2px rgba(244,63,94,0.3)); } 50% { transform: scale(1.02); filter: drop-shadow(0 0 10px rgba(244,63,94,0.6)); } }

                /* Bộ đếm thời gian xoay Cyber lúc load */
                .loader-container { min-height: 80vh; display: flex; flex-direction: column; justify-content: center; align-items: center; background: #030712; }
                .spinner-cyber {
                    width: 50px; height: 50px; border-radius: 50%;
                    border: 3px solid transparent; border-top-color: #06b6d4; border-bottom-color: #3b82f6;
                    animation: spinCyber 1.2s infinite cubic-bezier(0.5, 0, 0.5, 1);
                }
                .loading-text-glow { font-family: monospace; color: #22d3ee; font-weight: bold; margin-top: 20px; letter-spacing: 2px; animation: textBlink 1.5s infinite; }
                @keyframes spinCyber { to { transform: rotate(360deg); } }
                @keyframes textBlink { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }
            `}</style>
        </div>
    );
}

export default OrderDetail;