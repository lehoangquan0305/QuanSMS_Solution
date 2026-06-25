import React, { useState, useEffect } from 'react';
import productService from '../services/productService';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const data = await productService.getAllProducts();
                setProducts(data);
            } catch (error) {
                console.error("Lỗi khi tải danh sách sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // Hàm chuẩn hóa tiền tệ Việt Nam Đồng (VND) theo yêu cầu đề bài
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(value);
    };

    if (loading) {
        return (
            <div className="text-center my-5">
                <div className="spinner-border text-success" role="status"></div>
                <div className="mt-2 text-muted">Đang tải danh sách sản phẩm thời trang...</div>
            </div>
        );
    }

    if (products.length === 0) {
        return <div className="alert alert-warning text-center">Hiện tại chưa có sản phẩm nào trong hệ thống.</div>;
    }

    return (
        /* Cấu trúc lưới Grid System của Bootstrap (row-cols để tự động chia cột trên các màn hình) */
        <div className="row row-cols-1 row-cols-md-3 g-4">
            {products.map((product) => (
                <div className="col mb-4" key={product.id}>
                    <div className="card h-100 shadow-sm border-0 rounded-lg">
                        {/* Ảnh sản phẩm - Nếu database chưa có ảnh, dùng tạm ảnh placeholder */}
                        <img
                            src={product.imageUrl || "https://picsum.photos/300/200?random=" + product.id}
                            className="card-img-top rounded-top-lg"
                            alt={product.name}
                            style={{ height: '200px', objectFit: 'cover' }}
                        />

                        <div className="card-body d-flex flex-column">
                            <h6 className="card-title font-weight-bold text-dark mb-2 text-truncate" title={product.name}>
                                {product.name}
                            </h6>

                            {/* Yêu cầu định dạng tiền tệ VND */}
                            <p className="card-text text-danger font-weight-bold mb-1">
                                {formatCurrency(product.price)}
                            </p>

                            {/* Hiển thị số lượng tồn kho */}
                            <p className="card-text text-muted small mb-3">
                                <i className="fa-solid fa-warehouse mr-1"></i> Kho còn: {product.stockQuantity ?? 0} sản phẩm
                            </p>

                            <button className="btn btn-outline-primary btn-sm mt-auto w-100 font-weight-bold rounded-pill">
                                <i className="fa-solid fa-cart-plus mr-1"></i> Thêm vào giỏ
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProductList;