import React from "react";
import blogService from "../../services/blogService";

const BlogCategoryList = ({ setPosts }) => {

    const blogCategories = [
        { id: 1, name: "Xu hướng thời trang dạ hội" },
        { id: 2, name: "Mẹo bảo quản đồ công sở" },
        { id: 3, name: "Góc chất liệu vải & Phối đồ" }
    ];

    const handleFilter = async (id) => {
        try {
            const data = await blogService.getPostsByCategoryId(id);
            setPosts(data);
        } catch (err) {
            console.log("Lỗi filter blog:", err);
        }
    };

    return (
        <div className="card shadow-sm p-3 mt-4 bg-white rounded border-0">
            <h5 className="text-uppercase fw-bold text-secondary">
                🏷 Chủ đề bài viết
            </h5>

            <div className="list-group mt-2">
                {blogCategories.map((cate) => (
                    <button
                        key={cate.id}
                        onClick={() => handleFilter(cate.id)}
                        className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                    >
                        {cate.name}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default BlogCategoryList;