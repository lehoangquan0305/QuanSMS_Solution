import React, { useEffect, useState } from "react";
import ProductCard from "../../components/ProductCard";

function HotProducts() {
    const [products, setProducts] = useState([]);
    const [toastInfo, setToastInfo] = useState({ show: false, name: "", price: 0, imageUrl: "" });

    useEffect(() => {
        const fetchHot = async () => {
            const API_URL = process.env.REACT_APP_API_URL || "https://localhost:7052/api";
            try {
                // Gọi API sản phẩm Hot số nhiều (api/products/hot)
                const res = await fetch(`${API_URL}/products/hot`);
                if (res.ok) {
                    const data = await res.json();
                    setProducts(data || []);
                }
            } catch (err) {
                console.log("Hot products error:", err);
            }
        };
        fetchHot();
    }, []);

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

        setToastInfo({
            show: true,
            name: product.name,
            price: product.price,
            imageUrl: imageUrl
        });

        setTimeout(() => {
            setToastInfo(prev => ({ ...prev, show: false }));
        }, 3000);
    };

    return (
        <section className="section-block-cyber">
            <div className="container" style={{ position: "relative" }}>
                <h2 className="section-title-cyber text-glow-cyber-home fw-mono-home mb-2 text-center" style={{ color: '#ff007f' }}>
                    ⚡ SẢN PHẨM BÁN CHẠY
                </h2>
                <div className="cyber-divider-home mx-auto mb-5" style={{ background: 'linear-gradient(90deg, #ff007f, #b91c1c)', boxShadow: '0 0 8px #ff007f' }}></div>

                <div className="row">
                    {products.map((p) => (
                        <div className="col-md-4 mb-4" key={p.id}> {/* Chia 3 cột tương ứng 3 sản phẩm */}
                            <ProductCard
                                product={p}
                                onAddToCart={() => handleAddToCartQuick(p)}
                            />
                        </div>
                    ))}
                </div>

                {toastInfo.show && (
                    <div className="cart-toast-global">
                        <img src={toastInfo.imageUrl} alt={toastInfo.name} />
                        <div style={{ flex: 1 }}>
                            <h6 style={{ margin: 0, color: "#198754", fontWeight: 700 }}>✅ Đã thêm vào giỏ hàng</h6>
                            <p style={{ margin: "4px 0", fontSize: "14px", fontWeight: 600, color: "#333" }} className="text-truncate">
                                {toastInfo.name}
                            </p>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <span style={{ color: "#dc3545", fontWeight: "bold" }}>
                                    {Number(toastInfo.price).toLocaleString()} đ
                                </span>
                                <small className="qty-badge-global">SL: 1</small>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <style>{`
                .cart-toast-global {
                    position: fixed;
                    top: 30px;
                    right: 30px;
                    width: 360px;
                    background: white;
                    border-radius: 20px;
                    padding: 15px;
                    display: flex;
                    gap: 15px;
                    align-items: center;
                    box-shadow: 0 15px 40px rgba(0,0,0,.15);
                    z-index: 9999;
                    animation: slideInGlobal .4s ease;
                    font-family: 'Segoe UI', sans-serif;
                }
                .cart-toast-global img {
                    width: 70px;
                    height: 70px;
                    object-fit: cover;
                    border-radius: 12px;
                }
                .qty-badge-global {
                    background: #e2e8f0;
                    color: #475569;
                    font-size: 0.75rem;
                    font-weight: 700;
                    padding: 3px 8px;
                    border-radius: 10px;
                }
                @keyframes slideInGlobal {
                    from { opacity: 0; transform: translateX(100px); }
                    to { opacity: 1; transform: translateX(0); }
                }
            `}</style>
        </section>
    );
}

export default HotProducts;