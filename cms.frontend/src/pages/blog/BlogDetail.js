import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import blogService from "../../services/blogService";
import "./blog.css";

function BlogDetail() {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [readingProgress, setReadingProgress] = useState(0);

    // Xử lý thanh tiến trình cuộn trang đọc bài
    useEffect(() => {
        const handleScroll = () => {
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (totalHeight > 0) {
                const progress = (window.scrollY / totalHeight) * 100;
                setReadingProgress(progress);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const data = await blogService.getById(id);
                setPost(data);
            } catch (err) {
                console.error("Lỗi lấy chi tiết bài viết:", err);
            }
        };
        fetchPost();
        window.scrollTo(0, 0);
    }, [id]);

    if (!post) {
        return (
            <div className="blog-detail-loading-cyber">
                <div className="spinner-cyber"></div>
                <p className="loading-text-glow">ĐANG TRÍCH XUẤT DỮ LIỆU BÀI VIẾT...</p>
            </div>
        );
    }

    const fullImageUrl = post.imageUrl?.startsWith("http")
        ? post.imageUrl
        : "https://localhost:7052" + post.imageUrl;

    return (
        <div className="blog-detail-page-cyber animate-fade-in-cyber">
            {/* Thanh tiến trình đọc bài viết phát quang Neon */}
            <div className="reading-progress-bar-cyber" style={{ width: `${readingProgress}%` }}></div>

            {/* BANNER ĐẦU TRANG - SỬA LỖI VỠ HÌNH BẰNG DEEP BLUR */}
            <div className="blog-banner-cyber">
                {/* Ảnh nền làm mờ cực mạnh phía sau, không lo vỡ ảnh */}
                <div className="banner-blur-bg" style={{ backgroundImage: `url(${fullImageUrl})` }}></div>
                <div className="grid-overlay-cyber"></div>

                <div className="container position-relative z-3 h-100 d-flex align-items-center">
                    <div className="row w-100 align-items-center g-4 mt-5">

                        {/* Bên trái: Tiêu đề và Meta */}
                        <div className="col-lg-7 order-2 order-lg-1 text-center text-lg-start">
                            <Link to="/blog" className="btn-back-cyber mb-3 d-inline-flex align-items-center fw-mono">
                                🛸 ⟨ QUAY LẠI DANH SÁCH
                            </Link>
                            <h1 className="post-main-title-cyber text-glow-cyber mb-3">
                                {post.title}
                            </h1>
                            <div className="post-meta-info-cyber fw-mono justify-content-center justify-content-lg-start">
                                <span className="meta-item-cyber text-cyan-cyber">
                                    📅 {post.createdDate ? new Date(post.createdDate).toLocaleDateString("vi-VN", {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    }) : "Không rõ ngày"}
                                </span>
                                <span className="meta-item-divider-cyber">|</span>
                                <span className="meta-item-cyber text-muted-cyber">⏱️ 5 PHÚT ĐỌC</span>
                            </div>
                        </div>

                        {/* Bên phải: Khung hiển thị ảnh gốc sắc nét, bo góc và đổ bóng neon */}
                        <div className="col-lg-5 order-1 order-lg-2 d-flex justify-content-center">
                            <div className="image-showcase-wrapper">
                                <img src={fullImageUrl} alt={post.title} className="img-fluid showcase-img" />
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* KHU VỰC NỘI DUNG CHÍNH */}
            <div className="container content-wrapper-cyber">
                <div className="row justify-content-center">
                    <div className="col-lg-10 col-xl-9">
                        <article className="blog-content-cyber shadow-premium-cyber">

                            {/* Nội dung tin tức chi tiết */}
                            <div
                                className="rich-text-content-cyber"
                                dangerouslySetInnerHTML={{
                                    __html: post.content
                                }}
                            />

                            {/* CHÂN BÀI VIẾT - THÔNG TIN TÁC GIẢ */}
                            <div className="blog-footer-author-cyber mt-5 pt-4">
                                <div className="d-flex flex-column flex-sm-row align-items-center gap-3 text-center text-sm-start">
                                    <div className="author-avatar-ring">
                                        <img src="https://i.pravatar.cc/150?img=68" alt="Author" className="author-avatar-cyber" />
                                    </div>
                                    <div>
                                        <h5 className="mb-1 fw-bold text-white text-glow-cyber fw-mono">EDITION BY ADIDAS CYBER LAB</h5>
                                        <p className="text-muted-cyber small mb-0">Hệ thống tổng hợp xu hướng công nghệ thời trang thể thao thế hệ mới. Cập nhật liên tục các dòng sản phẩm giới hạn.</p>
                                    </div>
                                </div>
                            </div>

                        </article>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BlogDetail;