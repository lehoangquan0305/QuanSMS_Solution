import React, { useEffect, useState } from "react";
import blogService from "../../services/blogService";
import categoryService from "../../services/categoryService";
import { Link } from "react-router-dom";
import "./index.css";

function Blog() {
    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState(null);
    const [loading, setLoading] = useState(true);

    // ✅ PHÂN TRANG STATE
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 6;

    useEffect(() => {
        const initData = async () => {
            await Promise.all([fetchPosts(), fetchCategories()]);
            setLoading(false);
        };
        initData();
    }, []);

    const fetchPosts = async () => {
        try {
            const data = await blogService.getAllPosts();
            setPosts(data || []);
        } catch (err) { console.log(err); }
    };

    const fetchCategories = async () => {
        try {
            const data = await categoryService.getAll();
            setCategories(data || []);
        } catch (err) { console.log(err); }
    };

    const handleCategoryClick = async (categoryId) => {
        setLoading(true);
        setActiveCategory(categoryId);
        setCurrentPage(1); // ⚡ Reset về trang 1 khi đổi danh mục
        try {
            const data = categoryId === null
                ? await blogService.getAllPosts()
                : await blogService.getPostsByCategoryId(categoryId);
            setPosts(data || []);
        } catch (err) { console.log(err); }
        setLoading(false);
    };

    // ✅ LOGIC TÍNH TOÁN PHÂN TRANG
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
    const totalPages = Math.ceil(posts.length / postsPerPage);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 400, behavior: 'smooth' }); // Cuộn lên đầu lưới bài viết
    };

    if (loading) return (
        <div className="blog-cyber-loading">
            <div className="spinner-cyber-main"></div>
            <p className="loading-text-glow">ĐANG ĐỒNG BỘ MẠNG LƯỚI TIN TỨC...</p>
        </div>
    );

    return (
        <div className="blog-page-cyber">
            <section className="blog-hero-cyber">
                <div className="grid-overlay-blog"></div>
                <div className="container position-relative z-2">
                    <span className="hero-tag-cyber fw-mono animate-fade-down">ADIDAS ARCHIVE // V2.06</span>
                    <h1 className="text-glow-cyber">TIN TỨC & XU HƯỚNG TƯƠNG LAI</h1>
                    <p className="fw-mono">Khám phá các mã gen Sneaker mới nhất và phong cách Digital Lifestyle.</p>
                </div>
            </section>

            <section className="blog-section-cyber">
                <div className="container">
                    <div className="row">
                        {/* SIDEBAR CYBER */}
                        <div className="col-lg-3 mb-5">
                            <div className="blog-sidebar-cyber glass-card">
                                <h4 className="fw-black text-white mb-4 tracking-widest fw-mono">📂 DANH MỤC</h4>
                                <div className="category-stack">
                                    <button className={`cat-btn-cyber ${activeCategory === null ? "active" : ""}`} onClick={() => handleCategoryClick(null)}>
                                        TẤT CẢ BÀI VIẾT
                                    </button>
                                    {categories.map((cat) => (
                                        <button key={cat.id} className={`cat-btn-cyber ${activeCategory === cat.id ? "active" : ""}`} onClick={() => handleCategoryClick(cat.id)}>
                                            {cat.name.toUpperCase()}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* POSTS GRID */}
                        <div className="col-lg-9">
                            <div className="blog-header-cyber mb-4">
                                <h2 className="fw-black text-white text-glow-cyber m-0">DATABASE // {activeCategory === null ? "ALL" : "FILTERED"}</h2>
                                <span className="fw-mono text-cyan-cyber">{posts.length} RECORDS FOUND</span>
                            </div>

                            <div className="row g-4">
                                {currentPosts.map((post, index) => (
                                    <div className="col-xl-4 col-md-6" key={post.id} style={{ animationDelay: `${index * 0.1}s` }}>
                                        <div className="blog-card-cyber-v3 h-100 animate-slide-up">
                                            <div className="blog-image-cyber">
                                                <img src={post.imageUrl?.startsWith("http") ? post.imageUrl : "https://localhost:7052" + post.imageUrl} alt={post.title} />
                                                <div className="image-scan-line"></div>
                                            </div>
                                            <div className="blog-body-cyber">
                                                <span className="blog-badge-cyber fw-mono">{post.categoryName || "TECH NEWS"}</span>
                                                <h3 className="text-white">{post.title}</h3>
                                                <Link to={`/blog/${post.id}`} className="blog-btn-cyber fw-mono">READ ARTICLE ⟨⟨</Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* ✅ PHÂN TRANG UI */}
                            {totalPages > 1 && (
                                <div className="pagination-cyber-container mt-5 d-flex justify-content-center gap-2">
                                    <button className="pg-btn-cyber" onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>⟨</button>
                                    {[...Array(totalPages)].map((_, i) => (
                                        <button key={i} className={`pg-btn-cyber ${currentPage === i + 1 ? "active" : ""}`} onClick={() => paginate(i + 1)}>
                                            {i + 1}
                                        </button>
                                    ))}
                                    <button className="pg-btn-cyber" onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>⟩</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Blog;