import React, { useEffect, useState } from "react";
import categoryProductService from "../../services/categoryProductService";

function ShopSidebar({ setCategoryId }) {
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

    return (
        <div style={sidebarCardStyle}>
            <h4 style={titleStyle}>📂 DANH MỤC KHÔI</h4>

            <div style={{ display: "flex", flexDirection: "column" }}>
                {/* BUTTON TẤT CẢ */}
                <button
                    style={getBtnStyle(activeId === null)}
                    onClick={() => handleCategorySelect(null)}
                    className="sidebar-cyber-btn"
                >
                    TẤT CẢ SẢN PHẨM
                </button>

                {/* DANH SÁCH DANH MỤC */}
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

            {/* Tạo hiệu ứng dịch chuyển nhẹ khi di chuột qua nút chưa active */}
            <style>{`
                .sidebar-cyber-btn:hover:not([style*="linear-gradient"]) {
                    background: rgba(6, 182, 212, 0.1) !important;
                    color: #22d3ee !important;
                    border-color: rgba(6, 182, 212, 0.4) !important;
                    transform: translateX(5px);
                }
            `}</style>
        </div>
    );
}

export default ShopSidebar;