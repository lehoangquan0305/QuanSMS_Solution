import axiosClient from "../api/axiosClient";

const productService = {
    // ALL PRODUCTS
    getAllProducts: () => {
        return axiosClient.get("/Products");
    },
    getById: (id) => {
        return axiosClient.get(`/Products/${id}`);
    },

    // 🔥 FIX ĐÚNG THEO SWAGGER
    getByCategory: (categoryProductId) => {
        return axiosClient.get(`/Products/categoryproduct/${categoryProductId}`);
    }
};

export default productService;