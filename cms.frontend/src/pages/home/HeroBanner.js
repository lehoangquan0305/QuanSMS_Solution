import React from "react";
import "./hero.css";

function HeroBanner() {
    return (
        <section className="hero-banner-cyber">
            {/* Lưới tọa độ không gian tương lai ngầm */}
            <div className="grid-overlay-hero"></div>

            {/* Luồng hạt năng lượng quét động bên trái và phải */}
            <div className="cyber-pulse-orb orb-left"></div>
            <div className="cyber-pulse-orb orb-right"></div>

            <div className="hero-content-cyber text-center">

                {/* Huy hiệu nhỏ phía trên tăng tính Luxury */}
                <div className="cyber-badge-top fw-mono animate-fade-down">
                    SYSTEM INITIATED // ORIGINAL SNEAKERS 2026
                </div>

                {/* Tiêu đề hiệu ứng Neon 3D */}
                <h1 className="hero-title-cyber text-glow-hero mb-2">
                    ADIDAS SPORT SHOP
                </h1>

                {/* Dải ngăn cách công nghệ */}
                <div className="cyber-line-decor mx-auto mb-3"></div>

                {/* Phụ đề */}
                <p className="hero-subtitle-cyber fw-mono mb-4 text-cyan-hero">
                    ⚡ BỘ SƯU TẬP GIÀY THỂ THAO THẾ HỆ MỚI 2026
                </p>

                {/* Nút bấm hiệu ứng viền quét Laser */}
                <button className="btn-shop-cyber fw-mono">
                    <span className="btn-text">MUA NGAY 🚀</span>
                    <span className="laser-line"></span>
                </button>

            </div>
        </section>
    );
}

export default HeroBanner;