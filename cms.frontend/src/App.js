import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./assets/css/layout.css";
import "./assets/css/product.css";
import "./assets/css/blog.css";
import ProductDetail from "./pages/product-detail";
import Home from "./pages/home";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/product/:id" element={<ProductDetail />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;