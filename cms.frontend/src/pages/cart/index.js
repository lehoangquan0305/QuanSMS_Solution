import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Cart() {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        setCartItems(cart);
    }, []);

    const saveCart = (data) => {
        setCartItems(data);
        localStorage.setItem("cart", JSON.stringify(data));
        window.dispatchEvent(new Event("cartUpdated"));
    };

    const increaseQty = (id) => {
        const newCart = cartItems.map(item =>
            item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        );
        saveCart(newCart);
    };

    const decreaseQty = (id) => {
        const newCart = cartItems.map(item =>
            item.id === id
                ? { ...item, quantity: item.quantity > 1 ? item.quantity - 1 : 1 }
                : item
        );
        saveCart(newCart);
    };

    const removeItem = (id) => {
        const newCart = cartItems.filter(item => item.id !== id);
        saveCart(newCart);
    };

    const totalPrice = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    return (
        <div style={styles.cartPage}>
            <div className="container py-5" style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px" }}>

                <h1 style={styles.cartTitle} className="cyber-glitch-title">
                    <span style={{ marginRight: "12px" }}>🛒</span> GIỎ HÀNG CỦA BẠN
                </h1>

                {cartItems.length === 0 ? (
                    <div style={styles.emptyCart} className="cyber-fade-in">
                        <div style={styles.emptyIcon} className="bounce-animation">👟</div>
                        <h3 style={{ fontSize: "1.6rem", fontWeight: "800", marginBottom: "12px", color: "#ffffff", fontFamily: "monospace" }}>
                            GIỎ HÀNG ĐANG TRỐNG!
                        </h3>
                        <p style={{ color: "#94a3b8", marginBottom: "30px", fontSize: "0.95rem" }}>
                            Hãy khám phá những đôi giày Adidas mới nhất cùng Lê Hoàng Quân.
                        </p>
                        <Link to="/shop" style={styles.shopNowBtn} className="cyber-btn-primary">
                            MUA SẮM NGAY
                        </Link>
                    </div>
                ) : (
                    <div style={styles.cartLayout}>

                        {/* DANH SÁCH SẢN PHẨM (BÊN TRÁI) */}
                        <div style={styles.cartList}>
                            {cartItems.map((item, index) => (
                                <div
                                    key={item.id}
                                    style={{ ...styles.cartItemCard, animationDelay: `${index * 0.08}s` }}
                                    className="cyber-item-card"
                                >
                                    <div style={styles.imgWrapper} className="cyber-img-glow">
                                        <img
                                            src={item.imageUrl}
                                            alt={item.name}
                                            style={styles.cartImage}
                                        />
                                    </div>

                                    <div style={styles.cartInfo}>
                                        <h4 style={styles.itemName} className="cyber-text-hover">{item.name}</h4>
                                        <p style={styles.itemPrice}>{item.price.toLocaleString()} VNĐ</p>

                                        {/* Bộ tăng giảm số lượng */}
                                        <div style={styles.qtyBox} className="cyber-qty-container">
                                            <button style={styles.qtyBtn} className="cyber-qty-action" onClick={() => decreaseQty(item.id)}>-</button>
                                            <span style={styles.qtyNumber}>{item.quantity}</span>
                                            <button style={styles.qtyBtn} className="cyber-qty-action" onClick={() => increaseQty(item.id)}>+</button>
                                        </div>
                                    </div>

                                    <div style={styles.cartRight}>
                                        <h5 style={styles.itemSubtotal}>
                                            {(item.price * item.quantity).toLocaleString()} VNĐ
                                        </h5>
                                        <button style={styles.removeBtn} onClick={() => removeItem(item.id)} className="cyber-remove-btn">
                                            🗑 Xóa vật phẩm
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* HÓA ĐƠN TÓM TẮT (BÊN PHẢI) */}
                        <div style={styles.cartSummary}>
                            <div style={styles.summaryCard} className="cyber-summary-box">
                                <h3 style={styles.summaryTitle}>TÓM TẮT ĐƠN HÀNG</h3>
                                <hr style={styles.divider} />

                                <div style={styles.summaryRow}>
                                    <span>Số lượng cấu hình</span>
                                    <span style={{ fontWeight: "700", color: "#ffffff" }}>{cartItems.reduce((total, item) => total + item.quantity, 0)} đôi</span>
                                </div>

                                <div style={styles.summaryRow}>
                                    <span>Giao thức vận chuyển</span>
                                    <span style={{ color: "#22c55e", fontWeight: "700", textShadow: "0 0 10px rgba(34,197,94,0.3)" }}>FREE SHIP</span>
                                </div>

                                <hr style={styles.divider} />

                                <div style={styles.summaryTotal}>
                                    <span>TỔNG TIỀN</span>
                                    <span style={styles.totalPriceText}>{totalPrice.toLocaleString()} VNĐ</span>
                                </div>

                                <Link to="/checkout" style={styles.checkoutBtn} className="cyber-btn-checkout">
                                    TIẾN HÀNH THANH TOÁN ⚡
                                </Link>
                            </div>
                        </div>

                    </div>
                )}
            </div>

            {/* MÃ CSS TƯƠNG TÁC ĐỘC QUYỀN VŨ TRỤ CYBERPUNK */}
            <style>{`
                @keyframes bounce {
                    0%, 100% { transform: translateY(0) scale(1); }
                    50% { transform: translateY(-15px) scale(1.1); filter: drop-shadow(0 0 15px #06b6d4); }
                }
                @keyframes cyberFadeUp {
                    from { opacity: 0; transform: translateY(25px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                .cyber-fade-in {
                    animation: cyberFadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }

                .bounce-animation {
                    animation: bounce 2.5s infinite ease-in-out;
                    display: inline-block;
                }

                /* Hiệu ứng mượt mà cho card item sản phẩm */
                .cyber-item-card {
                    opacity: 0;
                    animation: cyberFadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
                }
                .cyber-item-card:hover {
                    transform: translateX(6px) !important;
                    background: rgba(30, 41, 59, 0.65) !important;
                    border-color: #06b6d4 !important;
                    box-shadow: 0 0 25px rgba(6, 182, 212, 0.2) !important;
                }

                /* Glow nhẹ viền ảnh */
                .cyber-img-glow {
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    transition: border-color 0.3s;
                }
                .cyber-item-card:hover .cyber-img-glow {
                    border-color: rgba(6, 182, 212, 0.4);
                }

                /* Hover đổi tên sang màu Neon */
                .cyber-text-hover {
                    transition: color 0.2s ease;
                }
                .cyber-item-card:hover .cyber-text-hover {
                    color: #22d3ee !important;
                }

                /* Nút hành động số lượng kiểu khối lệnh tương lai */
                .cyber-qty-container {
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }
                .cyber-qty-action {
                    transition: all 0.2s !important;
                }
                .cyber-qty-action:hover {
                    background: #06b6d4 !important;
                    color: #030712 !important;
                    box-shadow: 0 0 10px #06b6d4;
                }

                /* Nút xóa sản phẩm đỏ rực */
                .cyber-remove-btn {
                    transition: all 0.2s ease !important;
                }
                .cyber-remove-btn:hover {
                    color: #ef4444 !important;
                    text-shadow: 0 0 8px rgba(239, 68, 68, 0.5);
                }

                /* Nút Mua Sắm Ngay */
                .cyber-btn-primary {
                    border: 1px solid #06b6d4 !important;
                    background: rgba(6, 182, 212, 0.05) !important;
                    color: #22d3ee !important;
                    letter-spacing: 1px;
                    font-family: monospace;
                    transition: all 0.25s ease !important;
                }
                .cyber-btn-primary:hover {
                    background: #06b6d4 !important;
                    color: #030712 !important;
                    box-shadow: 0 0 20px #06b6d4 !important;
                    transform: scale(1.04);
                }

                /* Hộp hóa đơn dính */
                .cyber-summary-box {
                    border: 1px solid rgba(6, 182, 212, 0.2) !important;
                    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4) !important;
                    transition: border-color 0.3s;
                }
                .cyber-summary-box:hover {
                    border-color: #06b6d4 !important;
                }

                /* Nút thanh toán rực cháy */
                .cyber-btn-checkout {
                    background: linear-gradient(135deg, #06b6d4, #3b82f6) !important;
                    text-shadow: 0 1px 2px rgba(0,0,0,0.4);
                    letter-spacing: 1px;
                    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
                }
                .cyber-btn-checkout:hover {
                    transform: translateY(-3px) !important;
                    box-shadow: 0 0 25px rgba(6, 182, 212, 0.5) !important;
                    filter: brightness(1.1);
                }
            `}</style>
        </div>
    );
}

// Hệ thống Style Cyberpunk / Dark Luxury cao cấp
const styles = {
    cartPage: {
        minHeight: "80vh",
        background: "radial-gradient(circle at 50% 50%, #111827 0%, #030712 100%)",
        fontFamily: "'Segoe UI', Roboto, sans-serif",
    },
    cartTitle: {
        fontSize: "1.9rem",
        fontWeight: "900",
        color: "#ffffff",
        marginBottom: "35px",
        letterSpacing: "1px",
        fontFamily: "monospace",
        textShadow: "0 0 10px rgba(255,255,255,0.1)",
    },
    emptyCart: {
        textAlign: "center",
        padding: "80px 20px",
        background: "rgba(17, 24, 39, 0.6)",
        backdropFilter: "blur(12px)",
        borderRadius: "20px",
        border: "1px solid rgba(255, 255, 255, 0.05)",
        boxShadow: "0 15px 35px rgba(0,0,0,0.3)",
    },
    emptyIcon: {
        fontSize: "4.5rem",
        marginBottom: "20px",
    },
    shopNowBtn: {
        display: "inline-block",
        textDecoration: "none",
        padding: "14px 35px",
        borderRadius: "12px",
        fontWeight: "700",
        fontSize: "0.95rem",
    },
    cartLayout: {
        display: "flex",
        flexWrap: "wrap",
        gap: "30px",
    },
    cartList: {
        flex: "1 1 700px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
    },
    cartItemCard: {
        display: "flex",
        alignItems: "center",
        background: "rgba(17, 24, 39, 0.45)",
        backdropFilter: "blur(12px)",
        padding: "20px",
        borderRadius: "20px",
        border: "1px solid rgba(255, 255, 255, 0.05)",
        boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
        gap: "25px",
    },
    imgWrapper: {
        width: "115px",
        height: "115px",
        borderRadius: "14px",
        background: "#1f2937",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
    },
    cartImage: {
        width: "100%",
        height: "100%",
        objectFit: "cover",
    },
    cartInfo: {
        flex: 1,
    },
    itemName: {
        fontSize: "1.2rem",
        fontWeight: "700",
        color: "#ffffff",
        marginBottom: "6px",
    },
    itemPrice: {
        fontSize: "0.95rem",
        color: "#94a3b8",
        fontWeight: "500",
        marginBottom: "14px",
    },
    qtyBox: {
        display: "inline-flex",
        alignItems: "center",
        background: "#111827",
        borderRadius: "12px",
        padding: "3px",
    },
    qtyBtn: {
        width: "30px",
        height: "30px",
        border: "none",
        background: "#1f2937",
        color: "#ffffff",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "bold",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    qtyNumber: {
        padding: "0 16px",
        fontWeight: "700",
        fontSize: "1rem",
        color: "#ffffff",
    },
    cartRight: {
        textAlign: "right",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100px",
    },
    itemSubtotal: {
        fontSize: "1.2rem",
        fontWeight: "800",
        color: "#22d3ee",
        margin: 0,
        textShadow: "0 0 8px rgba(34,211,238,0.2)",
    },
    removeBtn: {
        background: "none",
        border: "none",
        color: "#64748b",
        fontSize: "0.85rem",
        fontWeight: "600",
        cursor: "pointer",
    },
    cartSummary: {
        flex: "1 1 350px",
    },
    summaryCard: {
        background: "rgba(17, 24, 39, 0.65)",
        backdropFilter: "blur(12px)",
        padding: "30px",
        borderRadius: "24px",
        position: "sticky",
        top: "100px",
    },
    summaryTitle: {
        fontSize: "1.2rem",
        fontWeight: "800",
        color: "#ffffff",
        marginBottom: "20px",
        fontFamily: "monospace",
        letterSpacing: "0.5px",
    },
    divider: {
        border: "none",
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        margin: "15px 0",
    },
    summaryRow: {
        display: "flex",
        justifyContent: "space-between",
        fontSize: "0.95rem",
        color: "#94a3b8",
        margin: "14px 0",
    },
    summaryTotal: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontSize: "1.05rem",
        fontWeight: "700",
        color: "#ffffff",
        margin: "22px 0",
    },
    totalPriceText: {
        fontSize: "1.45rem",
        color: "#22d3ee",
        fontWeight: "900",
        textShadow: "0 0 12px rgba(34,211,238,0.25)",
    },
    checkoutBtn: {
        display: "block",
        textAlign: "center",
        textDecoration: "none",
        color: "#ffffff",
        padding: "15px",
        borderRadius: "14px",
        fontWeight: "700",
        fontSize: "1rem",
        marginTop: "20px",
    }
};

export default Cart;