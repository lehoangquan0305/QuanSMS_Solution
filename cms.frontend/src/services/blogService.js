import axiosClient from '../api/axiosClient';

const blogService = {

    // Danh sách bài viết
    getAllPosts: () => {
        return axiosClient.get('/Posts');
    },

    // Bài viết theo chuyên mục
    getPostsByCategoryId: (categoryId) => {
        return axiosClient.get(`/Posts/category/${categoryId}`);
    },

    // Chi tiết bài viết
    getById: (id) => {
        return axiosClient.get(`/Posts/${id}`);
    }

};

export default blogService;