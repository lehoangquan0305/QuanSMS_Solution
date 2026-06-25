import React, { useEffect, useState } from "react";
import categoryProductService from "../../services/categoryProductService";

function CategoryMenu({ setCategoryId }) {
    const [categories, setCategories] = useState([]);
    // Tạo state lưu danh mục đang được click chọn để làm hiệu ứng sáng đèn (Active)
    const [activeId, setActiveId] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await categoryProductService.getAllCategoryProducts();
                setCategories(data || []);
            } catch (error) {
                console.log("Lỗi category:", error);
            }
        };
        fetchData();
    }, []);

    const handleCategoryClick = (id) => {
        setCategoryId(id);
        setActiveId(id);
    };

    // --- ĐỊNH NGHĨA CSS INLINE PHONG CÁCH CYBER TECHWEAR ---
    const menuContainerStyle = {
        display: "flex",
        gap: "14px",
        justifyContent: "center",
        padding: "15px 0 35px 0",
        flexWrap: "wrap"
    };

    const getItemStyle = (isActive) => ({
        padding: "12px 26px",
        background: isActive ? "linear-gradient(45deg, #06b6d4, #3b82f6)" : "rgba(17, 24, 39, 0.6)",
        color: isActive ? "#ffffff" : "#cbd5e1",
        border: isActive ? "1px solid transparent" : "1px solid rgba(6, 182, 212, 0.25)",
        borderRadius: "12px", // Bo góc kiểu khối lệnh tương lai giống các phần trước
        cursor: "pointer",
        backdropFilter: "blur(8px)",
        boxShadow: isActive ? "0 0 15px rgba(6, 182, 212, 0.4)" : "0 4px 10px rgba(0,0,0,0.2)",
        transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
        userSelect: "none"
    });

    const textStyle = {
        margin: 0,
        fontSize: "0.9rem",
        fontWeight: "700",
        letterSpacing: "1px",
        fontFamily: "SFMono-Regular, Menlo, Monaco, Consolas, monospace",
        textTransform: "uppercase"
    };

    return (
        <div style={menuContainerStyle} className="container">

            {/* 🔥 ALL PRODUCTS BUTTON */}
            <div
                style={getItemStyle(activeId === null)}
                onClick={() => handleCategoryClick(null)}
                className="cyber-cat-item"
            >
                <h5 style={textStyle}>🛸 TẤT CẢ SẢN PHẨM</h5>
            </div>

            {/* 🔥 CATEGORY LIST */}
            {categories.map((item) => (
                <div
                    key={item.id}
                    style={getItemStyle(activeId === item.id)}
                    onClick={() => handleCategoryClick(item.id)}
                    className="cyber-cat-item"
                >
                    <h5 style={textStyle}>👟 {item.name}</h5>
                </div>
            ))}

        </div>
    );
}

export default CategoryMenu;