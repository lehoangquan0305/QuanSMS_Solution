import React, { useEffect, useState } from "react";
import categoryProductService from "../../services/categoryProductService";

// 🔥 TIÊU CHÍ 39: Nhận các props điều khiển khoảng giá từ Shop.jsx truyền xuống
function ShopSidebar({ setCategoryId, minPrice, maxPrice, setMinPrice, setMaxPrice }) {
    const [categories, setCategories] = useState([]);
    const [activeId, setActiveId] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await categoryProductService.getAllCategoryProducts();
                setCategories(data || []);
            } catch (error) {
                console.log("Lỗi lấy danh mục shop:", error);
            }
        };
        fetchData();
    }, []);

    const handleCategorySelect = (id) => {
        setCategoryId(id);
        setActiveId(id);
    };

    // Hàm xóa nhanh bộ lọc giá về rỗng
    const handleResetPrice = () => {
        setMinPrice("");
        setMaxPrice("");
    };

    // --- CYBER INLINE STYLES ---
    const sidebarCardStyle = {
        background: "rgba(17, 24, 39, 0.7)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(6, 182, 212, 0.15)",
        borderRadius: "20px",
        padding: "24px",
        boxShadow: "0 15px 35px rgba(0, 0, 0, 0.3)",
        position: "sticky",
        top: "110px"
    };

    const titleStyle = {
        fontSize: "1.1rem",
        fontWeight: "900",
        color: "#ffffff",
        letterSpacing: "2px",
        fontFamily: "monospace",
        borderBottom: "1px solid rgba(6, 182, 212, 0.2)",
        paddingBottom: "15px",
        marginBottom: "20px",
        textTransform: "uppercase"
    };

    const sectionDividerStyle = {
        fontSize: "1rem",
        fontWeight: "900",
        color: "#ffffff",
        letterSpacing: "2px",
        fontFamily: "monospace",
        borderBottom: "1px solid rgba(6, 182, 212, 0.2)",
        paddingBottom: "10px",
        marginTop: "30px",
        marginBottom: "25px",
        textTransform: "uppercase"
    };

    const getBtnStyle = (isActive) => ({
        width: "100%",
        border: isActive ? "1px solid transparent" : "1px solid rgba(255, 255, 255, 0.05)",
        background: isActive ? "linear-gradient(45deg, #06b6d4, #3b82f6)" : "rgba(255, 255, 255, 0.02)",
        color: isActive ? "#030712" : "#9ca3af",
        padding: "14px 18px",
        marginBottom: "10px",
        borderRadius: "12px",
        textAlign: "left",
        fontWeight: "700",
        fontSize: "0.88rem",
        fontFamily: "monospace",
        cursor: "pointer",
        transition: "all 0.25s ease",
        boxShadow: isActive ? "0 0 15px rgba(6, 182, 212, 0.4)" : "none"
    });

    const inputGroupStyle = {
        marginBottom: "15px"
    };

    const labelStyle = {
        display: "block",
        fontSize: "0.75rem",
        color: "#06b6d4",
        marginBottom: "6px",
        fontWeight: "bold",
        letterSpacing: "1px"
    };

    const inputCyberStyle = {
        width: "100%",
        background: "rgba(3, 7, 18, 0.6)",
        border: "1px solid rgba(6, 182, 212, 0.25)",
        borderRadius: "10px",
        padding: "10px 14px",
        color: "#ffffff",
        fontSize: "0.9rem",
        fontFamily: "monospace",
        outline: "none",
        transition: "all 0.25s ease"
    };

    return (
        <div style={sidebarCardStyle}>
            {/* PHẦN 1: DANH MỤC */}
            <h4 style={titleStyle}>📂 DANH MỤC KHỐI</h4>

            <div style={{ display: "flex", flexDirection: "column" }}>
                <button
                    style={getBtnStyle(activeId === null)}
                    onClick={() => handleCategorySelect(null)}
                    className="sidebar-cyber-btn"
                >
                    TẤT CẢ SẢN PHẨM
                </button>

                {categories.map((item) => (
                    <button
                        key={item.id}
                        style={getBtnStyle(activeId === item.id)}
                        onClick={() => handleCategorySelect(item.id)}
                        className="sidebar-cyber-btn"
                    >
                        {item.name.toUpperCase()}
                    </button>
                ))}
            </div>

            {/* 🔥 PHẦN 2: TIÊU CHÍ 39 - BỘ LỌC ĐƠN GIÁ MIN - MAX */}
            <h4 style={sectionDividerStyle}>🎛️ LỌC ĐƠN GIÁ</h4>

            <div>
                <div style={inputGroupStyle}>
                    <label style={labelStyle}>// MIN_PRICE (Đ)</label>
                    <input
                        type="number"
                        placeholder="Từ: 0"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        style={inputCyberStyle}
                        className="input-cyber-price"
                        min="0"
                    />
                </div>

                <div style={inputGroupStyle}>
                    <label style={labelStyle}>// MAX_PRICE (Đ)</label>
                    <input
                        type="number"
                        placeholder="Đến: nđ"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        style={inputCyberStyle}
                        className="input-cyber-price"
                        min="0"
                    />
                </div>

                {/* Nút reset nhanh khoảng giá */}
                {(minPrice || maxPrice) && (
                    <button
                        onClick={handleResetPrice}
                        style={{
                            width: "100%",
                            background: "rgba(239, 68, 68, 0.1)",
                            border: "1px solid rgba(239, 68, 68, 0.3)",
                            color: "#ef4444",
                            borderRadius: "10px",
                            padding: "10px",
                            fontSize: "0.8rem",
                            fontWeight: "bold",
                            fontFamily: "monospace",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                            marginTop: "10px"
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.background = "#ef4444";
                            e.target.style.color = "#ffffff";
                            e.target.style.boxShadow = "0 0 10px rgba(239, 68, 68, 0.5)";
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = "rgba(239, 68, 68, 0.1)";
                            e.target.style.color = "#ef4444";
                            e.target.style.boxShadow = "none";
                        }}
                    >
                        ❌ CLEAR PRICE FILTER
                    </button>
                )}
            </div>

            {/* CSS HOVER EFFECTS */}
            <style>{`
                .sidebar-cyber-btn:hover:not([style*="linear-gradient"]) {
                    background: rgba(6, 182, 212, 0.1) !important;
                    color: #22d3ee !important;
                    border-color: rgba(6, 182, 212, 0.4) !important;
                    transform: translateX(5px);
                }
                .input-cyber-price:focus {
                    border-color: #06b6d4 !important;
                    box-shadow: 0 0 10px rgba(6, 182, 212, 0.3);
                }
                /* Ẩn nút tăng giảm mặc định của input number để giữ form đẹp */
                .input-cyber-price::-webkit-outer-spin-button,
                .input-cyber-price::-webkit-inner-spin-button {
                    -webkit-appearance: none;
                    margin: 0;
                }
            `}</style>
        </div>
    );
}

export default ShopSidebar;