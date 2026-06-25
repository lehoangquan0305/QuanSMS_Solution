import React from "react";
import { Outlet } from "react-router-dom";

import Header from "./Header";
import Footer from "./Footer";
import Chatbot from "./Chatbot";

function LayoutSite() {
    return (
        <>
            <Header />

            <main>
                <Outlet />
            </main>

            <Footer />
            <Chatbot />
        </>
    );
}

export default LayoutSite;
<style>{ `
    .chat - container {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 300px;
    height: 400px;
    border: 1px solid #ccc;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }

    .chat-window {
        height: 350px;
    overflow-y: scroll;
    padding: 10px;
    }

    .message {
        margin - bottom: 10px;
    padding: 5px;
    border-radius: 5px;
    }

    .user {
        background - color: #007bff;
    color: white;
    text-align: right;
    }

    .ai {
        background - color: #f8f9fa;
    color: #333;
    }`}
    
</style>