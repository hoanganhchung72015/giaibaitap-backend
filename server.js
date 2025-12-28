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

// ... (Các phần cấu hình server cũ)

app.post('/solve', async (req, res) => {
  const { subject, image, voiceText } = req.body;

  const prompt = `
    Bạn là một hệ thống giáo dục đa chuyên gia cho môn ${subject}.
    Dữ liệu đầu vào: ${voiceText ? `Câu hỏi từ giọng nói: ${voiceText}` : "Hình ảnh đính kèm"}.
    Hãy phân tích và trả về kết quả dưới định dạng JSON duy nhất như sau:
    {
      "expert1": "Chỉ đưa ra đáp án cuối cùng, ngắn gọn.",
      "expert2": "Giải thích chi tiết từng bước logic của đáp án trên.",
      "expert3": "Đưa ra 2 bài tập tương tự kèm lời giải siêu gọn."
    }
    Lưu ý: Sử dụng LaTeX cho công thức toán học. Trả về đúng định dạng JSON, không kèm văn bản ngoài.
  `;

  // Gọi Gemini API và trả về JSON cho Frontend
  // ... logic gọi Google AI
});

