import React from "react";
import { useNavigate } from "react-router-dom";

// 🔥 Thêm "onAddToCart" vào đây để nhận hàm từ file cha truyền xuống
function ProductCard({ product, onAddToCart }) {

    const navigate = useNavigate();

    const BASE_URL = "https://localhost:7052";

    const imageUrl = product?.imageUrl
        ? (product.imageUrl.startsWith("http")
            ? product.imageUrl
            : BASE_URL + product.imageUrl)
        : "https://via.placeholder.com/300x200?text=No+Image";

    const goToDetail = () => {
        navigate(`/product/${product.id}`);
    };

    return (
        <div className="product-card-vip">

            {/* IMAGE */}
            <div className="image-wrapper">

                <img src={imageUrl} alt={product?.name} />

                <span className="badge-hot">HOT</span>

                {/* 👇 CLICK XEM NHANH -> VẪN VÀO DETAIL BÌNH THƯỜNG */}
                <div className="overlay">
                    <button onClick={goToDetail}>
                        👁 Xem nhanh
                    </button>
                </div>

            </div>

            {/* CONTENT */}
            <div className="content">

                <h3 title={product?.name} onClick={goToDetail} style={{ cursor: "pointer" }}>
                    {product?.name}
                </h3>

                <p className="price">
                    {Number(product?.price || 0).toLocaleString()} đ
                </p>

                {/* 👇 ĐỔI TỪ XEM CHI TIẾT THÀNH THÊM VÀO GIỎ HÀNG NGAY TẠI CHỖ */}
                <button
                    className="btn-cart"
                    onClick={onAddToCart} // 🔥 Kích hoạt hàm handleAddToCartQuick của file cha
                >
                    🛒 Thêm vào giỏ
                </button>

            </div>

        </div>
    );
}

export default ProductCard;