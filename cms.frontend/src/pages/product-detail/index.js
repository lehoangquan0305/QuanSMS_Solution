import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import productService from "../../services/productService";
import "./productdetail.css"; // Đảm bảo import đúng file css của bạn

function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [showToast, setShowToast] = useState(false);

    // State quản lý số lượng sản phẩm muốn thêm vào giỏ
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await productService.getById(id);
                setProduct(data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchData();
    }, [id]);

    if (!product) {
        return (
            <div className="container py-5 text-center">
                <div className="spinner-border text-dark"></div>
                <p className="mt-2">Đang tải sản phẩm...</p>
            </div>
        );
    }

    const BASE_URL = "https://localhost:7052";
    const imageUrl = product.imageUrl?.startsWith("http")
        ? product.imageUrl
        : BASE_URL + product.imageUrl;

    // 🔥 TIÊU CHÍ 42: Kiểm soát hàm tăng số lượng tại chỗ không vượt quá kho
    const handleIncrease = () => {
        if (quantity >= product.stockQuantity) {
            alert(`Số lượng sản phẩm trong kho không đủ! (Tối đa: ${product.stockQuantity})`);
            return;
        }
        setQuantity(prev => prev + 1);
    };

    const handleDecrease = () => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    // ==========================================
    // 🔥 TIÊU CHÍ 42: KIỂM TRA TỒN KHO KHI THÊM VÀO GIỎ HÀNG
    // ==========================================
    const addToCart = () => {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        const index = cart.findIndex(item => item.id === product.id);

        let currentInCart = 0;
        if (index >= 0) {
            currentInCart = cart[index].quantity;
        }

        // Tổng số lượng sau khi thêm = Số lượng hiện tại trong giỏ + Số lượng mới chọn
        const totalRequested = currentInCart + quantity;

        // Nếu tổng số lượng vượt quá số lượng trong database -> Chặn và đưa ra cảnh báo chuẩn tiêu chí
        if (totalRequested > product.stockQuantity) {
            alert("Số lượng sản phẩm trong kho không đủ!");
            return;
        }

        if (index >= 0) {
            cart[index].quantity += quantity;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                imageUrl: imageUrl,
                quantity: quantity
            });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        window.dispatchEvent(new Event("cartUpdated"));

        setShowToast(true);
        setTimeout(() => {
            setShowToast(false);
        }, 3000);
    };

    return (
        <div className="container py-5" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
            {/* TOP PRODUCT SECTION */}
            <div className="row product-detail-adidas">

                {/* LEFT IMAGE */}
                <div className="col-md-7 mb-4 mb-md-0">
                    <div className="image-box" style={{ overflow: "hidden", borderRadius: "16px" }}>
                        <img
                            src={imageUrl}
                            alt={product.name}
                            className="img-fluid rounded shadow-sm w-100"
                            style={{ objectFit: "cover", maxHeight: "500px" }}
                        />
                    </div>
                </div>

                {/* RIGHT INFO */}
                <div className="col-md-5">
                    <div className="product-info ps-md-3">
                        <span className="badge bg-dark mb-2 px-3 py-2" style={{ letterSpacing: "1px", borderRadius: "20px" }}>
                            NEW ARRIVAL
                        </span>

                        <h1 className="title fw-bold text-uppercase" style={{ fontSize: "2rem", color: "#111" }}>
                            {product.name}
                        </h1>

                        <h2 className="price text-danger fw-bold my-3" style={{ fontSize: "1.8rem" }}>
                            {Number(product.price).toLocaleString()} đ
                        </h2>

                        {/* Thể hiện trạng thái kho rõ ràng */}
                        <p className={`stock fw-semibold ${product.stockQuantity > 0 ? 'text-success' : 'text-danger'}`}>
                            {product.stockQuantity > 0 ? `✔ Còn ${product.stockQuantity} sản phẩm trong kho` : '❌ Hết hàng'}
                        </p>

                        <p className="desc text-muted" style={{ lineHeight: "1.6" }}>
                            Giày thể thao cao cấp Adidas, thiết kế tối ưu cho chạy bộ,
                            mang lại độ êm, độ bám và phong cách hiện đại đầy năng động.
                        </p>

                        {/* BỘ CHỌN SỐ LƯỢNG */}
                        <div className="quantity-selection mt-4">
                            <label className="fw-bold mb-2 d-block text-secondary" style={{ fontSize: "0.9rem" }}>
                                SỐ LƯỢNG:
                            </label>
                            <div className="d-flex align-items-center" style={{
                                background: "#f1f5f9",
                                width: "fit-content",
                                borderRadius: "30px",
                                padding: "4px"
                            }}>
                                <button
                                    onClick={handleDecrease}
                                    style={styles.qtyActionBtn}
                                    disabled={product.stockQuantity === 0}
                                >
                                    -
                                </button>
                                <span style={{ padding: "0 20px", fontWeight: "700", fontSize: "1.1rem", minWidth: "50px", textAlign: "center" }}>
                                    {product.stockQuantity === 0 ? 0 : quantity}
                                </span>
                                <button
                                    onClick={handleIncrease}
                                    style={styles.qtyActionBtn}
                                    disabled={product.stockQuantity === 0}
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* BUTTONS ACTION */}
                        <div className="d-flex gap-3 mt-4">
                            <button
                                className="btn btn-dark btn-lg flex-grow-1 py-3 fw-bold"
                                onClick={addToCart}
                                disabled={product.stockQuantity === 0}
                                style={{ borderRadius: "30px", fontSize: "1rem", boxShadow: "0 4px 15px rgba(0,0,0,0.15)" }}
                            >
                                {product.stockQuantity > 0 ? "🛒 Thêm vào giỏ hàng" : "❌ Tạm hết hàng"}
                            </button>

                            <button
                                className="btn btn-outline-danger btn-lg py-3"
                                style={{ borderRadius: "50%", width: "55px", height: "55px", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}
                            >
                                ❤️
                            </button>
                        </div>
                    </div>
                </div>

                {/* TOAST THÔNG BÁO XỊN MỊN */}
                {showToast && (
                    <div className="cart-toast">
                        <img src={imageUrl} alt={product.name} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <h6>✅ Đã thêm vào giỏ hàng</h6>
                            <p className="mb-1 text-truncate">{product.name}</p>
                            <div className="cart-toast-footer">
                                <span>{Number(product.price).toLocaleString()} đ</span>
                                <small className="qty-badge">SL: {quantity}</small>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* DESCRIPTION - TIÊU CHÍ 44: RENDER HTML AN TOÀN TỪ CKEDITOR */}
            <div className="product-bottom mt-5 pt-4 border-top">
                <h3 className="fw-bold mb-3">Chi tiết sản phẩm</h3>

                {product.description ? (
                    <div
                        className="product-html-content text-muted"
                        style={{ lineHeight: "1.7" }}
                        dangerouslySetInnerHTML={{ __html: product.description }}
                    />
                ) : (
                    /* Fallback text mặc định nếu database trống dữ liệu html */
                    <div className="text-muted" style={{ lineHeight: "1.7" }}>
                        <p><strong>{product.name}</strong> là một trong những dòng sản phẩm thể thao hiện đại hàng đầu hiện nay, được nghiên cứu kỹ lưỡng để phù hợp cho các hoạt động chạy bộ, tập luyện cường độ cao cũng như sử dụng hằng ngày.</p>
                        <p>Sản phẩm sử dụng chất liệu vải lưới cao cấp siêu thoáng khí kết hợp với công nghệ đế đệm độc quyền, độ bền cao, phom dáng thời trang năng động.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

const styles = {
    qtyActionBtn: {
        width: "35px",
        height: "35px",
        border: "none",
        background: "#fff",
        borderRadius: "50%",
        fontWeight: "bold",
        fontSize: "1.2rem",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
        transition: "transform 0.1s ease"
    }
};

export default ProductDetail;