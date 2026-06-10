/**
 * DEOBFUSCATION STUDIO - CORE CONTROLLER
 * File 01: Kích hoạt hệ thống nút bấm và quản lý Pipeline xử lý
 */

const DeobfuscationStudio = {
    // Nơi chứa 10 module thuật toán deobf sẽ được nạp vào sau
    pipelines: [],

    // Hàm để 10 file thuật toán tự đăng ký khi hệ thống khởi chạy
    registerModule(name, processFunction) {
        this.pipelines.push({ name, process: processFunction });
        console.log(`[HỆ THỐNG] Đã nạp thành công module: ${name}`);
    },

    // Hàm kích hoạt chạy xuyên qua toàn bộ các module thuật toán
    async execute(inputCode, type) {
        let currentCode = inputCode;

        // Chạy tuần tự qua từng file trong số 10 file đã đăng ký
        for (const module of this.pipelines) {
            try {
                // Truyền code vào module hiện tại và nhận lại code đã được làm sạch để chuyển cho module tiếp theo
                currentCode = await module.process(currentCode, type);
            } catch (err) {
                console.error(`[LỖI] Trục trặc tại module [${module.name}]:`, err);
                return `-- [LỖI HỆ THỐNG TẠI MODULE: ${module.name}]\n-- Tiến trình bị gián đoạn. Kết quả tạm thời bên dưới:\n\n${currentCode}`;
            }
        }
        return currentCode;
    }
};

// ==========================================
// KÍCH HOẠT VÀ XỬ LÝ LOGIC 4 NÚT BẤM (UI)
// ==========================================

// 1. NÚT: RunDeobfuscation
async function runDeobfuscation() {
    const type = document.getElementById('typeSelect').value;
    const link = document.getElementById('linkInput').value.trim();
    let inputCode = document.getElementById('inputCode').value;
    const outputTextArea = document.getElementById('outputCode');

    // Tạo hiệu ứng load công nghệ cho ô kết quả
    outputTextArea.value = "=== KHỞI ĐỘNG TIẾN TRÌNH DEOBFUSCATE CỰC MẠNH ===\n[Hệ thống]: Đang quét cấu trúc file...";

    // Nếu người dùng có nhập Link script, tiến hành fetch lấy code raw về trước
    if (link) {
        try {
            outputTextArea.value += "\n[Hệ thống]: Đang tải mã nguồn từ liên kết...";
            const response = await fetch(link);
            if (!response.ok) throw new Error("Không thể truy cập hoặc tải file từ URL này.");
            inputCode = await response.text();
            document.getElementById('inputCode').value = inputCode; // Đổ code vào ô input để hiển thị công khai
        } catch (error) {
            outputTextArea.value = `[THẤT BẠI]: ${error.message}`;
            return;
        }
    }

    // Kiểm tra xem có code để xử lý không
    if (!inputCode.trim()) {
        outputTextArea.value = "[CẢNH BÁO]: Không tìm thấy dữ liệu đầu vào. Vui lòng dán code hoặc chèn link!";
        return;
    }

    outputTextArea.value += `\n[Hệ thống]: Đang kích hoạt chuỗi cấu trúc ${DeobfuscationStudio.pipelines.length}/10 lõi xử lý...`;

    // Gọi tổng lực hệ thống xử lý qua chuỗi file JS
    // Thêm một chút delay nhỏ (300ms) tạo cảm giác máy quét chạy cho "lực" và không bị khựng giao diện
    setTimeout(async () => {
        const finalCleanCode = await DeobfuscationStudio.execute(inputCode, type);
        outputTextArea.value = finalCleanCode;
    }, 300);
}

// 2. NÚT: Copy (Sao chép nguyên khối tại chỗ)
function copyToClipboard() {
    const outputCode = document.getElementById('outputCode').value;
    
    // Ngăn copy khi chưa có kết quả thực tế
    if (!outputCode || outputCode.startsWith("=== KHỞI ĐỘNG") || outputCode.startsWith("[CẢNH BÁO]")) {
        return;
    }

    navigator.clipboard.writeText(outputCode).then(() => {
        // Hiệu ứng tương tác đổi chữ trên nút bấm cực nhạy để nhận biết đã bấm thành công
        const btn = document.querySelector('.btn-copy');
        const originalText = btn.innerText;
        
        btn.innerText = "COPIED!";
        btn.style.borderColor = "var(--border-focus)";
        btn.style.color = "var(--border-focus)";
        
        setTimeout(() => {
            btn.innerText = originalText;
            btn.style.borderColor = "var(--btn-action-border)";
            btn.style.color = "var(--text-main)";
        }, 1000);
    });
}

// 3. NÚT: Download (Tải file trực tiếp về máy)
function downloadCode() {
    const outputCode = document.getElementById('outputCode').value;
    const type = document.getElementById('typeSelect').value;
    
    if (!outputCode || outputCode.startsWith("=== KHỞI ĐỘNG") || outputCode.startsWith("[CẢNH BÁO]")) {
        return;
    }

    // Khởi tạo đối tượng tải xuống dạng file văn bản thô
    const blob = new Blob([outputCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    
    a.href = url;
    // Đặt tên file kèm mốc thời gian để tránh trùng lặp file cũ, đuôi file tự động nhảy theo loại cấu hình (lua/luau)
    a.download = `deobfuscated_studio_${Date.now()}.${type}`;
    
    document.body.appendChild(a);
    a.click();
    
    // Dọn dẹp bộ nhớ trình duyệt ngay sau khi tải xong để tối ưu hiệu năng
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// 4. NÚT: Clear (Dọn dẹp sạch sẽ sàn đấu)
function clearAll() {
    document.getElementById('linkInput').value = "";
    document.getElementById('inputCode').value = "";
    document.getElementById('outputCode').value = "";
    console.log("[HỆ THỐNG] Đã xóa toàn bộ dữ liệu tạm thời.");
  }
      
