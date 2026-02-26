const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// 🔐 ĐỔI KEY Ở ĐÂY
const API_KEY = "htrang245"

app.use(cors());

/* =========================
   TRANG CHỦ
========================= */
app.get("/", (req, res) => {
    res.send("🔥 TikTok Video Download API - API by Duy Bảo 🔥");
});

/* =========================
   API TẢI VIDEO TIKTOK
========================= */
app.get("/api/tiktok/video", async (req, res) => {

    const { url, apikey } = req.query;

    // 🔐 Kiểm tra key
    if (!apikey) {
        return res.status(401).json({
            api: "API by Duy Bảo",
            status: false,
            message: "Thiếu API Key"
        });
    }

    if (apikey !== API_KEY) {
        return res.status(403).json({
            api: "API by Duy Bảo",
            status: false,
            message: "API Key không hợp lệ"
        });
    }

    if (!url) {
        return res.json({
            api: "API by Duy Bảo",
            status: false,
            message: "Thiếu link TikTok"
        });
    }

    try {

        const response = await axios.get("https://www.tikwm.com/api/", {
            params: {
                url: url,
                hd: 1
            }
        });

        if (!response.data || !response.data.data) {
            return res.json({
                api: "API by Duy Bảo",
                status: false,
                message: "Không lấy được dữ liệu"
            });
        }

        const data = response.data.data;

        if (!data.play) {
            return res.json({
                api: "API by Duy Bảo",
                status: false,
                message: "Không phải video"
            });
        }

        return res.json({
            api: "API by Duy Bảo",
            status: true,

            title: data.title,
            duration: data.duration,
            thumbnail: data.cover,

            author: {
                nickname: data.author?.nickname,
                unique_id: data.author?.unique_id,
                avatar: data.author?.avatar
            },

            statistics: {
                views: data.play_count,
                likes: data.digg_count,
                comments: data.comment_count,
                shares: data.share_count
            },

            video_hd: data.play,          // HD
            video_no_watermark: data.play, 
            music: data.music
        });

    } catch (err) {
        return res.status(500).json({
            api: "API by Duy Bảo",
            status: false,
            message: "Lỗi server",
            error: err.message
        });
    }

});

app.listen(PORT, "0.0.0.0", () => {
    console.log("Server chạy tại port " + PORT);
});
