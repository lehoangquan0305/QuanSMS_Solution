import React from 'react';
import CategoryProductList from './components/CategoryProductList'; // Danh mục sản phẩm (Buổi trước)
import PostList from './components/PostList'; // Danh sách bài viết (Phần thực hành chung)
import BlogCategoryList from './components/BlogCategoryList'; // Chuyên mục bài viết (Bài tập tự làm)
import './App.css';

function App() {
    return (
        <div className="container mt-5">
            <header className="pb-3 mb-4 border-bottom d-flex justify-content-between align-items-center">
                <span className="fs-4 font-weight-bold text-dark text-uppercase">
                    👗 Fashion Boutique - Hệ Thống Quản Trị Nội Dung & Bán Hàng
                </span>
                <span className="badge badge-success px-3 py-2">Học Phần Chuyên Đề ASP.NET + ReactJS</span>
            </header>

            <div className="row">
                {/* CỘT TRÁI: CHỨA CÁC BỘ LỌC PHÂN LOẠI DỮ LIỆU */}
                <div className="col-md-4">
                    {/* Phân loại phục vụ thương mại điện tử */}
                    <CategoryProductList />

                    {/* BÀI TẬP TỰ LÀM: Phân loại phục vụ quản trị nội dung tin tức blog */}
                    <BlogCategoryList />
                </div>

                {/* CỘT PHẢI: CHỨA NỘI DUNG CHI TIẾT HIỂN THỊ CHÍNH */}
                <div className="col-md-8">
                    <PostList />
                </div>
            </div>

            <footer className="pt-3 mt-5 text-muted border-top text-center small">
                <p>© 2026 - Đồ án thực hành phân tầng ASP.NET Core Web API kết hợp ReactJS Client-side</p>
            </footer>
        </div>
    );
}

export default App;