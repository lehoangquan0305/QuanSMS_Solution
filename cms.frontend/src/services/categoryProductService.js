import axiosClient from '../api/axiosClient';

const categoryProductService = {
    /**
     * Hàm lấy toàn bộ danh mục SẢN PHẨM từ Backend
     * Endpoint này kết nối tới CategoriesProductsController trong ASP.NET Core
     */
    getAllCategoryProducts: () => {
        // ⚠️ LƯU Ý: Hãy sửa lại chữ '/categoriesproducts' bên dưới cho KHỚP CHÍNH XÁC 
        // với tên Controller trên Swagger bạn vừa kiểm tra ở Bước 3.0.1 nhé.
        const url = '/categoriesproducts';

        return axiosClient.get(url);
    }
};

export default categoryProductService;