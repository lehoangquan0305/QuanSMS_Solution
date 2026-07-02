import React, { useState } from "react";
import ShopSidebar from "./ShopSidebar";
import ProductList from "./ProductList";

function Shop() {
    // STATE CHUNG ĐỂ LỌC SẢN PHẨM TRONG CỬA HÀNG
    const [categoryId, setCategoryId] = useState(null);

    // 🔥 TIÊU CHÍ 39: Quản lý trạng thái khoảng giá Min - Max toàn trang Shop
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");

    // Style bao bọc toàn trang Shop để ép nền tối luxury đồng bộ
    const shopPageStyle = {
        background: "radial-gradient(circle at 50% 0%, #0f172a 0%, #030712 100%)",
        minHeight: "100vh",
        color: "#ffffff",
        paddingBottom: "80px"
    };

    const headerStatusStyle = {
        background: "rgba(17, 24, 39, 0.6)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(6, 182, 212, 0.15)",
        borderRadius: "16px",
        padding: "20px 25px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontFamily: "SFMono-Regular, Menlo, Monaco, Consolas, monospace",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)"
    };

    return (
        <div style={shopPageStyle}>
            {/* BANNER PHÂN VÙNG DỮ LIỆU CỬA HÀNG */}
            <div className="container pt-5 mb-4">
                <div style={headerStatusStyle} className="animate-fade-in-cyber">
                    <div>
                        <span style={{ color: "#06b6d4", fontSize: "0.8rem", letterSpacing: "2px", display: "block" }}>
                            SYSTEM STATUS // OPERATIONAL
                        </span>
                        <h2 style={{ fontSize: "24px", fontWeight: "900", margin: 0, letterSpacing: "1px", textShadow: "0 0 12px rgba(6, 182, 212, 0.3)" }}>
                            🛸 TRUNG TÂM SẢN PHẨM
                        </h2>
                    </div>
                    <div style={{ textAlign: "right" }} className="d-none d-sm-block">
                        <span style={{ color: "#9ca3af", fontSize: "0.85rem" }}>GRID VIEW // ACTIVATED</span>
                        <div style={{ width: "8px", height: "8px", background: "#22d3ee", borderRadius: "50%", display: "inline-block", marginLeft: "10px", boxShadow: "0 0 8px #22d3ee" }}></div>
                    </div>
                </div>
            </div>

            {/* KHU VỰC CHI TIẾT CỬA HÀNG */}
            <div className="container">
                <div className="row g-4">

                    {/* BỘ LỌC SIDEBAR - CHIẾM 3 CỘT */}
                    <div className="col-lg-3">
                        <div className="shop-sidebar-wrapper-cyber">
                            {/* 🔥 Truyền các hàm set khoảng giá xuống Sidebar để tương tác */}
                            <ShopSidebar
                                setCategoryId={setCategoryId}
                                minPrice={minPrice}
                                maxPrice={maxPrice}
                                setMinPrice={setMinPrice}
                                setMaxPrice={setMaxPrice}
                            />
                        </div>
                    </div>

                    {/* LƯỚI HIỂN THỊ SẢN PHẨM - CHIẾM 9 CỘT */}
                    <div className="col-lg-9">
                        <div className="product-list-wrapper-cyber">
                            {/* 🔥 Truyền giá trị Min - Max xuống List để kích hoạt gọi API lọc ngầm */}
                            <ProductList
                                categoryId={categoryId}
                                minPrice={minPrice}
                                maxPrice={maxPrice}
                            />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Shop;