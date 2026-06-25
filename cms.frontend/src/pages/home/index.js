import React, { useState } from "react";
import LatestBlog from "./LatestBlog";
import CategoryMenu from "./CategoryMenu";
import ProductGrid from "./ProductGrid";
import HeroBanner from "./HeroBanner";
import "./home.css";

function Home() {
    // STATE CHUNG CHO CATEGORY
    const [categoryId, setCategoryId] = useState(null);

    return (
        <div className="main-cyber-wrapper">
            {/* HERO BANNER */}
            <HeroBanner />

            {/* CATEGORY */}
            <section className="section-block-cyber">
                <div className="container">
                    <h2 className="section-title-cyber text-glow-cyber-home fw-mono-home">
                        ⚡ DANH MỤC SẢN PHẨM
                    </h2>
                    <div className="cyber-divider-home mx-auto mb-4"></div>
                    {/* Truyền state xuống để lọc */}
                    <CategoryMenu setCategoryId={setCategoryId} />
                </div>
            </section>

            {/* PRODUCT */}
            <section className="section-block-cyber bg-cyber-dark-accent">
                <div className="container">
                    {/* Tiêu đề lọc sản phẩm thông minh */}
                    <div className="product-filter-header-cyber mb-4">
                        <h3 className="filter-title-cyber fw-mono-home text-white">
                            {categoryId ? "👟 SẢN PHẨM THEO DANH MỤC" : "🔥 SẢN PHẨM NỔI BẬT"}
                        </h3>
                        <span className="live-status-pulse"></span>
                    </div>
                    {/* Truyền categoryId xuống grid để thay đổi danh sách */}
                    <ProductGrid categoryId={categoryId} />
                </div>
            </section>

            {/* BLOG */}
            <section className="section-block-cyber">
                <div className="container">
                    <h2 className="section-title-cyber text-glow-cyber-home fw-mono-home">
                        📰 TIN TỨC MỚI NHẤT
                    </h2>
                    <div className="cyber-divider-home mx-auto mb-4"></div>
                    {/* 🔥 Thêm limit={3} vào đây bồ nhé */}
                    <LatestBlog limit={3} />
                </div>
            </section>

            {/* FEATURES */}
            <section className="features-cyber">
                <div className="container">
                    <div className="feature-grid-cyber">

                        <div className="feature-card-cyber">
                            <div className="feature-icon-cyber">🚀</div>
                            <h3 className="fw-mono-home">HIỆU NĂNG CAO</h3>
                            <p>Đế giày tích hợp đệm khí tối ưu cho chạy bộ và các hoạt động thể thao cường độ cao.</p>
                        </div>

                        <div className="feature-card-cyber">
                            <div className="feature-icon-cyber">🔥</div>
                            <h3 className="fw-mono-home">TRENDING</h3>
                            <p>Luôn dẫn đầu và cập nhật liên tục những phối màu Hot nhất từ các dòng UltraBoost, Samba.</p>
                        </div>

                        <div className="feature-card-cyber">
                            <div className="feature-icon-cyber">💎</div>
                            <h3 className="fw-mono-home">CHÍNH HÃNG</h3>
                            <p>Cam kết 100% sản phẩm Authentic, đầy đủ tem mác box và chính sách bảo hành cốt lõi.</p>
                        </div>

                    </div>
                </div>
            </section>
        </div>
    );
}

export default Home;