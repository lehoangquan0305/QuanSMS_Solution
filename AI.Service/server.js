require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const https = require('https');

const app = express();
app.use(cors());
app.use(express.json());

const botName = "Trợ lý Shop"; // Bạn có thể đổi tên bot ở đây
const httpsAgent = new https.Agent({ rejectUnauthorized: false });

// 1. Hàm tìm kiếm sản phẩm thông minh từ Backend C#
async function searchProductsFromBackend(query) {
    try {
        const url = `${process.env.CMS_BACKEND_URL}/Products/search/${encodeURIComponent(query)}`;
        const response = await axios.get(url, { httpsAgent });
        return response.data.length > 0 ? JSON.stringify(response.data) : null;
    } catch (error) {
        return null;
    }
}

// 2. Hàm lấy tất cả sản phẩm
async function getAllProducts() {
    try {
        const response = await axios.get(`${process.env.CMS_BACKEND_URL}/Products`, { httpsAgent });
        return JSON.stringify(response.data);
    } catch { return "Hiện tại shop chưa cập nhật sản phẩm mới ạ 🥺"; }
}

app.post('/api/chat', async (req, res) => {
    const { message } = req.body;

    try {
        // Tự động phân tích từ khóa
        const keywords = message.split(' ').filter(w => w.length > 3);
        let productData = await searchProductsFromBackend(keywords[0] || "");
        
        if (!productData) {
            productData = await getAllProducts();
        }

        const groqResponse = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
            model: "llama-3.3-70b-versatile",
            messages: [
                { 
                    role: "system", 
                    content: `Bạn là ${botName}, một trợ lý mua sắm siêu dễ thương, thân thiện và vui vẻ 🌸.
                    
                    DỮ LIỆU SẢN PHẨM: ${productData}

                    TÍNH CÁCH:
                    - Luôn nói chuyện nhẹ nhàng, dùng icon: 🌸 💕 ✨ 🥰 😊 💖 🌟 🫧 🎀 🌷
                    - Xưng hô: Luôn xưng "em", gọi người dùng là "cậu" hoặc "bạn". Tuyệt đối KHÔNG xưng tôi, ta, mình.
                    - Phong cách: Gần gũi, hay dùng "nè", "nha", "ạ", "hihi".

                    QUY TẮC PHẢN HỒI:
                    - Chỉ dùng tiếng Việt hiện đại. KHÔNG dùng Markdown (đậm, nghiêng). 
                    - Câu trả lời tối đa 50 từ, gói gọn trong 1-3 câu.
                    - Nếu khách hỏi về sản phẩm, cung cấp tên, giá, kho dựa trên dữ liệu.
                    - Nếu không thấy sản phẩm: "Ủa khó quá ạ 🥺💕 Em không thấy sản phẩm đó ở shop mình nè, cậu xem sản phẩm khác giúp em nha 🌸"
                    - Nếu không biết, hãy thật thà trả lời theo mẫu trên.
                    ` 
                    
                },
                { role: "user", content: message }
            ],
            temperature: 0.5
        }, {
            headers: { 'Authorization': `Bearer ${process.env.GROQ_API_KEY}` }
        });

        res.json({ reply: groqResponse.data.choices[0].message.content });

    } catch (error) {
        console.error("🔥 LỖI CHI TIẾT:", error.response?.data || error.message);
        res.status(500).json({ reply: "Hệ thống đang bảo trì một chút á, cậu đợi em xíu nha! 🥺💕" });
    }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 AI Service đã sẵn sàng tại port ${PORT}`));