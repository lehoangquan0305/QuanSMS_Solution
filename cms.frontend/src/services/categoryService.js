import axiosClient from "../api/axiosClient";

const categoryService = {
    getAll: () => {
        return axiosClient.get("/Categories");
    }
};

export default categoryService;