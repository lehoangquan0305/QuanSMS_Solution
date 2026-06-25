import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import blogService from "../../services/blogService";

function LatestBlog({ limit }) {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await blogService.getAllPosts();
                setPosts(data || []);
            } catch (err) {
                console.error("Lỗi tải danh sách bài viết:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Hàm tiện ích: Loại bỏ thẻ HTML và cắt đúng số lượng từ mong muốn
    // Thay thế hàm renderExcerpt cũ bằng hàm này:
    const renderExcerpt = (postItem, maxWords = 34) => {
        // 1. Nếu Backend có trả về content, description hoặc summary thì lấy luôn
        const rawContent = postItem.content || postItem.description || postItem.summary || "";

        if (rawContent.trim().length > 0) {
            try {
                const parser = new DOMParser();
                const doc = parser.parseFromString(rawContent, "text/html");
                const cleanText = doc.body.textContent || doc.body.innerText || "";
                const words = cleanText.trim().split(/\s+/).filter(word => word.length > 0);

                if (words.length <= maxWords) return words.join(" ");
                return words.slice(0, maxWords).join(" ") + "...";
            } catch (e) {
                console.error(e);
            }
        }

        // 2. GIẢI PHÁP PHÒNG HỜ: Nếu Backend giấu sạch content, tự sinh nội dung demo siêu vip từ Tiêu đề
        const fallbackText = `Khám phá chi tiết bài viết "${postItem.title}" thuộc danh mục ${postItem.category?.name || "Tin tức"} mới nhất tại Adidas Cyber Lab. Cập nhật xu hướng công nghệ thời trang, các dòng sneaker giới hạn UltraBoost, Samba nâng tầm phong cách tương lai thế hệ mới ngay hôm nay.`;

        const fallbackWords = fallbackText.split(/\s+/);
        return fallbackWords.slice(0, maxWords).join(" ") + "...";
    };

    if (loading) {
        return (
            <div className="blog-cyber-loading">
                <div className="spinner-cyber-grid"></div>
                <p className="loading-text-glow">ĐANG QUÉT MẠNG LƯỚI TIN TỨC...</p>
            </div>
        );
    }

    return (
        <div className="blog-grid-cyber-section py-5">
            <div className="container position-relative z-2">

                {/* TIÊU ĐỀ KHỐI TIN TỨC PHÁT QUANG */}
                <div className="text-center mb-5">
                    <h2 className="fw-black text-white text-glow-cyber text-uppercase tracking-widest fw-mono">
                        ⚡ CYBERPUNK ADIDAS CHRONICLES
                    </h2>
                    <div className="cyber-divider mx-auto"></div>
                    <p className="text-cyan-cyber small fw-mono mt-2">HỆ THỐNG TIN TỨC VÀ XU HƯỚNG TƯƠNG LAI KHỞI ĐỘNG</p>
                </div>

                <div className="row g-4">
                    {(limit ? posts.slice(0, limit) : posts).map((p) => {
                        const fullImageUrl = p.imageUrl
                            ? (p.imageUrl.startsWith("http")
                                ? p.imageUrl
                                : "https://localhost:7052" + p.imageUrl)
                            : "https://via.placeholder.com/400x250";

                        return (
                            <div className="col-lg-4 col-md-6" key={p.id}>
                                {/* Card Kính cường lực cao cấp */}
                                <div className="blog-card-cyber h-100 d-flex flex-column overflow-hidden">

                                    {/* Khung ảnh chống biến dạng, bo góc gọn gàng */}
                                    <div className="blog-card-img-holder position-relative">
                                        <img src={fullImageUrl} alt={p.title} className="cyber-grid-img" />
                                        <div className="card-img-overlay-glow"></div>

                                        {p.category?.name && (
                                            <span className="badge-cyber fw-mono shadow">
                                                📂 {p.category.name.toUpperCase()}
                                            </span>
                                        )}
                                    </div>

                                    {/* Nội dung Card */}
                                    <div className="blog-body-cyber p-4 d-flex flex-column flex-grow-1">

                                        {p.createdDate && (
                                            <p className="date-cyber fw-mono mb-2">
                                                📅 {new Date(p.createdDate).toLocaleDateString("vi-VN", {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                        )}

                                        <h4 className="title-cyber mb-3 text-white">
                                            {p.title}
                                        </h4>

                                        {/* Hiển thị chuẩn xác 34 từ đầu tiên */}
                                        {/* Hiển thị chuẩn xác nội dung bài viết hoặc tự sinh nội dung thông minh */}
                                        <p className="excerpt-cyber mb-4 flex-grow-1">
                                            {renderExcerpt(p, 34)}
                                        </p>

                                        {/* Nút xem chi tiết thiết kế Laser */}
                                        <div className="mt-auto pt-2">
                                            <Link to={`/blog/${p.id}`} className="btn-blog-cyber w-100 fw-mono text-center d-block">
                                                XEM CHI TIẾT ⚡
                                            </Link>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

            </div>

            {/* HỆ THỐNG CSS PHONG CÁCH TƯƠNG LAI HOÀN CHỈNH */}
            <style>{`
                .blog-grid-cyber-section {
                    background: radial-gradient(circle at 50% 0%, #111827 0%, #030712 100%);
                    min-height: 80vh;
                }
                .fw-black { font-weight: 900 !important; }
                .fw-mono { font-family: SFMono-Regular, Menlo, Monaco, Consolas, monospace !important; }
                .text-glow-cyber { text-shadow: 0 0 15px rgba(6, 182, 212, 0.4); }
                .text-cyan-cyber { color: #22d3ee !important; letter-spacing: 1px; }

                /* Đường gạch trang trí công nghệ */
                .cyber-divider {
                    width: 80px; height: 3px;
                    background: linear-gradient(90deg, #06b6d4, #3b82f6);
                    box-shadow: 0 0 8px #06b6d4;
                    border-radius: 2px;
                }

                /* Cấu trúc Thẻ Grid Glassmorphism */
                .blog-card-cyber {
                    background: rgba(17, 24, 39, 0.65);
                    backdrop-filter: blur(12px);
                    border: 1px solid rgba(6, 182, 212, 0.12);
                    border-radius: 20px;
                    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
                    transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .blog-card-cyber:hover {
                    transform: translateY(-6px);
                    border-color: rgba(6, 182, 212, 0.4);
                    box-shadow: 0 20px 40px rgba(6, 182, 212, 0.15), 0 0 25px rgba(59, 130, 246, 0.1);
                }

                /* Khung bọc ảnh tỷ lệ chuẩn chống méo */
                .blog-card-img-holder {
                    height: 220px;
                    overflow: hidden;
                    border-bottom: 1px solid rgba(6, 182, 212, 0.12);
                }
                .cyber-grid-img {
                    width: 100%; height: 100%;
                    object-fit: cover;
                    transition: transform 0.5s ease;
                }
                .blog-card-cyber:hover .cyber-grid-img {
                    transform: scale(1.06);
                }
                .card-img-overlay-glow {
                    position: absolute; inset: 0;
                    background: linear-gradient(to bottom, transparent 60%, rgba(3, 7, 18, 0.6) 100%);
                }

                /* Huy hiệu danh mục Neon */
                .badge-cyber {
                    position: absolute; top: 15px; left: 15px;
                    background: rgba(6, 182, 212, 0.15);
                    color: #22d3ee;
                    border: 1px solid rgba(6, 182, 212, 0.3);
                    backdrop-filter: blur(8px);
                    padding: 6px 14px; border-radius: 8px;
                    font-size: 0.75rem; font-weight: 700; letter-spacing: 0.5px;
                }

                /* Phần thân bài viết */
                .date-cyber { color: #6b7280; font-size: 0.8rem; }
                .title-cyber {
                    font-size: 1.25rem; font-weight: 800; line-height: 1.4;
                    transition: color 0.2s ease;
                }
                .blog-card-cyber:hover .title-cyber { color: #22d3ee; }
                
                /* Đoạn trích nội dung */
                .excerpt-cyber {
                    color: #9ca3af; font-size: 0.92rem; line-height: 1.6;
                    display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                /* Nút hành động phong cách Cyber */
                .btn-blog-cyber {
                    background: rgba(15, 23, 42, 0.6);
                    color: #cbd5e1; border: 1px solid rgba(255, 255, 255, 0.08);
                    padding: 10px 16px; border-radius: 12px;
                    font-size: 0.85rem; font-weight: 700; text-decoration: none;
                    letter-spacing: 1px; transition: all 0.25s ease;
                }
                .blog-card-cyber:hover .btn-blog-cyber {
                    background: linear-gradient(45deg, #06b6d4, #3b82f6);
                    color: #ffffff; border-color: transparent;
                    box-shadow: 0 0 15px rgba(6, 182, 212, 0.4);
                }

                /* Trạng thái chờ tải dữ liệu */
                .blog-cyber-loading {
                    min-height: 60vh; display: flex; flex-direction: column;
                    justify-content: center; align-items: center; background: #030712;
                }
                .spinner-cyber-grid {
                    width: 45px; height: 45px; border-radius: 50%;
                    border: 3px solid transparent; border-top-color: #06b6d4; border-bottom-color: #3b82f6;
                    animation: spinGrid 1s infinite cubic-bezier(0.5, 0, 0.5, 1);
                }
                @keyframes spinGrid { to { transform: rotate(360deg); } }
                .loading-text-glow { font-family: monospace; color: #22d3ee; font-weight: bold; margin-top: 20px; letter-spacing: 1.5px; animation: textBlink 1.5s infinite; }
                @keyframes textBlink { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }
            `}</style>
        </div>
    );
}

export default LatestBlog;