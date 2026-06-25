const axios = require('axios');

async function testChat(userMessage) {
    try {
        console.log(`\n--- Khách hỏi: "${userMessage}" ---`);
        const response = await axios.post('http://localhost:5001/api/chat', {
            message: userMessage
        });
        console.log("AI trả lời:", response.data.reply);
    } catch (err) {
        console.error("Lỗi rồi:", err.message);
    }
}

// Chạy thử 2 trường hợp
async function runTests() {
    await testChat("Shop có bán giày Adizero không?"); // Test tìm kiếm
    await testChat("Chào shop, shop bán cái gì thế?"); // Test lấy tất cả
}

runTests();