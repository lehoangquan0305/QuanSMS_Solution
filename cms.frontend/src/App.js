import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LayoutSite from "./components/LayoutSite";

import Home from "./pages/home";
import ProductDetail from "./pages/product-detail";
import Blog from "./pages/blog";
import BlogDetail from "./pages/blog/BlogDetail";
import Shop from "./pages/shop";
import "./assets/css/layout.css";
import "./assets/css/product.css";
import "./assets/css/blog.css";
import Cart from "./pages/cart";
import Checkout from "./pages/checkout";
import Register from "./pages/register";
import Login from "./pages/login";
import Profile from "./pages/Profile/Profile";
import Orders from "./pages/order";
import OrderDetail from "./pages/orderdetail";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                <Route element={<LayoutSite />}>

                    <Route
                        path="/"
                        element={<Home />}
                    />

                    <Route
                        path="/product/:id"
                        element={<ProductDetail />}
                    />
                    <Route path="/blog" element={<Blog />} />
                    <Route
                        path="/blog/:id"
                        element={<BlogDetail />}
                    />
                    <Route
                        path="/shop"
                        element={<Shop />}
                    />
                    <Route
                        path="/cart"
                        element={<Cart />}
                    />
                    <Route
                        path="/checkout"
                        element={<Checkout />}
                    />
                    <Route
                        path="/login"
                        element={<Login />}
                    />
                    <Route
                        path="/register"
                        element={<Register />}
                    />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/orders/:id" element={<OrderDetail />} />

                </Route>

            </Routes>
        </BrowserRouter>
    );
}

export default App;