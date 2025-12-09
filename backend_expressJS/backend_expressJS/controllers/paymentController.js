const crypto = require('crypto');
const https = require('https');

exports.createMomoPayment = async (req, res) => {
    try {
        // 1. Nhận dữ liệu từ Frontend gửi lên
        const { amount, orderId } = req.body; 

        // 2. Cấu hình MoMo
        const partnerCode = "MOMO";
        const accessKey = "F8BBA842ECF85";
        const secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
        
        const requestId = partnerCode + new Date().getTime();
        const orderInfo = "Thanh toan don hang " + orderId;
        
        // --- CẤU HÌNH ĐƯỜNG DẪN TRẢ VỀ ---
        
        // QUAN TRỌNG: Sửa thành port 8080 (Frontend Nuxt.js)
        // Khi thanh toán xong, khách hàng sẽ được đưa về trang quản lý đơn hàng
        const redirectUrl = "http://localhost:8080/order"; 
        
        // ipnUrl: Link để MoMo gọi ngầm báo kết quả cho Server 
        const ipnUrl = "https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b";
        // ----------------------------------

        const requestType = "captureWallet";
        const extraData = ""; 

        // 3. Tạo chữ ký (Signature)
        const rawSignature = "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" + extraData + "&ipnUrl=" + ipnUrl + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&partnerCode=" + partnerCode + "&redirectUrl=" + redirectUrl + "&requestId=" + requestId + "&requestType=" + requestType;

        const signature = crypto.createHmac('sha256', secretKey)
            .update(rawSignature)
            .digest('hex');

        // 4. Tạo Body request
        const requestBody = JSON.stringify({
            partnerCode: partnerCode,
            partnerName: "Shop Thoi Trang",
            storeId: "MomoTestStore",
            requestId: requestId,
            amount: amount,
            orderId: orderId,
            orderInfo: orderInfo,
            redirectUrl: redirectUrl,
            ipnUrl: ipnUrl,
            lang: 'vi',
            requestType: requestType,
            autoCapture: true,
            extraData: extraData,
            signature: signature
        });

        // 5. Gửi request sang MoMo
        const options = {
            hostname: 'test-payment.momo.vn',
            port: 443,
            path: '/v2/gateway/api/create',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(requestBody)
            }
        };

        // Dùng Promise để xử lý bất đồng bộ
        const result = await new Promise((resolve, reject) => {
            const reqMomo = https.request(options, (resMomo) => {
                let data = '';
                resMomo.setEncoding('utf8');
                resMomo.on('data', (body) => {
                    data += body;
                });
                resMomo.on('end', () => {
                    try {
                        resolve(JSON.parse(data));
                    } catch (e) {
                        reject(e);
                    }
                });
            });

            reqMomo.on('error', (e) => {
                reject(e);
            });

            reqMomo.write(requestBody);
            reqMomo.end();
        });

        console.log("MoMo Result:", result);

        // 6. Trả kết quả về cho Frontend
        if (result && result.payUrl) {
            return res.status(200).json({ payUrl: result.payUrl });
        } else {
            return res.status(400).json({ message: "Lỗi tạo giao dịch MoMo", detail: result });
        }

    } catch (error) {
        console.error("Payment Controller Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};