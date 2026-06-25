import React from "react";
import { Link } from "react-router-dom";

function Footer() {
    return (
        <footer style={styles.footer}>
            {/* Hiệu ứng tia sáng ngầm ở góc dưới nền */}
            <div style={styles.glowBg}></div>

            <div style={styles.container}>
                {/* CỘT 1: GIỚI THIỆU THƯƠNG HIỆU */}
                <div style={styles.columnBig}>
                    <div style={styles.logo}>
                        <span style={{ fontSize: "1.8rem" }}>👟</span>
                        <div style={styles.logoTextWrapper}>
                            <span style={styles.logoText}>ADIDAS STORE</span>
                            <span style={styles.logoAuthor}>BY LE HOANG QUAN</span>
                        </div>
                    </div>
                    <p style={styles.description}>
                        Nhà phân phối giày thể thao Adidas chính hãng hàng đầu. Sứ mệnh của chúng tôi là đem lại sự êm ái, bứt phá trên từng bước chạy và nâng tầm phong cách sống của bạn.
                    </p>
                    {/* KHU VỰC MẠNG XÃ HỘI */}
                    <div style={styles.socialGroup}>
                        <a href="#facebook" className="social-icon" style={styles.socialIcon}>🌐</a>
                        <a href="#instagram" className="social-icon" style={styles.socialIcon}>📸</a>
                        <a href="#tiktok" className="social-icon" style={styles.socialIcon}>🎵</a>
                        <a href="#youtube" className="social-icon" style={styles.socialIcon}>📺</a>
                    </div>
                </div>

                {/* CỘT 2: KHÁM PHÁ */}
                <div style={styles.column}>
                    <h4 style={styles.colTitle}>Khám Phá</h4>
                    <ul style={styles.linkList}>
                        <li><Link to="/shop" className="footer-link" style={styles.link}>Giày Chạy Bộ (Running)</Link></li>
                        <li><Link to="/shop" className="footer-link" style={styles.link}>Giày Thời Trang (Originals)</Link></li>
                        <li><Link to="/shop" className="footer-link" style={styles.link}>Bộ Sưu Tập Giày Đá Bóng</Link></li>
                        <li><Link to="/shop" className="footer-link" style={styles.link}>Sản Phẩm Khuyến Mãi</Link></li>
                    </ul>
                </div>

                {/* CỘT 3: HỖ TRỢ KHÁCH HÀNG */}
                <div style={styles.column}>
                    <h4 style={styles.colTitle}>Hỗ Trợ</h4>
                    <ul style={styles.linkList}>
                        <li><a href="#policy" className="footer-link" style={styles.link}>Chính sách đổi trả 30 ngày</a></li>
                        <li><a href="#size" className="footer-link" style={styles.link}>Bảng đo size giày chuẩn</a></li>
                        <li><a href="#shipping" className="footer-link" style={styles.link}>Chính sách giao hàng siêu tốc</a></li>
                        <li><a href="#security" className="footer-link" style={styles.link}>Bảo mật thông tin cá nhân</a></li>
                    </ul>
                </div>

                {/* CỘT 4: LIÊN HỆ ĐỘC QUYỀN */}
                <div style={styles.column}>
                    <h4 style={styles.colTitle}>Thông Tin Liên Hệ</h4>
                    <ul style={styles.linkList}>
                        <li style={styles.contactItem}>📍 <span style={{ color: '#bbb' }}>Hệ thống Store toàn quốc</span></li>
                        <li style={styles.contactItem}>📞 <span style={{ color: '#fff', fontWeight: '600' }}>Hotline: 1900 xxxx</span></li>
                        <li style={styles.contactItem}>✉️ <span style={{ color: '#bbb' }}>support@lehoangquan.com</span></li>
                        <li style={styles.contactItem}>💼 <span style={{ color: '#6a11cb', fontWeight: 'bold' }}>CEO & Founder: Lê Hoàng Quân</span></li>
                    </ul>
                </div>
            </div>

            {/* THANH BẢN QUYỀN PHÍA DƯỚI */}
            <div style={styles.bottomBar}>
                <div style={styles.bottomContainer}>
                    <span>© 2026 <strong>Adidas Store</strong>. All Rights Reserved.</span>
                    <span>Designed & Developed by <strong style={styles.signature}>Le Hoang Quan ✨</strong></span>
                </div>
            </div>

            {/* Nhúng mã hiệu ứng CSS Hoạt họa */}
            <style>{`
                .footer-link {
                    transition: all 0.25s ease;
                }
                .footer-link:hover {
                    color: #2575fc !important;
                    padding-left: 6px;
                }
                .social-icon {
                    transition: all 0.3s ease;
                }
                .social-icon:hover {
                    background: rgba(255, 255, 255, 0.2) !important;
                    transform: translateY(-4px) scale(1.1);
                    box-shadow: 0 4px 12px rgba(37, 117, 252, 0.3);
                }
            `}</style>
        </footer>
    );
}

// Hệ thống phong cách Thiết kế Dark UI Cao Cấp
const styles = {
    footer: {
        position: "relative",
        background: "#0f172a", // Nền tối lịch lãm tôn dáng cho giày Adidas
        color: "#f1f5f9",
        padding: "60px 0 0 0",
        fontFamily: "'Segoe UI', Roboto, sans-serif",
        overflow: "hidden",
        borderTop: "1px solid rgba(255, 255, 255, 0.05)",
    },
    glowBg: {
        position: "absolute",
        bottom: "-100px",
        right: "-50px",
        width: "300px",
        height: "300px",
        background: "radial-gradient(circle, rgba(106,17,203,0.15) 0%, rgba(0,0,0,0) 70%)",
        pointerEvents: "none",
    },
    container: {
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "0 20px 40px 20px",
        display: "flex",
        flexWrap: "wrap",
        gap: "40px",
        justifyContent: "space-between",
    },
    columnBig: {
        flex: "1 1 320px",
        display: "flex",
        flexDirection: "column",
        gap: "18px",
    },
    column: {
        flex: "1 1 180px",
    },
    logo: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
    },
    logoTextWrapper: {
        display: "flex",
        flexDirection: "column",
    },
    logoText: {
        fontSize: "1.3rem",
        fontWeight: "900",
        letterSpacing: "1.5px",
        background: "linear-gradient(to right, #ffffff, #94a3b8)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
    },
    logoAuthor: {
        fontSize: "0.65rem",
        color: "#38bdf8",
        fontWeight: "700",
        letterSpacing: "2px",
        textTransform: "uppercase",
    },
    description: {
        fontSize: "0.9rem",
        lineHeight: "1.6",
        color: "#94a3b8",
        margin: 0,
    },
    socialGroup: {
        display: "flex",
        gap: "12px",
        marginTop: "5px",
    },
    socialIcon: {
        width: "36px",
        height: "36px",
        borderRadius: "50%",
        background: "rgba(255, 255, 255, 0.05)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textDecoration: "none",
        fontSize: "1rem",
    },
    colTitle: {
        fontSize: "1.05rem",
        fontWeight: "700",
        marginBottom: "20px",
        color: "#fff",
        position: "relative",
        paddingBottom: "8px",
    },
    linkList: {
        listStyle: "none",
        padding: 0,
        margin: 0,
        display: "flex",
        flexDirection: "column",
        gap: "12px",
    },
    link: {
        color: "#94a3b8",
        textDecoration: "none",
        fontSize: "0.9rem",
        display: "inline-block",
    },
    contactItem: {
        fontSize: "0.9rem",
        color: "#94a3b8",
        lineHeight: "1.4",
    },
    bottomBar: {
        background: "#020617",
        padding: "20px 0",
        borderTop: "1px solid rgba(255, 255, 255, 0.03)",
    },
    bottomContainer: {
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "0 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "10px",
        fontSize: "0.8rem",
        color: "#64748b",
    },
    signature: {
        color: "#38bdf8",
        fontWeight: "600",
    }
};

export default Footer;