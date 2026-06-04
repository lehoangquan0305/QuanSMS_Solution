import React from 'react';
import CategoryProductList from './components/CategoryProductList'; // Hoặc CategoryList tùy bạn đặt tên file trước đó
import ProductList from './components/ProductList';
import PostList from './components/PostList'; // Kích hoạt phần tin tức

function App() {
    return (
        <div className="container mt-5">
            <header className="pb-3 mb-4 border-bottom">
                <span className="fs-4 font-weight-bold text-dark text-uppercase">
                    👗 FASHION BOUTIQUE - THỜI TRANG CÔNG SỞ & DẠ HỘI
                </span>
            </header>

            {/* KHU VỰC 1: SHOPPING (Sản phẩm và Bộ lọc danh mục sản phẩm) */}
            <div className="row">
                {/* Cột bên trái: Danh mục sản phẩm */}
                <div className="col-md-4">
                    <CategoryProductList />
                </div>

                {/* Cột bên phải: Danh sách sản phẩm thời trang tự làm */}
                <div className="col-md-8">
                    <h4 className="mb-4 text-uppercase text-secondary font-weight-bold">
                        <i className="fa-solid fa-shirt text-success mr-2"></i>Bộ sưu tập mới nhất
                    </h4>
                    <ProductList />
                </div>
            </div>

            {/* KHU VỰC 2: BLOG & BLOG CATEGORIES (Tin tức thời trang công sở, dạ hội) */}
            <div className="row mt-5">
                <div className="col-12">
                    <PostList />
                </div>
            </div>
        </div>
    );
}

export default App;