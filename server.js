const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const app = express();

// 1. Cấu hình để nhận ảnh (Base64) lên tới 10MB cho thoải mái
app.use(express.json({ limit: '10mb' }));
app.use(cors());

// 2. Khởi tạo Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/solve', async (req, res) => {
    // Dùng let để có thể gán null sau khi dùng xong (giải phóng RAM)
    let { subject, prompt, image } = req.body;

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Cấu trúc nội dung gửi cho Gemini
        const parts = [
            { text: `Bạn là giáo viên chuyên nghiệp môn ${subject}. Hãy giải bài tập sau: ${prompt}` },
            ...(image ? [{
                inlineData: {
                    mimeType: "image/jpeg",
                    data: image.includes(",") ? image.split(",")[1] : image
                }
            }] : [])
        ];

        // Đây là chỗ "ăn tiền": Server này sẽ đợi Gemini giải xong (dù mất 30s)
        const result = await model.generateContent(parts);
        const response = await result.response;
        const text = response.text();

        // Trả kết quả về cho Frontend
        res.json({ answer: text });

    } catch (error) {
        console.error("Lỗi giải bài:", error);
        res.status(500).json({ error: "Đầu bếp (Server) đang bận hoặc gặp lỗi rồi!" });
    } finally {
        // 3. QUAN TRỌNG: Xóa sạch dữ liệu nặng trong RAM sau khi xong việc
        image = null;
        subject = null;
        prompt = null;
        console.log("--- Đã dọn dẹp RAM cho lần tiếp theo ---");
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Đầu bếp đang đợi ở cổng ${PORT}`));