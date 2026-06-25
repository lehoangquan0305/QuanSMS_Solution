import React, { useEffect, useState } from "react";
import productService from "../../services/productService";
import ProductCard from "../../components/ProductCard";

function ProductList({ categoryId }) {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(6); // 6 sản phẩm mỗi trang

    // 🔥 STATE QUẢN LÝ TOAST THÔNG BÁO CHO TRANG SHOP
    const [toastInfo, setToastInfo] = useState({ show: false, name: "", price: 0, imageUrl: "" });

    useEffect(() => {
        const fetchData = async () => {
            try {
                let data;
                if (categoryId) {
                    data = await productService.getByCategory(categoryId);
                } else {
                    data = await productService.getAllProducts();
                }
                setProducts(data || []);
                setCurrentPage(1);
            } catch (err) {
                console.error("Lỗi lấy danh sách sản phẩm:", err);
            }
        };
        fetchData();
    }, [categoryId]);

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(products.length / productsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 200, behavior: 'smooth' });
    };

    // 🔥 XỬ LÝ MUA NHANH + BẬT TOAST THÔNG BÁO TẠI CHỖ
    const handleAddToCartQuick = (product) => {
        const BASE_URL = "https://localhost:7052";
        const imageUrl = product.imageUrl?.startsWith("http")
            ? product.imageUrl
            : BASE_URL + product.imageUrl;

        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        const index = cart.findIndex(item => item.id === product.id);

        if (index >= 0) {
            cart[index].quantity += 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                imageUrl: imageUrl,
                quantity: 1
            });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        window.dispatchEvent(new Event("cartUpdated"));

        // 🔥 KÍCH HOẠT HIỂN THỊ TOAST CYBER
        setToastInfo({
            show: true,
            name: product.name,
            price: product.price,
            imageUrl: imageUrl
        });

        // Tự động ẩn sau 3 giây
        setTimeout(() => {
            setToastInfo(prev => ({ ...prev, show: false }));
        }, 3000);
    };

    return (
        <div style={{ fontFamily: "SFMono-Regular, Menlo, Monaco, Consolas, monospace", position: "relative" }}>

            {/* HEADER ZONE */}
            <div className="d-flex justify-content-between align-items-center mb-4 pb-3" style={{ borderBottom: "1px solid rgba(6, 182, 212, 0.15)" }}>
                <h3 className="m-0 text-white fw-bold text-uppercase" style={{ fontSize: '1.3rem', letterSpacing: '1px', textShadow: "0 0 10px rgba(6, 182, 212, 0.3)" }}>
                    ⚡ MATRIX // PRODUCTS
                </h3>
                <span className="badge px-3 py-2" style={{ background: "rgba(6, 182, 212, 0.1)", color: "#22d3ee", border: "1px solid rgba(6, 182, 212, 0.3)", borderRadius: "8px" }}>
                    TOTAL: {products.length} ITEMS
                </span>
            </div>

            {/* PRODUCT GRID */}
            <div className="row g-4">
                {currentProducts.length > 0 ? (
                    currentProducts.map((product, index) => (
                        <div
                            className="col-lg-4 col-md-6 shop-anim-fade"
                            key={product.id}
                            style={{ animationDelay: `${index * 0.08}s` }}
                        >
                            <ProductCard
                                product={product}
                                onAddToCart={() => handleAddToCartQuick(product)}
                            />
                        </div>
                    ))
                ) : (
                    <div className="col-12 text-center py-5" style={{ background: "rgba(17, 24, 39, 0.4)", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.05)" }}>
                        <span style={{ fontSize: "3rem" }}>📦</span>
                        <p className="mt-2" style={{ color: "#9ca3af", fontWeight: "600" }}>Nguồn dữ liệu rỗng. Không tìm thấy sản phẩm.</p>
                    </div>
                )}
            </div>

            {/* CYBER PAGINATION */}
            {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-5">
                    <nav>
                        <ul className="pagination shop-cyber-pagination gap-2">
                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>‹</button>
                            </li>
                            {[...Array(totalPages).keys()].map((number) => (
                                <li key={number + 1} className={`page-item ${currentPage === number + 1 ? 'active' : ''}`}>
                                    <button className="page-link" onClick={() => handlePageChange(number + 1)}>{number + 1}</button>
                                </li>
                            ))}
                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>›</button>
                            </li>
                        </ul>
                    </nav>
                </div>
            )}

            {/* 🔥 TOAST POP-UP PHONG CÁCH DIGITAL LUXURY */}
            {toastInfo.show && (
                <div className="cart-toast-cyber">
                    <div className="toast-border-glow"></div>
                    <img src={toastInfo.imageUrl} alt={toastInfo.name} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <h6 style={{ margin: 0, color: "#22d3ee", fontWeight: 800, fontSize: "0.85rem", letterSpacing: "1px" }}>
                            ⚙️ DETECTED // ADDED TO CART
                        </h6>
                        <p style={{ margin: "4px 0", fontSize: "14px", fontWeight: 600, color: "#ffffff" }} className="text-truncate">
                            {toastInfo.name}
                        </p>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ color: "#3b82f6", fontWeight: "bold" }}>
                                {Number(toastInfo.price).toLocaleString()} đ
                            </span>
                            <small className="qty-badge-cyber">QTY: 1</small>
                        </div>
                    </div>
                </div>
            )}

            {/* HOÀN THIỆN TOÀN BỘ STYLE INLINE */}
            {/* HOÀN THIỆN TOÀN BỘ STYLE INLINE (ĐÃ BAO GỒM FIX CARD) */}
            <style>{`
                .shop-cyber-pagination .page-link {
                    width: 44px;
                    height: 44px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 1px solid rgba(6, 182, 212, 0.3) !important;
                    color: #ffffff !important;
                    background-color: rgba(17, 24, 39, 0.8) !important;
                    border-radius: 10px !important;
                    font-weight: 900;
                    transition: all 0.25s ease;
                }
                .shop-cyber-pagination .page-link:hover:not(:disabled) {
                    background: #06b6d4 !important;
                    color: #030712 !important;
                    box-shadow: 0 0 15px #06b6d4;
                }
                .shop-cyber-pagination .page-item.active .page-link {
                    background: linear-gradient(45deg, #06b6d4, #3b82f6) !important;
                    color: #ffffff !important;
                    border-color: transparent !important;
                    box-shadow: 0 0 15px rgba(6, 182, 212, 0.5);
                }
                .shop-cyber-pagination .page-item.disabled .page-link {
                    opacity: 0.25;
                    cursor: not-allowed;
                }
                .shop-anim-fade {
                    opacity: 0;
                    animation: shopFadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                @keyframes shopFadeIn {
                    from { opacity: 0; transform: translateY(15px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                /* STYLES RIÊNG CHO TOAST CYBER */
                .cart-toast-cyber {
                    position: fixed;
                    top: 35px;
                    right: 35px;
                    width: 380px;
                    background: rgba(17, 24, 39, 0.85);
                    backdrop-filter: blur(12px);
                    border: 1px solid rgba(6, 182, 212, 0.3);
                    border-radius: 16px;
                    padding: 16px;
                    display: flex;
                    gap: 15px;
                    align-items: center;
                    box-shadow: 0 20px 45px rgba(0, 0, 0, 0.5);
                    z-index: 99999;
                    animation: slideInCyberToast .3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                .toast-border-glow {
                    position: absolute;
                    inset: 0;
                    border-radius: 16px;
                    pointer-events: none;
                    box-shadow: inset 0 0 15px rgba(6, 182, 212, 0.1);
                }
                .cart-toast-cyber img {
                    width: 65px;
                    height: 65px;
                    object-fit: cover;
                    border-radius: 10px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }
                .qty-badge-cyber {
                    background: rgba(6, 182, 212, 0.15);
                    color: #22d3ee;
                    font-size: 0.7rem;
                    font-weight: 700;
                    padding: 3px 8px;
                    border-radius: 6px;
                    border: 1px solid rgba(6, 182, 212, 0.2);
                }
                @keyframes slideInCyberToast {
                    from { opacity: 0; transform: translateX(80px) scale(0.95); }
                    to { opacity: 1; transform: translateX(0) scale(1); }
                }

                /* ⚡ FIX TÀNG HÌNH & ÉP GIÁ TRỊ TOÀN BỘ PRODUCT CARD TRÊN TRANG SHOP NỀN TỐI */
                .shop-anim-fade .product-card-vip {
                    background: rgba(30, 41, 59, 0.5) !important;
                    border: 1px solid rgba(6, 182, 212, 0.15) !important;
                    border-radius: 20px !important;
                    overflow: hidden;
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3) !important;
                    transition: all 0.3s ease !important;
                }
                .shop-anim-fade .product-card-vip:hover {
                    transform: translateY(-8px) !important;
                    border-color: #06b6d4 !important;
                    box-shadow: 0 15px 30px rgba(6, 182, 212, 0.25) !important;
                }
                .shop-anim-fade .product-card-vip .content h3 {
                    color: #ffffff !important;
                    font-size: 1.05rem !important;
                    font-weight: 700 !important;
                    margin-bottom: 10px !important;
                    transition: color 0.2s;
                }
                .shop-anim-fade .product-card-vip .content h3:hover {
                    color: #22d3ee !important;
                }
                .shop-anim-fade .product-card-vip .content .price {
                    color: #22d3ee !important;
                    font-weight: 800 !important;
                    font-size: 1.1rem !important;
                    margin-bottom: 15px !important;
                }
                .shop-anim-fade .product-card-vip .btn-cart {
                    width: 100% !important;
                    background: rgba(6, 182, 212, 0.1) !important;
                    color: #22d3ee !important;
                    border: 1px solid rgba(6, 182, 212, 0.3) !important;
                    padding: 10px !important;
                    border-radius: 10px !important;
                    font-weight: 700 !important;
                    font-family: monospace !important;
                    transition: all 0.25s ease !important;
                }
                .shop-anim-fade .product-card-vip .btn-cart:hover {
                    background: #06b6d4 !important;
                    color: #030712 !important;
                    box-shadow: 0 0 15px #06b6d4 !important;
                }
            `}</style>
        </div>
    );
}

export default ProductList;