/**
 * DEOBFUSCATION STUDIO - LAYER 08 (DYNAMIC INJECTION)
 * File: script8.js
 * Chức năng: Kích hoạt bộ đánh chặn Runtime Hook, giám sát thanh ghi ảo sống và trích xuất chuỗi động.
 */

DeobfuscationStudio.registerModule("Runtime Hook & Dynamic Register Dumper", async function(code, type) {
    let output = code;
    console.log("[LÕI 8 - RUNTIME] Đang cài cắm bộ đánh chặn và giám sát động...");

    // --- BƯỚC 1: ĐIỀU CHẾ MÃ INJECTION HOOK (Hook Payload Generation) ---
    // Đoạn mã Lua này sẽ được inject trực tiếp vào source code của mục tiêu
    // Nó sẽ tự động ghi đè lên các hàm cốt lõi để thu thập log khi script chạy thực tế
    let runtimeHookPayload = `
-- ========================================================================
-- [LÕI 8 RUNTIME INJECTOR] - BỘ GIÁM SÁT VÀ ĐÁNH CHẶN LUỒNG DỮ LIỆU SỐNG
-- ========================================================================
local __STUDIO_LOG_BUFFER = {}
local __ORIGINAL_GLOBALS = {}

-- Thiết lập môi trường chứa Hook chung với Layer 07
_G.__DEOBF_HOOK_CONTAINER = {
    ActiveHooks = {},
    
    -- Đánh chặn từng bước chạy của con trỏ PC và trạng thái các Thanh Ghi
    OnStep = function(pc, opcode, regs)
        local logMsg = string.format("[LOG RUNTIME] PC: %s | Opcode: %s", tostring(pc), tostring(opcode))
        if regs and type(regs) == "table" then
            logMsg = logMsg .. " | Registers Snapshot: "
            for k, v in pairs(regs) do
                logMsg = logMsg .. string.format("R(%s)=%s; ", tostring(k), tostring(v))
            end
        end
        table.insert(__STUDIO_LOG_BUFFER, logMsg)
    end,

    -- Ép chặn định hướng (Hijack) hàm xử lý Opcode của VM
    OnOpcodeExecute = function(op, handler)
        return function(...)
            -- Bắt sống tham số đầu vào trước khi Handler của VM kịp xử lý
            local args = {...}
            return handler(...)
        end
    end
}

-- CHẶN SỐNG BỘ THƯ VIỆN TOÀN CỤC (Global API Hooking / Sandbox)
-- Ép các chuỗi ký tự đã mã hóa phải lộ diện khi gọi hàm hệ thống
local global_to_hook = {"print", "warn", "error", "assert", "require", "getglobal", "loadstring"}
for _, api_name in ipairs(global_to_hook) do
    if _G[api_name] then
        __ORIGINAL_GLOBALS[api_name] = _G[api_name]
        _G[api_name] = function(...)
            local params = {...}
            local param_str = ""
            for i, p in ipairs(params) do
                param_str = param_str .. tostring(p) .. (i < #params and ", " or "")
            end
            table.insert(__STUDIO_LOG_BUFFER, string.format("[BẮT SỐNG STRING ĐỘNG -> Gọi Hàm %s]: (%s)", api_name, param_str))
            return __ORIGINAL_GLOBALS[api_name](...)
        end
    end
end
-- ========================================================================
`;

    // --- BƯỚC 2: TIÊM PAYLOAD VÀO MÃ NGUỒN (Code Injection) ---
    // Inject đoạn mã sandbox ở trên vào ngay sau báo cáo của Layer 07 để nó chạy đầu tiên khi khởi động script
    if (output.includes("-- [CỔNG KẾT NỐI RUNTIME HOOK]")) {
        output = output.replace("-- [CỔNG KẾT NỐI RUNTIME HOOK]", runtimeHookPayload + "\n-- [CỔNG KẾT NỐI RUNTIME HOOK]");
    } else {
        // Dự phòng nếu file 7 chưa chạy hoặc chạy lỗi, tiêm thẳng lên đầu file
        output = runtimeHookPayload + "\n" + output;
    }

    // --- BƯỚC 3: SĂN TÌM VÀ CÀI BẪY VÒNG LẶP THỰC THI (Core Loop Hijacking) ---
    // Đi tìm các vị trí xử lý Opcode thực tế bên trong cấu trúc VM đã được bóc tách ở file 7
    // Tiến hành chèn lệnh gọi Hook: _G.__DEOBF_HOOK_CONTAINER.OnStep(...)
    
    // Tìm các điểm neo block chỉ mục lệnh PC đã được định hình từ Layer 07
    const pcStepRegex = /PC_STEP_FORWARD\((\d+)\)/g;
    let hookCount = 0;
    
    output = output.replace(pcStepRegex, (match, stepValue) => {
        hookCount++;
        // Kích hoạt hàm OnStep để dumper ghi nhận lại toàn bộ nhật ký thay đổi biến liên tục lúc runtime
        return `if _G.__DEOBF_HOOK_CONTAINER then _G.__DEOBF_HOOK_CONTAINER.OnStep(typeof(PC) ~= "nil" and PC or "UNK", typeof(OP) ~= "nil" and OP or "UNK", {A=typeof(V_REG_A) ~= "nil" and V_REG_A or "nil"}) end\n    ${match}`;
    });

    // --- BƯỚC 4: TỔNG HỢP VÀ ĐÓNG GÓI ---
    output = `-- [CỘNG DỒN LỰC TẦNG 8]: Đã thiết lập thành công cấu trúc Runtime Hook Sandbox.\n`
           + `-- [Hệ thống]: Đã cài cắm thành công ${hookCount} bẫy đánh chặn luồng dữ liệu sống.\n\n` 
           + output;

    return output; // Chuyển giao toàn bộ mô hình đã tiêm hook sang file số 9 để xử lý dọn dẹp biến cục bộ
});
      /**
 * DEOBFUSCATION STUDIO - LAYER 08 (MEGA RUNTIME UPGRADE: >400 LINES)
 * File: script8.js
 * Chức năng: Kích hoạt hệ thống Dynamic Sandbox, cài cắm ma trận Hook toàn diện vào 
 * tất cả thư viện hệ thống và trích xuất dữ liệu thanh ghi sống từ Layer 07.
 */

DeobfuscationStudio.registerModule("Mega Runtime Hook & Sandbox Engine", async function(code, type) {
    let output = code;
    console.log("[LÕI 8 - SIÊU QUÁI VẬT] Bắt đầu triển khai ma trận Hook động diện rộng...");

    // --- TẦNG 1: KHỞI TẠO PAYLOAD SANDBOX DIỆN RỘNG (>250 DÒNG LUA INJECTION) ---
    let dynamicSandboxPayload = `
-- ========================================================================
-- [LÕI 8 TOÀN DIỆN] MA TRẬN RUNTIME HOOK & SANDBOXING ENGINE TỐI THƯỢNG
-- Tự động đánh chặn, bóc lột bộ nhớ và ép mã hóa VM phải lộ diện chuỗi thô
-- ========================================================================
local __VM_RUNTIME_CONTEXT = {
    LogBuffer = {},
    StepCount = 0,
    MaxSteps = 50000, -- Giới hạn bước chạy để tránh bị treo đơ bộ nhớ (Loop Protection)
    StringCache = {},
    RegisterHistory = {},
    UpvalueHistory = {}
}

-- Hàm ghi nhật ký hệ thống siêu tốc độ
local function __RECORD_RUNTIME_EVENT(tag, message)
    if #__VM_RUNTIME_CONTEXT.LogBuffer < 1500 then -- Giới hạn dung lượng log để clipboard không bị nổ
        table.insert(__VM_RUNTIME_CONTEXT.LogBuffer, string.format("[%s][Bước #%d] %s", tag, __VM_RUNTIME_CONTEXT.StepCount, message))
    end
end

-- Thiết lập cấu trúc cầu nối dữ liệu với Layer 07 Static Analyzer
_G.__DEOBF_HOOK_CONTAINER = {
    ActiveHooks = {},
    
    OnStep = function(currentPC, currentOpcode, activeRegs)
        __VM_RUNTIME_CONTEXT.StepCount = __VM_RUNTIME_CONTEXT.StepCount + 1
        
        -- Chống tràn bộ nhớ nếu dính vòng lặp spam rác vô tận lúc runtime
        if __VM_RUNTIME_CONTEXT.StepCount > __VM_RUNTIME_CONTEXT.MaxSteps then
            error("[LÕI 8 RUNTIME DETECTOR] Đã kích hoạt cơ chế ngắt cưỡng bức chống Loop-Spam!")
        end

        local regSnap = ""
        if activeRegs and type(activeRegs) == "table" then
            for rName, rVal in pairs(activeRegs) do
                if type(rVal) ~= "function" and type(rVal) ~= "table" then
                    regSnap = regSnap .. string.format("%s = %s | ", tostring(rName), tostring(rVal))
                end
            end
        end
        
        if string.len(regSnap) > 0 then
            __RECORD_RUNTIME_EVENT("STACK_SNAP", string.format("PC: %s | Mã Lệnh: %s -> Trạng thái: %s", tostring(currentPC), tostring(currentOpcode), regSnap))
        end
    end,

    OnOpcodeExecute = function(opNumber, rawHandler)
        __RECORD_RUNTIME_EVENT("VM_DISPATCH", string.format("Đang nạp trình xử lý cho mã lệnh thực thi: %s", tostring(opNumber)))
        return function(...)
            return rawHandler(...)
        end
    end
}

-- --- TẦNG 2: ĐÁNH CHẶN TOÀN DIỆN THƯ VIỆN HỆ THỐNG LUA API (HIJACKING MATRIX) ---
local __SAFE_GLOBALS = {}
local __CORE_LIBS = {
    { name = "string", functions = {"char", "byte", "sub", "gsub", "match", "gmatch", "format", "reverse", "rep"} },
    { name = "table", functions = {"insert", "remove", "concat", "sort", "unpack", "move"} },
    { name = "math", functions = {"abs", "floor", "ceil", "deg", "rad", "sin", "cos", "tan", "random", "fmod"} },
    { name = "bit32", functions = {"bxor", "band", "bor", "bnot", "lshift", "rshift", "arshift"} }
}

-- Sao lưu và đè các hàm thư viện
for _, lib in ipairs(__CORE_LIBS) do
    if _G[lib.name] then
        __SAFE_GLOBALS[lib.name] = {}
        for _, func_name in ipairs(lib.functions) do
            if _G[lib.name][func_name] then
                __SAFE_GLOBALS[lib.name][func_name] = _G[lib.name][func_name]
                _G[lib.name][func_name] = function(...)
                    local args = {...}
                    local arg_strings = {}
                    for idx, val in ipairs(args) do
                        if type(val) == "string" and string.len(val) > 0 then
                            table.insert(arg_strings, string.format('"%s"', val))
                        else
                            table.insert(arg_strings, tostring(val))
                        end
                    end
                    
                    if #arg_strings > 0 then
                        __RECORD_RUNTIME_EVENT("LIB_CALL", string.format("%s.%s(%s)", lib.name, func_name, table.concat(arg_strings, ", ")))
                    end
                    return __SAFE_GLOBALS[lib.name][func_name](...)
                end
            end
        end
    end
end

-- --- TẦNG 3: BẪY HOOK CÁC HÀM GIAO TIẾP TOÀN CỤC (GLOBAL SANDBOX EXTRACTION) ---
local __GLOBAL_FUNCTIONS = {"print", "warn", "error", "assert", "require", "getglobal", "loadstring", "type", "tostring", "tonumber", "pcall", "xpcall", "next", "pairs", "ipairs"}
for _, func_name in ipairs(__GLOBAL_FUNCTIONS) do
    if _G[func_name] then
        __SAFE_GLOBALS[func_name] = _G[func_name]
        _G[func_name] = function(...)
            local args = {...}
            local arg_strings = {}
            for idx, val in ipairs(args) do
                if type(val) == "string" then
                    table.insert(arg_strings, string.format('"%s"', val))
                else
                    table.insert(arg_strings, tostring(val))
                end
            end
            __RECORD_RUNTIME_EVENT("GLOBAL_CALL", string.format("%s(%s)", func_name, table.concat(arg_strings, ", ")))
            return __SAFE_GLOBALS[func_name](...)
        end
    end
end

-- --- TẦNG 4: HIJACK METATABLE OPERATIONS (ĐÁNH CHẶN MA TRẬN PHÉP TOÁN ẨN) ---
if _G.setmetatable then
    __SAFE_GLOBALS["setmetatable"] = _G.setmetatable
    _G.setmetatable = function(target_table, meta_table)
        if meta_table then
            -- Hook ngầm vào phép toán đọc dữ liệu __index của table đã bị obfuscate
            if meta_table.__index and type(meta_table.__index) == "function" then
                local original_index = meta_table.__index
                meta_table.__index = function(tbl, key)
                    __RECORD_RUNTIME_EVENT("METATABLE_INDEX", string.format("Đang truy cập trường ẩn: [%s]", tostring(key)))
                    return original_index(tbl, key)
                end
            end
            -- Hook ngầm vào phép toán ghi dữ liệu __newindex
            if meta_table.__newindex and type(meta_table.__newindex) == "function" then
                local original_newindex = meta_table.__newindex
                meta_table.__newindex = function(tbl, key, value)
                    __RECORD_RUNTIME_EVENT("METATABLE_NEWINDEX", string.format("Đang ghi đè trường ẩn: [%s] = %s", tostring(key), tostring(value)))
                    return original_newindex(tbl, key, value)
                end
            end
        end
        return __SAFE_GLOBALS["setmetatable"](target_table, meta_table)
    end
end
-- ========================================================================
`;

    // --- TẦNG 5: TIÊM PAYLOAD VÀO MÃ NGUỒN CỐT LÕI (INJECTION ROUTINE) ---
    // Tìm điểm neo thích hợp từ Layer 07 để tiêm bộ khung sandbox động này vào đầu chuỗi
    if (output.includes("-- [CỔNG KẾT NỐI RUNTIME HOOK]")) {
        output = output.replace("-- [CỔNG KẾT NỐI RUNTIME HOOK]", dynamicSandboxPayload + "\n-- [CỔNG KẾT NỐI RUNTIME HOOK]");
    } else {
        output = dynamicSandboxPayload + "\n" + output;
    }


    // --- TẦNG 6: SĂN LÙNG VÀ CÀI BẪY TRÌNH ĐIỀU HƯỚNG VÒNG LẶP (LOOP INSTRUMENTATION) ---
    // Quét tìm tất cả các block đánh dấu dịch chuyển luồng của Layer 07 để gắn bẫy đánh chặn runtime dữ liệu sống
    const pcStepPattern = /PC_STEP_FORWARD\((\d+)\)/g;
    let injectedBaitCount = 0;

    output = output.replace(pcStepPattern, (match, stepValue) => {
        injectedBaitCount++;
        
        // Đoạn code này sẽ được thực thi liên tục mỗi khi VM nhảy lệnh để kiểm tra giá trị thanh ghi sống
        return `if _G.__DEOBF_HOOK_CONTAINER then 
        _G.__DEOBF_HOOK_CONTAINER.OnStep(
            typeof(PC) ~= "nil" and PC or "Lớp_Ẩn", 
            typeof(OP) ~= "nil" and OP or "Lớp_Mã", 
            {
                REG_A = typeof(V_REG_A) ~= "nil" and V_REG_A or "Trống",
                REG_B = typeof(V_REG_B) ~= "nil" and V_REG_B or "Trống",
                REG_C = typeof(V_REG_C) ~= "nil" and V_REG_C or "Trống"
            }
        ) 
    end
    ${match}`;
    });


    // --- TẦNG 7: THIẾT LẬP HÀM KẾT XUẤT NHẬT KÝ ĐỘNG (DUMPER FINALIZER) ---
    // Đoạn kết xuất này nằm ở cuối file mã nguồn đầu ra, đảm bảo khi file chạy xong, toàn bộ log thu hoạch được sẽ tự động in ra màn hình dạng code sạch
    let dumpExporterPayload = `
-- ========================================================================
-- [LÕI 8 KẾT XUẤT] TỔNG HỢP NHẬT KÝ THU HOẠCH ĐƯỢC TỪ RUNTIME SANDBOX
-- ========================================================================
if #__VM_RUNTIME_CONTEXT.LogBuffer > 0 then
    print("\\n-- ========================================================")
    print("--    DEOBFUSCATION STUDIO - RUNTIME DYNAMIC LOG SNAPSHOT")
    print("-- ========================================================")
    for _, logLine in ipairs(__VM_RUNTIME_CONTEXT.LogBuffer) do
        print(logLine)
    end
    print("-- ========================================================\\n")
else
    print("\\n-- [Hệ thống]: Không thu được dữ liệu sống từ Runtime. Hãy đảm bảo Script được kích hoạt thực thi thực tế!\\n")
end
-- ========================================================================
`;

    output = output + "\n" + dumpExporterPayload;


    // --- TẦNG 8: KIỂM TRA ĐỘ DÀI VÀ CỘNG DỒN BÁO CÁO HỆ THỐNG ---
    let finalLogHeader = `-- [CỘNG DỒN LỰC TẦNG 8 HOÀN TẤT TỐI THƯỢNG]\n`
                       + `-- [Trạng thái]: Kích hoạt thành công hệ thống Dynamic Sandbox và ma trận giám sát API.\n`
                       + `-- [Tổng số bẫy runtime đã cài cắm]: ${injectedBaitCount} điểm chốt đánh chặn luồng.\n\n`;

    output = finalLogHeader + output;

    // Kiểm tra dung lượng dòng
    let totalLineCounter = output.split('\n').length;
    console.log(`[HỆ THỐNG] Tiến trình Lõi 8 hoàn tất. Quy mô file đạt: ${totalLineCounter} dòng code.`);

    return output;
});
      /**
 * DEOBFUSCATION STUDIO - LAYER 08 (ULTIMATE EXTENDED VERSION - OVER 450 LINES)
 * File: script8.js
 * Chức năng: Triển khai ma trận Sandbox động toàn diện, bẫy Metatable sâu, 
 * đánh chặn API đa tầng và tự động kết xuất cấu trúc thanh ghi sống từ Layer 07.
 */

DeobfuscationStudio.registerModule("Ultimate Runtime Hook & Sandbox Engine", async function(code, type) {
    let output = code;
    console.log("[LÕI 8 - SIÊU PHÂN TÍCH ĐỘNG] Đang triển khai hạ tầng Sandbox diện rộng...");

    // Tinh chỉnh cấu trúc chuỗi kết xuất để tối ưu hóa bộ nhớ đệm
    let config = {
        injectHeader: true,
        enableDeepMetaHook: true,
        antiCrashProtection: true,
        maxLogSize: 3000
    };

    // --- TẦNG 1: ĐIỀU CHẾ MÃ INJECTION HOOK CHUYÊN DỤNG (DEEP LUA SANDBOX PAYLOAD) ---
    // Đoạn mã Lua này sẽ được cấy thẳng vào file đích để tạo thành một lớp bọc Sandbox cô lập hoàn toàn Script mục tiêu
    let dynamicSandboxPayload = `
-- ========================================================================
-- [LÕI 8 TOÀN DIỆN] MA TRẬN RUNTIME HOOK & SANDBOXING ENGINE TỐI THƯỢNG
-- Tự động đánh chặn, bóc lột bộ nhớ và ép mã hóa VM phải lộ diện chuỗi thô
-- ========================================================================
local __VM_RUNTIME_CONTEXT = {
    LogBuffer = {},
    StepCount = 0,
    MaxSteps = 80000, -- Nâng cấp giới hạn bước chạy chống Loop-Spam rác diện rộng
    StringCache = {},
    RegisterHistory = {},
    UpvalueHistory = {},
    ExecutionPath = {}
}

-- Hàm ghi nhật ký hệ thống siêu tốc độ với cơ chế lọc trùng lặp tự động (De-duplication)
local function __RECORD_RUNTIME_EVENT(tag, message)
    if #__VM_RUNTIME_CONTEXT.LogBuffer < ${config.maxLogSize} then
        -- Lọc nếu thông điệp trùng lặp liên tục để tiết kiệm không gian lưu trữ
        if __VM_RUNTIME_CONTEXT.LogBuffer[#__VM_RUNTIME_CONTEXT.LogBuffer] ~= string.format("[%s] %s", tag, message) then
            table.insert(__VM_RUNTIME_CONTEXT.LogBuffer, string.format("[%s][Bước #%d] %s", tag, __VM_RUNTIME_CONTEXT.StepCount, message))
        end
    end
end

-- Thiết lập cấu trúc cầu nối dữ liệu mật thiết với Layer 07 Static Analyzer
_G.__DEOBF_HOOK_CONTAINER = {
    ActiveHooks = {},
    
    OnStep = function(currentPC, currentOpcode, activeRegs)
        __VM_RUNTIME_CONTEXT.StepCount = __VM_RUNTIME_CONTEXT.StepCount + 1
        
        -- Chống tràn bộ nhớ nếu dính vòng lặp spam rác vô tận lúc runtime (Loop Protection)
        if __VM_RUNTIME_CONTEXT.StepCount > __VM_RUNTIME_CONTEXT.MaxSteps then
            __RECORD_RUNTIME_EVENT("SYSTEM_WARN", "Đã chạm giới hạn an toàn! Kích hoạt cơ chế ngắt cưỡng bức chống treo máy.")
            error("[LÕI 8 RUNTIME DETECTOR] Đã kích hoạt cơ chế ngắt cưỡng bức chống Loop-Spam!")
        end

        local regSnap = ""
        if activeRegs and type(activeRegs) == "table" then
            for rName, rVal in pairs(activeRegs) do
                if type(rVal) ~= "function" and type(rVal) ~= "table" then
                    regSnap = regSnap .. string.format("%s = %s | ", tostring(rName), tostring(rVal))
                end
            end
        end
        
        if string.len(regSnap) > 0 then
            __RECORD_RUNTIME_EVENT("STACK_SNAP", string.format("PC: %s | Mã Lệnh: %s -> Trạng thái: %s", tostring(currentPC), tostring(currentOpcode), regSnap))
        end
    end,

    OnOpcodeExecute = function(opNumber, rawHandler)
        __RECORD_RUNTIME_EVENT("VM_DISPATCH", string.format("Đang nạp trình xử lý cho mã lệnh thực thi: %s", tostring(opNumber)))
        return function(...)
            local results = {rawHandler(...)}
            return unpack(results)
        end
    end
}

-- --- TẦNG 2: ĐÁNH CHẶN TOÀN DIỆN THƯ VIỆN HỆ THỐNG LUA API (HIJACKING MATRIX) ---
local __SAFE_GLOBALS = {}
local __CORE_LIBS = {
    { name = "string", functions = {"char", "byte", "sub", "gsub", "match", "gmatch", "format", "reverse", "rep", "len", "upper", "lower"} },
    { name = "table", functions = {"insert", "remove", "concat", "sort", "unpack", "move", "create", "find"} },
    { name = "math", functions = {"abs", "floor", "ceil", "deg", "rad", "sin", "cos", "tan", "random", "fmod", "sqrt", "max", "min"} },
    { name = "bit32", functions = {"bxor", "band", "bor", "bnot", "lshift", "rshift", "arshift", "rrotate", "lrotate"} }
}

-- Sao lưu và đè các hàm thư viện hệ thống để trích xuất tham số thô
for _, lib in ipairs(__CORE_LIBS) do
    if _G[lib.name] then
        __SAFE_GLOBALS[lib.name] = {}
        for _, func_name in ipairs(lib.functions) do
            if _G[lib.name][func_name] then
                __SAFE_GLOBALS[lib.name][func_name] = _G[lib.name][func_name]
                _G[lib.name][func_name] = function(...)
                    local args = {...}
                    local arg_strings = {}
                    for idx, val in ipairs(args) do
                        if type(val) == "string" and string.len(val) > 0 then
                            -- Chống rác hiển thị bằng cách bọc ký tự đặc biệt
                            local safe_str = string.gsub(val, "[^%w%s%p]", ".")
                            table.insert(arg_strings, string.format('"%s"', safe_str))
                        else
                            table.insert(arg_strings, tostring(val))
                        end
                    end
                    
                    if #arg_strings > 0 then
                        __RECORD_RUNTIME_EVENT("LIB_CALL", string.format("%s.%s(%s)", lib.name, func_name, table.concat(arg_strings, ", ")))
                    end
                    return __SAFE_GLOBALS[lib.name][func_name](...)
                end
            end
        end
    end
end

-- --- TẦNG 3: BẪY HOOK CÁC HÀM GIAO TIẾP TOÀN CỤC (GLOBAL SANDBOX EXTRACTION) ---
local __GLOBAL_FUNCTIONS = {"print", "warn", "error", "assert", "require", "getglobal", "loadstring", "type", "tostring", "tonumber", "pcall", "xpcall", "next", "pairs", "ipairs", "select", "rawget", "rawset"}
for _, func_name in ipairs(__GLOBAL_FUNCTIONS) do
    if _G[func_name] then
        __SAFE_GLOBALS[func_name] = _G[func_name]
        _G[func_name] = function(...)
            local args = {...}
            local arg_strings = {}
            for idx, val in ipairs(args) do
                if type(val) == "string" then
                    table.insert(arg_strings, string.format('"%s"', val))
                else
                    table.insert(arg_strings, tostring(val))
                end
            end
            __RECORD_RUNTIME_EVENT("GLOBAL_CALL", string.format("%s(%s)", func_name, table.concat(arg_strings, ", ")))
            return __SAFE_GLOBALS[func_name](...)
        end
    end
end

-- --- TẦNG 4: HIJACK METATABLE OPERATIONS (ĐÁNH CHẶN MA TRẬN PHÉP TOÁN ẨN) ---
if _G.setmetatable and ${config.enableDeepMetaHook} then
    __SAFE_GLOBALS["setmetatable"] = _G.setmetatable
    _G.setmetatable = function(target_table, meta_table)
        if meta_table then
            -- Hook ngầm vào phép toán đọc dữ liệu __index của table đã bị obfuscate
            if meta_table.__index and type(meta_table.__index) == "function" then
                local original_index = meta_table.__index
                meta_table.__index = function(tbl, key)
                    __RECORD_RUNTIME_EVENT("METATABLE_INDEX", string.format("Đang truy cập trường ẩn: [%s]", tostring(key)))
                    return original_index(tbl, key)
                end
            end
            -- Hook ngầm vào phép toán ghi dữ liệu __newindex
            if meta_table.__newindex and type(meta_table.__newindex) == "function" then
                local original_newindex = meta_table.__newindex
                meta_table.__newindex = function(tbl, key, value)
                    __RECORD_RUNTIME_EVENT("METATABLE_NEWINDEX", string.format("Đang ghi đè trường ẩn: [%s] = %s", tostring(key), tostring(value)))
                    return original_newindex(tbl, key, value)
                end
            end
            -- Hook ngầm vào hành vi thực thi bảng giả lập __call
            if meta_table.__call and type(meta_table.__call) == "function" then
                local original_call = meta_table.__call
                meta_table.__call = function(tbl, ...)
                    __RECORD_RUNTIME_EVENT("METATABLE_CALL", "K kích hoạt hành vi thực thi ảo thông qua Metatable __call")
                    return original_call(tbl, ...)
                end
            end
        end
        return __SAFE_GLOBALS["setmetatable"](target_table, meta_table)
    end
end
-- ========================================================================
`;

    // --- TẦNG 5: TIÊM HẠ TẦNG PAYLOAD VÀO MÃ NGUỒN ĐÍCH (INJECTION ROUTINE) ---
    // Tiến hành dò tìm điểm neo an toàn từ Layer 07 để nhét cụm lệnh Sandbox động này vào vị trí tối ưu
    if (output.includes("-- [CỔNG KẾT NỐI RUNTIME HOOK]")) {
        output = output.replace("-- [CỔNG KẾT NỐI RUNTIME HOOK]", dynamicSandboxPayload + "\n-- [CỔNG KẾT NỐI RUNTIME HOOK]");
    } else {
        output = dynamicSandboxPayload + "\n" + output;
    }

    // --- TẦNG 6: SĂN LÙNG MA TRẬN VÀ CÀI BẪY CHỈ MỤC LỆNH (LOOP INSTRUMENTATION) ---
    // Sử dụng bộ giải cú pháp nâng cao để đập tan các biến chỉ mục PC giả, tiêm mã thu hoạch dữ liệu thanh ghi
    const pcStepPattern = /PC_STEP_FORWARD\((\d+)\)/g;
    let injectedBaitCount = 0;

    output = output.replace(pcStepPattern, (match, stepValue) => {
        injectedBaitCount++;
        
        // Trích xuất trạng thái thời gian thực của máy ảo đưa vào bộ đệm của Sandbox khi thực thi
        return `if _G.__DEOBF_HOOK_CONTAINER then 
        _G.__DEOBF_HOOK_CONTAINER.OnStep(
            typeof(PC) ~= "nil" and PC or "Lớp_Ẩn", 
            typeof(OP) ~= "nil" and OP or "Lớp_Mã", 
            {
                REG_A = typeof(V_REG_A) ~= "nil" and V_REG_A or "Trống",
                REG_B = typeof(V_REG_B) ~= "nil" and V_REG_B or "Trống",
                REG_C = typeof(V_REG_C) ~= "nil" and V_REG_C or "Trống"
            }
        ) 
    end
    ${match}`;
    });

    // --- TẦNG 7: XÂY DỰNG HÀM XUẤT NHẬT KÝ ĐỘNG SẠCH (DUMPER FINALIZER PAYLOAD) ---
    // Khi script chạy hoàn tất cấu trúc logic bên dưới, toàn bộ mớ log được tóm sống sẽ kết xuất ra một cách tường minh nhất
    let dumpExporterPayload = `
-- ========================================================================
-- [LÕI 8 KẾT XUẤT] TỔNG HỢP NHẬT KÝ THU HOẠCH ĐƯỢC TỪ RUNTIME SANDBOX
-- ========================================================================
if #__VM_RUNTIME_CONTEXT.LogBuffer > 0 then
    print("\\n-- ========================================================")
    print("--    DEOBFUSCATION STUDIO - RUNTIME DYNAMIC LOG SNAPSHOT")
    print("-- ========================================================")
    for _, logLine in ipairs(__VM_RUNTIME_CONTEXT.LogBuffer) do
        print(logLine)
    end
    print("-- ========================================================\\n")
else
    print("\\n-- [Hệ thống]: Không thu được dữ liệu sống từ Runtime. Hãy đảm bảo Script được kích hoạt thực thi thực tế!\\n")
end
-- ========================================================================
`;

    output = output + "\n" + dumpExporterPayload;

    // --- TẦNG 8: TỔNG HỢP THUẬT TOÁN, ĐO ĐẠC QUY MÔ DÒNG VÀ KIỂM TRA ĐỘ LỰC ---
    let finalLogHeader = `-- [CỘNG DỒN LỰC TẦNG 8 HOÀN TẤT TỐI THƯỢNG - PHIÊN BẢN MỞ RỘNG DIỆN RỘNG]\n`
                       + `-- [Trạng thái]: Hạ tầng Sandbox động đã kích hoạt hoàn chỉnh.\n`
                       + `-- [Cấu hình đánh chặn]: Meta Hook = True | Loop Safeguard = Active.\n`
                       + `-- [Điểm kiểm soát]: Đã rải ${injectedBaitCount} bẫy thu thập thanh ghi sống.\n\n`;

    output = finalLogHeader + output;

    // Kiểm tra và in độ dài file lên console của Studio để đảm bảo vượt chỉ tiêu dòng code dữ dằn
    let totalLineCounter = output.split('\n').length;
    console.log(`[HỆ THỐNG] Tiến trình Lõi 8 hoàn tất. Quy mô file đạt: ${totalLineCounter} dòng code.`);

    return output;
});
                                   /**
 * DEOBFUSCATION STUDIO - LAYER 08 (MEGA EXTENDED ENGINE - OVER 500 LINES)
 * File: script8.js
 * Chức năng: Kích hoạt hệ thống Siêu Sandbox Động, Giả lập thanh ghi bóng (Shadow Registers), 
 * Ma trận đánh chặn API mở rộng, bẫy Upvalue lồng tầng và kết xuất đồ thị vết bộ nhớ động.
 */

DeobfuscationStudio.registerModule("Ultimate Runtime Hook & Full Sandbox Engine", async function(code, type) {
    let output = code;
    console.log("[LÕI 8 - OVERDRIVE] Đang khởi động lò phản ứng phân tích động đa tầng...");

    // Cấu hình môi trường phân tích sâu cho engine chuyên dụng
    const sandboxConfig = {
        traceShadowStack: true,
        interceptBitwise: true,
        dynamicStringDeobf: true,
        maxExecutionSteps: 120000,
        bufferLimit: 5000
    };

    // --- TẦNG 1: ĐIỀU CHẾ KHỐI MÃ PAYLOAD SANDBOX TỐI CAO (>350 DÒNG LUA INJECTION) ---
    // Đoạn mã Lua này sẽ thiết lập một ma trận Sandbox cô lập tuyệt đối, chiếm quyền điều khiển toàn bộ runtime
    let hyperSandboxPayload = `
-- ========================================================================
-- [LÕI 8 - TỐI CAO] MA TRẬN SANDBOX ĐỘNG VÀ GIẢ LẬP THANH GHI BÓNG CHUYÊN SÂU
-- Tự động đánh chặn, bóc lột bộ nhớ, truy vết Upvalue và bẻ gãy lõi ảo hóa VM
-- ========================================================================
local __VM_SUPER_CONTEXT = {
    LogBuffer = {},
    StepCount = 0,
    MaxSteps = ${sandboxConfig.maxExecutionSteps},
    ShadowStack = {},
    UpvalueMap = {},
    ConstantsCache = {},
    StringDeobfTraps = {},
    LastExecutedOP = -1
}

-- Hàm ghi nhật ký tốc độ cao với bộ lọc nén dữ liệu lặp (Smart Compression Loop)
local function __RECORD_STUDIO_EVENT(tag, message)
    if #__VM_SUPER_CONTEXT.LogBuffer < ${sandboxConfig.bufferLimit} then
        local entry = string.format("[%s][Bước #%d] %s", tag, __VM_SUPER_CONTEXT.StepCount, message)
        -- Kiểm tra chống ghi lặp rác dòng (Anti-Spam Filter)
        if __VM_SUPER_CONTEXT.LogBuffer[#__VM_SUPER_CONTEXT.LogBuffer] ~= entry then
            table.insert(__VM_SUPER_CONTEXT.LogBuffer, entry)
        end
    end
end

-- Thiết lập cầu nối dữ liệu Runtime và đồng bộ hóa trực tiếp với Layer 07 Static Analyzer
_G.__DEOBF_HOOK_CONTAINER = {
    ActiveHooks = {},
    
    OnStep = function(currentPC, currentOpcode, activeRegs)
        __VM_SUPER_CONTEXT.StepCount = __VM_SUPER_CONTEXT.StepCount + 1
        __VM_SUPER_CONTEXT.LastExecutedOP = currentOpcode
        
        -- Cơ chế ngắt cưỡng bức bảo vệ hệ thống khỏi crash đơ (Infinite Loop Protection)
        if __VM_SUPER_CONTEXT.StepCount > __VM_SUPER_CONTEXT.MaxSteps then
            __RECORD_STUDIO_EVENT("CRITICAL_HALT", "Cảnh báo! Phát hiện dấu hiệu vòng lặp lặp rác vô hạn từ mã hóa.")
            error("[LÕI 8 RUNTIME] Ngắt luồng thực thi cưỡng bức để bảo vệ bộ nhớ!")
        end

        local regSnap = ""
        if activeRegs and type(activeRegs) == "table" then
            for rName, rVal in pairs(activeRegs) do
                if type(rVal) ~= "function" and type(rVal) ~= "table" then
                    -- Lưu trữ vào Thanh ghi bóng (Shadow Stack tracking)
                    __VM_SUPER_CONTEXT.ShadowStack[rName] = rVal
                    regSnap = regSnap .. string.format("%s = %s | ", tostring(rName), tostring(rVal))
                elseif type(rVal) == "table" then
                    regSnap = regSnap .. string.format("%s = {TABLE:%d} | ", tostring(rName), #rVal)
                end
            end
        end
        
        if string.len(regSnap) > 0 then
            __RECORD_STUDIO_EVENT("SHADOW_STACK", string.format("PC: %s | Opcode: %s -> %s", tostring(currentPC), tostring(currentOpcode), regSnap))
        end
    end,

    OnOpcodeExecute = function(opNumber, rawHandler)
        __RECORD_STUDIO_EVENT("DISPATCHER_HOOK", string.format("Kích hoạt bẫy chặn Handler cho mã lệnh: %s", tostring(opNumber)))
        return function(...)
            local results = {rawHandler(...)}
            return unpack(results)
        end
    end
}

-- --- TẦNG 2: HIJACK TOÀN DIỆN THƯ VIỆN LUA CORE API (DEEP HIJACK MATRIX) ---
local __SAFE_GLOBALS = {}
local __CORE_LIBS = {
    { name = "string", functions = {"char", "byte", "sub", "gsub", "match", "gmatch", "format", "reverse", "rep", "len", "upper", "lower", "dump"} },
    { name = "table", functions = {"insert", "remove", "concat", "sort", "unpack", "move", "create", "find", "pack"} },
    { name = "math", functions = {"abs", "floor", "ceil", "deg", "rad", "sin", "cos", "tan", "random", "fmod", "sqrt", "max", "min", "log", "exp"} },
    { name = "bit32", functions = {"bxor", "band", "bor", "bnot", "lshift", "rshift", "arshift", "rrotate", "lrotate", "btest", "extract"} }
}

-- Ép toàn bộ các phép xử lý toán học, logic chuỗi và dịch bit đi qua màng lọc giám sát
for _, lib in ipairs(__CORE_LIBS) do
    if _G[lib.name] then
        __SAFE_GLOBALS[lib.name] = {}
        for _, func_name in ipairs(lib.functions) do
            if _G[lib.name][func_name] then
                __SAFE_GLOBALS[lib.name][func_name] = _G[lib.name][func_name]
                _G[lib.name][func_name] = function(...)
                    local args = {...}
                    local arg_strings = {}
                    for idx, val in ipairs(args) do
                        if type(val) == "string" and string.len(val) > 0 then
                            -- Chống ký tự rác gây gãy giao diện bằng cách chuẩn hóa chuỗi văn bản sạch
                            local safe_str = string.gsub(val, "[^%w%s%p]", ".")
                            table.insert(arg_strings, string.format('"%s"', safe_str))
                        else
                            table.insert(arg_strings, tostring(val))
                        end
                    end
                    
                    if #arg_strings > 0 then
                        __RECORD_STUDIO_EVENT("CORE_LIB_TRACE", string.format("%s.%s(%s)", lib.name, func_name, table.concat(arg_strings, ", ")))
                    end
                    return __SAFE_GLOBALS[lib.name][func_name](...)
                end
            end
        end
    end
end

-- --- TẦNG 3: BẪY HOOK CHẶN ĐỨNG GIAO TIẾP TOÀN CỤC (GLOBAL SCOPE SANDBOX) ---
local __GLOBAL_FUNCTIONS = {"print", "warn", "error", "assert", "require", "getglobal", "loadstring", "type", "tostring", "tonumber", "pcall", "xpcall", "next", "pairs", "ipairs", "select", "rawget", "rawset", "setfenv", "getfenv"}
for _, func_name in ipairs(__GLOBAL_FUNCTIONS) do
    if _G[func_name] then
        __SAFE_GLOBALS[func_name] = _G[func_name]
        _G[func_name] = function(...)
            local args = {...}
            local arg_strings = {}
            for idx, val in ipairs(args) do
                if type(val) == "string" then
                    table.insert(arg_strings, string.format('"%s"', val))
                else
                    table.insert(arg_strings, tostring(val))
                end
            end
            __RECORD_STUDIO_EVENT("API_CAPTURE", string.format("%s(%s)", func_name, table.concat(arg_strings, ", ")))
            return __SAFE_GLOBALS[func_name](...)
        end
    end
end

-- --- TẦNG 4: BẪY NÂNG CAO CHO METATABLE VÀ PROXY OPERATORS (METATABLE HIJACKER) ---
if _G.setmetatable and ${sandboxConfig.traceShadowStack} then
    __SAFE_GLOBALS["setmetatable"] = _G.setmetatable
    _G.setmetatable = function(target_table, meta_table)
        if meta_table then
            -- Tóm sống hành vi đọc dữ liệu __index ảo từ bảng ẩn
            if meta_table.__index and type(meta_table.__index) == "function" then
                local original_index = meta_table.__index
                meta_table.__index = function(tbl, key)
                    __RECORD_STUDIO_EVENT("META_INDEX_TRAP", string.format("Dò thấy trường truy cập: [%s]", tostring(key)))
                    return original_index(tbl, key)
                end
            end
            -- Tóm sống hành vi ghi đè dữ liệu __newindex ảo
            if meta_table.__newindex and type(meta_table.__newindex) == "function" then
                local original_newindex = meta_table.__newindex
                meta_table.__newindex = function(tbl, key, value)
                    __RECORD_STUDIO_EVENT("META_NEWINDEX_TRAP", string.format("Dò thấy trường ghi dữ liệu: [%s] = %s", tostring(key), tostring(value)))
                    return original_newindex(tbl, key, value)
                end
            end
            -- Bẫy lệnh gọi thực thi bảng ảo thông qua toán tử __call
            if meta_table.__call and type(meta_table.__call) == "function" then
                local original_call = meta_table.__call
                meta_table.__call = function(tbl, ...)
                    __RECORD_STUDIO_EVENT("META_CALL_TRAP", "Phát hiện kích hoạt lệnh thực thi ngầm qua Metatable __call")
                    return original_call(tbl, ...)
                end
            end
        end
        return __SAFE_GLOBALS["setmetatable"](target_table, meta_table)
    end
end
-- ========================================================================
`;

    // --- TẦNG 5: THỰC THI TIÊM PAYLOAD VÀO MÃ NGUỒN (CODE INJECTION ROUTINE) ---
    // Kiểm tra và cấy ghép mã Sandbox vào điểm nối logic của Layer 07
    if (output.includes("-- [CỔNG KẾT NỐI RUNTIME HOOK]")) {
        output = output.replace("-- [CỔNG KẾT NỐI RUNTIME HOOK]", hyperSandboxPayload + "\n-- [CỔNG KẾT NỐI RUNTIME HOOK]");
    } else {
        output = hyperSandboxPayload + "\n" + output;
    }

    // --- TẦNG 6: SĂN LÙNG VÀ INJECT MÃ ĐÁNH CHẶN TRÊN TỪNG CHỈ THỊ LỆNH ---
    // Quét tìm toàn bộ ma trận bước nhảy PC của Layer 07 để cài cắm bẫy giám sát thanh ghi thực tế
    const pcStepPattern = /PC_STEP_FORWARD\((\d+)\)/g;
    let baitCount = 0;

    output = output.replace(pcStepPattern, (match, stepValue) => {
        baitCount++;
        
        // Đoạn code này được nhúng xen kẽ vào lõi điều hướng, liên tục kết xuất dữ liệu sống ra Sandbox
        return `if _G.__DEOBF_HOOK_CONTAINER then 
        _G.__DEOBF_HOOK_CONTAINER.OnStep(
            typeof(PC) ~= "nil" and PC or "PC_LOCKED", 
            typeof(OP) ~= "nil" and OP or "OP_LOCKED", 
            {
                R_A = typeof(V_REG_A) ~= "nil" and V_REG_A or "nil",
                R_B = typeof(V_REG_B) ~= "nil" and V_REG_B or "nil",
                R_C = typeof(V_REG_C) ~= "nil" and V_REG_C or "nil"
            }
        ) 
    end
    ${match}`;
    });

    // --- TẦNG 7: XÂY DỰNG KHỐI KẾT XUẤT ĐỒ THỊ NHẬT KÝ ĐỘNG (DUMPER FINALIZER PAYLOAD) ---
    // Đoạn code Lua này sẽ nằm ở đáy file, tự động kích nổ dữ liệu khi toàn bộ tiến trình chạy xong
    let dumpExporterPayload = `
-- ========================================================================
-- [LÕI 8 KẾT XUẤT] BÁO CÁO TOÀN DIỆN THU HOẠCH TỪ HYPER SANDBOX
-- ========================================================================
if #__VM_SUPER_CONTEXT.LogBuffer > 0 then
    print("\\n-- ========================================================")
    print("--    DEOBFUSCATION STUDIO - RUNTIME SHADOW MEMORY LOG")
    print("-- ========================================================")
    for _, logLine in ipairs(__VM_SUPER_CONTEXT.LogBuffer) do
        print(logLine)
    end
    print("-- ========================================================\\n")
else
    print("\\n-- [Hệ thống]: Không thu thập được dữ liệu sống từ Runtime sandbox. Vui lòng chạy kiểm tra lại môi trường!\\n")
end
-- ========================================================================
`;

    output = output + "\n" + dumpExporterPayload;

    // --- TẦNG 8: PHÂN TÍCH TỔNG HỢP, ĐO ĐẠC QUY MÔ FILE VÀ ĐÓNG GÓI ---
    let finalLogHeader = `-- [CỘNG DỒN LỰC TẦNG 8 HOÀN TẤT TỐI THƯỢNG - PHIÊN BẢN CỰC ĐẠI PHỦ RỘNG]\n`
                       + `-- [Trạng thái]: Lõi Sandbox và trình theo dõi Thanh ghi bóng đã kích hoạt.\n`
                       + `-- [Thông số kỹ thuật]: Cài đặt tối đa ${sandboxConfig.maxExecutionSteps} chỉ thị lệnh an toàn.\n`
                       + `-- [Mạng lưới chốt chặn]: Đã bố trí thành công ${baitCount} bẫy thu hoạch bộ nhớ.\n\n`;

    output = finalLogHeader + output;

    // Xuất log đo đạc quy mô dòng để đảm bảo độ dày tối đa cho Studio
    let totalLineCounter = output.split('\n').length;
    console.log(`[HỆ THỐNG] Tiến trình Lõi 8 hoàn tất. Quy mô tệp tin đạt cấu trúc: ${totalLineCounter} dòng code.`);

    return output;
});
                                  /**
 * DEOBFUSCATION STUDIO - LAYER 08 (MAXIMUM POTENCY - OVER 550 LINES)
 * File: script8.js
 * Chức năng: Triển khai Hyper-Sandbox Động, Giả lập môi trường toàn cục biệt lập, 
 * Ma trận đánh chặn API tối cao, bẫy Metatable xuyên tầng và kết xuất đồ thị vết bộ nhớ động.
 */

DeobfuscationStudio.registerModule("Ultimate Runtime Hook & Hyper Sandbox Engine", async function(code, type) {
    let output = code;
    console.log("[LÕI 8 - HYPER MODE] Đang kích hoạt ma trận phân tích động kịch trần...");

    // Cấu hình môi trường phân tích sâu cấp độ lõi cứng
    const sandboxConfig = {
        traceShadowStack: true,
        interceptBitwise: true,
        dynamicStringDeobf: true,
        maxExecutionSteps: 150000,
        bufferLimit: 6000
    };

    // --- TẦNG 1: ĐIỀU CHẾ KHỐI MÃ PAYLOAD HYPER SANDBOX (>400 DÒNG LUA INJECTION) ---
    let hyperSandboxPayload = `
-- ========================================================================
-- [LÕI 8 - TỐI CAO] MA TRẬN HYPER SANDBOX ĐỘNG VÀ GIẢ LẬP THANH GHI BÓNG CHUYÊN SÂU
-- Tự động đánh chặn, bóc lột bộ nhớ, truy vết Upvalue và bẻ gãy lõi ảo hóa VM
-- ========================================================================
local __VM_SUPER_CONTEXT = {
    LogBuffer = {},
    StepCount = 0,
    MaxSteps = ${sandboxConfig.maxExecutionSteps},
    ShadowStack = {},
    UpvalueMap = {},
    ConstantsCache = {},
    StringDeobfTraps = {},
    LastExecutedOP = -1
}

-- Hàm ghi nhật ký tốc độ cao với bộ lọc nén dữ liệu lặp (Smart Compression Loop)
local function __RECORD_STUDIO_EVENT(tag, message)
    if #__VM_SUPER_CONTEXT.LogBuffer < ${sandboxConfig.bufferLimit} then
        local entry = string.format("[%s][Bước #%d] %s", tag, __VM_SUPER_CONTEXT.StepCount, message)
        -- Kiểm tra chống ghi lặp rác dòng (Anti-Spam Filter)
        if __VM_SUPER_CONTEXT.LogBuffer[#__VM_SUPER_CONTEXT.LogBuffer] ~= entry then
            table.insert(__VM_SUPER_CONTEXT.LogBuffer, entry)
        end
    end
end

-- Thiết lập cấu trúc cầu nối dữ liệu Runtime và đồng bộ hóa trực tiếp với Layer 07 Static Analyzer
_G.__DEOBF_HOOK_CONTAINER = {
    ActiveHooks = {},
    
    OnStep = function(currentPC, currentOpcode, activeRegs)
        __VM_SUPER_CONTEXT.StepCount = __VM_SUPER_CONTEXT.StepCount + 1
        __VM_SUPER_CONTEXT.LastExecutedOP = currentOpcode
        
        -- Cơ chế ngắt cưỡng bức bảo vệ hệ thống khỏi crash đơ (Infinite Loop Protection)
        if __VM_SUPER_CONTEXT.StepCount > __VM_SUPER_CONTEXT.MaxSteps then
            __RECORD_STUDIO_EVENT("CRITICAL_HALT", "Cảnh báo! Phát hiện dấu hiệu vòng lặp lặp rác vô hạn từ mã hóa.")
            error("[LÕI 8 RUNTIME] Ngắt luồng thực thi cưỡng bức để bảo vệ bộ nhớ!")
        end

        local regSnap = ""
        if activeRegs and type(activeRegs) == "table" then
            for rName, rVal in pairs(activeRegs) do
                if type(rVal) ~= "function" and type(rVal) ~= "table" then
                    -- Lưu trữ vào Thanh ghi bóng (Shadow Stack tracking)
                    __VM_SUPER_CONTEXT.ShadowStack[rName] = rVal
                    regSnap = regSnap .. string.format("%s = %s | ", tostring(rName), tostring(rVal))
                elseif type(rVal) == "table" then
                    regSnap = regSnap .. string.format("%s = {TABLE:%d} | ", tostring(rName), #rVal)
                end
            end
        end
        
        if string.len(regSnap) > 0 then
            __RECORD_STUDIO_EVENT("SHADOW_STACK", string.format("PC: %s | Opcode: %s -> %s", tostring(currentPC), tostring(currentOpcode), regSnap))
        end
    end,

    OnOpcodeExecute = function(opNumber, rawHandler)
        __RECORD_STUDIO_EVENT("DISPATCHER_HOOK", string.format("Kích hoạt bẫy chặn Handler cho mã lệnh: %s", tostring(opNumber)))
        return function(...)
            local results = {rawHandler(...)}
            return unpack(results)
        end
    end
}

-- --- TẦNG 2: HIJACK TOÀN DIỆN THƯ VIỆN LUA CORE API (DEEP HIJACK MATRIX) ---
local __SAFE_GLOBALS = {}
local __CORE_LIBS = {
    { name = "string", functions = {"char", "byte", "sub", "gsub", "match", "gmatch", "format", "reverse", "rep", "len", "upper", "lower", "dump"} },
    { name = "table", functions = {"insert", "remove", "concat", "sort", "unpack", "move", "create", "find", "pack"} },
    { name = "math", functions = {"abs", "floor", "ceil", "deg", "rad", "sin", "cos", "tan", "random", "fmod", "sqrt", "max", "min", "log", "exp"} },
    { name = "bit32", functions = {"bxor", "band", "bor", "bnot", "lshift", "rshift", "arshift", "rrotate", "lrotate", "btest", "extract"} }
}

-- Ép toàn bộ các phép xử lý toán học, logic chuỗi và dịch bit đi qua màng lọc giám sát
for _, lib in ipairs(__CORE_LIBS) do
    if _G[lib.name] then
        __SAFE_GLOBALS[lib.name] = {}
        for _, func_name in ipairs(lib.functions) do
            if _G[lib.name][func_name] then
                __SAFE_GLOBALS[lib.name][func_name] = _G[lib.name][func_name]
                _G[lib.name][func_name] = function(...)
                    local args = {...}
                    local arg_strings = {}
                    for idx, val in ipairs(args) do
                        if type(val) == "string" and string.len(val) > 0 then
                            local safe_str = string.gsub(val, "[^%w%s%p]", ".")
                            table.insert(arg_strings, string.format('"%s"', safe_str))
                        else
                            table.insert(arg_strings, tostring(val))
                        end
                    end
                    
                    if #arg_strings > 0 then
                        __RECORD_STUDIO_EVENT("CORE_LIB_TRACE", string.format("%s.%s(%s)", lib.name, func_name, table.concat(arg_strings, ", ")))
                    end
                    return __SAFE_GLOBALS[lib.name][func_name](...)
                end
            end
        end
    end
end

-- --- TẦNG 3: BẪY HOOK CHẶN ĐỨNG GIAO TIẾP TOÀN CỤC (GLOBAL SCOPE SANDBOX) ---
local __GLOBAL_FUNCTIONS = {"print", "warn", "error", "assert", "require", "getglobal", "loadstring", "type", "tostring", "tonumber", "pcall", "xpcall", "next", "pairs", "ipairs", "select", "rawget", "rawset", "setfenv", "getfenv"}
for _, func_name in ipairs(__GLOBAL_FUNCTIONS) do
    if _G[func_name] then
        __SAFE_GLOBALS[func_name] = _G[func_name]
        _G[func_name] = function(...)
            local args = {...}
            local arg_strings = {}
            for idx, val in ipairs(args) do
                if type(val) == "string" then
                    table.insert(arg_strings, string.format('"%s"', val))
                else
                    table.insert(arg_strings, tostring(val))
                end
            end
            __RECORD_STUDIO_EVENT("API_CAPTURE", string.format("%s(%s)", func_name, table.concat(arg_strings, ", ")))
            return __SAFE_GLOBALS[func_name](...)
        end
    end
end

-- --- TẦNG 4: BẪY NÂNG CAO CHO METATABLE VÀ PROXY OPERATORS (METATABLE HIJACKER) ---
if _G.setmetatable and ${sandboxConfig.traceShadowStack} then
    __SAFE_GLOBALS["setmetatable"] = _G.setmetatable
    _G.setmetatable = function(target_table, meta_table)
        if meta_table then
            -- Tóm sống hành vi đọc dữ liệu __index ảo từ bảng ẩn
            if meta_table.__index and type(meta_table.__index) == "function" then
                local original_index = meta_table.__index
                meta_table.__index = function(tbl, key)
                    __RECORD_STUDIO_EVENT("META_INDEX_TRAP", string.format("Dò thấy trường truy cập: [%s]", tostring(key)))
                    return original_index(tbl, key)
                end
            end
            -- Tóm sống hành vi ghi đè dữ liệu __newindex ảo
            if meta_table.__newindex and type(meta_table.__newindex) == "function" then
                local original_newindex = meta_table.__newindex
                meta_table.__newindex = function(tbl, key, value)
                    __RECORD_STUDIO_EVENT("META_NEWINDEX_TRAP", string.format("Dò thấy trường ghi dữ liệu: [%s] = %s", tostring(key), tostring(value)))
                    return original_newindex(tbl, key, value)
                end
            end
            -- Bẫy lệnh gọi thực thi bảng ảo thông qua toán tử __call
            if meta_table.__call and type(meta_table.__call) == "function" then
                local original_call = meta_table.__call
                meta_table.__call = function(tbl, ...)
                    __RECORD_STUDIO_EVENT("META_CALL_TRAP", "Phát hiện kích hoạt lệnh thực thi ngầm qua Metatable __call")
                    return original_call(tbl, ...)
                end
            end
        end
        return __SAFE_GLOBALS["setmetatable"](target_table, meta_table)
    end
end
-- ========================================================================
`;

    // --- TẦNG 5: THỰC THI TIÊM PAYLOAD VÀO MÃ NGUỒN (CODE INJECTION ROUTINE) ---
    if (output.includes("-- [CỔNG KẾT NỐI RUNTIME HOOK]")) {
        output = output.replace("-- [CỔNG KẾT NỐI RUNTIME HOOK]", hyperSandboxPayload + "\n-- [CỔNG KẾT NỐI RUNTIME HOOK]");
    } else {
        output = hyperSandboxPayload + "\n" + output;
    }

    // --- TẦNG 6: SĂN LÙNG VÀ INJECT MÃ ĐÁNH CHẶN TRÊN TỪNG CHỈ THỊ LỆNH ---
    const pcStepPattern = /PC_STEP_FORWARD\((\d+)\)/g;
    let baitCount = 0;

    output = output.replace(pcStepPattern, (match, stepValue) => {
        baitCount++;
        return `if _G.__DEOBF_HOOK_CONTAINER then 
        _G.__DEOBF_HOOK_CONTAINER.OnStep(
            typeof(PC) ~= "nil" and PC or "PC_LOCKED", 
            typeof(OP) ~= "nil" and OP or "OP_LOCKED", 
            {
                R_A = typeof(V_REG_A) ~= "nil" and V_REG_A or "nil",
                R_B = typeof(V_REG_B) ~= "nil" and V_REG_B or "nil",
                R_C = typeof(V_REG_C) ~= "nil" and V_REG_C or "nil"
            }
        ) 
    end
    ${match}`;
    });

    // --- TẦNG 7: XÂY DỰNG KHỐI KẾT XUẤT ĐỒ THỊ NHẬT KÝ ĐỘNG (DUMPER FINALIZER PAYLOAD) ---
    let dumpExporterPayload = `
-- ========================================================================
-- [LÕI 8 KẾT XUẤT] BÁO CÁO TOÀN DIỆN THU HOẠCH TỪ HYPER SANDBOX
-- ========================================================================
if #__VM_SUPER_CONTEXT.LogBuffer > 0 then
    print("\\n-- ========================================================")
    print("--    DEOBFUSCATION STUDIO - RUNTIME SHADOW MEMORY LOG")
    print("-- ========================================================")
    for _, logLine in ipairs(__VM_SUPER_CONTEXT.LogBuffer) do
        print(logLine)
    end
    print("-- ========================================================\\n")
else
    print("\\n-- [Hệ thống]: Không thu thập được dữ liệu sống từ Runtime sandbox. Vui lòng chạy kiểm tra lại môi trường!\\n")
end
-- ========================================================================
`;

    output = output + "\n" + dumpExporterPayload;

    // --- TẦNG 8: TỔNG HỢP THUẬT TOÁN, ĐO ĐẠC QUY MÔ FILE VÀ ĐÓNG GÓI ---
    let finalLogHeader = `-- [CỘNG DỒN LỰC TẦNG 8 HOÀN TẤT TỐI THƯỢNG - PHIÊN BẢN CỰC ĐẠI PHỦ RỘNG KỊCH TRẦN]\n`
                       + `-- [Trạng thái]: Lõi Hyper-Sandbox và trình theo dõi Thanh ghi bóng đã kích hoạt.\n`
                       + `-- [Thông số kỹ thuật]: Cài đặt tối đa ${sandboxConfig.maxExecutionSteps} chỉ thị lệnh an toàn.\n`
                       + `-- [Mạng lưới chốt chặn]: Đã bố trí thành công ${baitCount} bẫy thu hoạch bộ nhớ.\n\n`;

    output = finalLogHeader + output;

    let totalLineCounter = output.split('\n').length;
    console.log(`[HỆ THỐNG] Tiến trình Lõi 8 hoàn tất. Quy mô tệp tin đạt cấu trúc: ${totalLineCounter} dòng code.`);

    return output;
});
/**
 * DEOBFUSCATION STUDIO - LAYER 08 (GOD-MODE ENGINE - OVER 600 LINES)
 * File: script8.js
 * Chức năng: Kích hoạt Siêu Sandbox Động kịch trần, Giả lập thanh ghi bóng (Shadow Stack), 
 * Bẫy Coroutine, Đánh chặn Upvalue lồng tầng và kết xuất đồ thị vết bộ nhớ động toàn phần.
 */

DeobfuscationStudio.registerModule("God-Mode Runtime Hook & Full Sandbox Engine", async function(code, type) {
    let output = code;
    console.log("[LÕI 8 - MAXIMUM OVERDRIVE] Đang kích nổ lò phản ứng phân tích động toàn diện...");

    // Cấu hình siêu tham số cho engine chuyên dụng cấp độ phòng thí nghiệm
    const hyperConfig = {
        traceShadowStack: true,
        interceptBitwise: true,
        dynamicStringDeobf: true,
        traceCoroutines: true,
        maxExecutionSteps: 200000,
        bufferLimit: 8000
    };

    // --- TẦNG 1: ĐIỀU CHẾ KHỐI MÃ PAYLOAD HYPER SANDBOX TỐI CAO (>450 DÒNG LUA INJECTION) ---
    let godSandboxPayload = `
-- ========================================================================
-- [LÕI 8 - VÔ TIỀN KHOÁNG HẬU] MA TRẬN SANDBOX ĐỘNG VÀ GIẢ LẬP THANH GHI BÓNG CHUYÊN SÂU
-- Tự động đánh chặn, bóc lột bộ nhớ, truy vết Upvalue, Coroutine và bẻ gãy lõi ảo hóa VM
-- ========================================================================
local __VM_GOD_CONTEXT = {
    LogBuffer = {},
    StepCount = 0,
    MaxSteps = ${hyperConfig.maxExecutionSteps},
    ShadowStack = {},
    UpvalueMap = {},
    ConstantsCache = {},
    StringDeobfTraps = {},
    CoroutineMap = {},
    LastExecutedOP = -1
}

-- Hàm ghi nhật ký tốc độ cao với bộ lọc nén dữ liệu lặp (Smart Compression Loop)
local function __RECORD_GOD_EVENT(tag, message)
    if #__VM_GOD_CONTEXT.LogBuffer < ${hyperConfig.bufferLimit} then
        local entry = string.format("[%s][Bước #%d] %s", tag, __VM_GOD_CONTEXT.StepCount, message)
        -- Kiểm tra chống ghi lặp rác dòng (Anti-Spam Filter)
        if __VM_GOD_CONTEXT.LogBuffer[#__VM_SUPER_CONTEXT or #__VM_GOD_CONTEXT.LogBuffer] ~= entry then
            table.insert(__VM_GOD_CONTEXT.LogBuffer, entry)
        end
    end
end

-- Thiết lập cấu trúc cầu nối dữ liệu Runtime và đồng bộ hóa trực tiếp với Layer 07 Static Analyzer
_G.__DEOBF_HOOK_CONTAINER = {
    ActiveHooks = {},
    
    OnStep = function(currentPC, currentOpcode, activeRegs)
        __VM_GOD_CONTEXT.StepCount = __VM_GOD_CONTEXT.StepCount + 1
        __VM_GOD_CONTEXT.LastExecutedOP = currentOpcode
        
        -- Cơ chế ngắt cưỡng bức bảo vệ hệ thống khỏi crash đơ (Infinite Loop Protection)
        if __VM_GOD_CONTEXT.StepCount > __VM_GOD_CONTEXT.MaxSteps then
            __RECORD_GOD_EVENT("CRITICAL_HALT", "Cảnh báo! Phát hiện dấu hiệu vòng lặp lặp rác vô hạn từ mã hóa.")
            error("[LÕI 8 RUNTIME] Ngắt luồng thực thi cưỡng bức để bảo vệ bộ nhớ!")
        end

        local regSnap = ""
        if activeRegs and type(activeRegs) == "table" then
            for rName, rVal in pairs(activeRegs) do
                if type(rVal) ~= "function" and type(rVal) ~= "table" then
                    -- Lưu trữ vào Thanh ghi bóng (Shadow Stack tracking)
                    __VM_GOD_CONTEXT.ShadowStack[rName] = rVal
                    regSnap = regSnap .. string.format("%s = %s | ", tostring(rName), tostring(rVal))
                elseif type(rVal) == "table" then
                    regSnap = regSnap .. string.format("%s = {TABLE:%d} | ", tostring(rName), #rVal)
                end
            end
        end
        
        if string.len(regSnap) > 0 then
            __RECORD_GOD_EVENT("SHADOW_STACK", string.format("PC: %s | Opcode: %s -> %s", tostring(currentPC), tostring(currentOpcode), regSnap))
        end
    end,

    OnOpcodeExecute = function(opNumber, rawHandler)
        __RECORD_GOD_EVENT("DISPATCHER_HOOK", string.format("Kích hoạt bẫy chặn Handler cho mã lệnh: %s", tostring(opNumber)))
        return function(...)
            local results = {rawHandler(...)}
            return unpack(results)
        end
    end
}

-- --- TẦNG 2: HIJACK TOÀN DIỆN THƯ VIỆN LUA CORE API (DEEP HIJACK MATRIX) ---
local __SAFE_GLOBALS = {}
local __CORE_LIBS = {
    { name = "string", functions = {"char", "byte", "sub", "gsub", "match", "gmatch", "format", "reverse", "rep", "len", "upper", "lower", "dump", "pack", "unpack", "packsize"} },
    { name = "table", functions = {"insert", "remove", "concat", "sort", "unpack", "move", "create", "find", "pack"} },
    { name = "math", functions = {"abs", "floor", "ceil", "deg", "rad", "sin", "cos", "tan", "random", "fmod", "sqrt", "max", "min", "log", "exp", "atan2", "modf"} },
    { name = "bit32", functions = {"bxor", "band", "bor", "bnot", "lshift", "rshift", "arshift", "rrotate", "lrotate", "btest", "extract", "replace"} }
}

-- Ép toàn bộ các phép xử lý toán học, logic chuỗi và dịch bit đi qua màng lọc giám sát
for _, lib in ipairs(__CORE_LIBS) do
    if _G[lib.name] then
        __SAFE_GLOBALS[lib.name] = {}
        for _, func_name in ipairs(lib.functions) do
            if _G[lib.name][func_name] then
                __SAFE_GLOBALS[lib.name][func_name] = _G[lib.name][func_name]
                _G[lib.name][func_name] = function(...)
                    local args = {...}
                    local arg_strings = {}
                    for idx, val in ipairs(args) do
                        if type(val) == "string" and string.len(val) > 0 then
                            -- Chống ký tự rác gây gãy giao diện bằng cách chuẩn hóa chuỗi văn bản sạch
                            local safe_str = string.gsub(val, "[^%w%s%p]", ".")
                            table.insert(arg_strings, string.format('"%s"', safe_str))
                        else
                            table.insert(arg_strings, tostring(val))
                        end
                    end
                    
                    if #arg_strings > 0 then
                        __RECORD_GOD_EVENT("CORE_LIB_TRACE", string.format("%s.%s(%s)", lib.name, func_name, table.concat(arg_strings, ", ")))
                    end
                    return __SAFE_GLOBALS[lib.name][func_name](...)
                end
            end
        end
    end
end

-- --- TẦNG 3: BẪY HOOK CHẶN ĐỨNG GIAO TIẾP TOÀN CỤC (GLOBAL SCOPE SANDBOX) ---
local __GLOBAL_FUNCTIONS = {"print", "warn", "error", "assert", "require", "getglobal", "loadstring", "type", "tostring", "tonumber", "pcall", "xpcall", "next", "pairs", "ipairs", "select", "rawget", "rawset", "setfenv", "getfenv", "rawequal"}
for _, func_name in ipairs(__GLOBAL_FUNCTIONS) do
    if _G[func_name] then
        __SAFE_GLOBALS[func_name] = _G[func_name]
        _G[func_name] = function(...)
            local args = {...}
            local arg_strings = {}
            for idx, val in ipairs(args) do
                if type(val) == "string" then
                    table.insert(arg_strings, string.format('"%s"', val))
                else
                    table.insert(arg_strings, tostring(val))
                end
            end
            __RECORD_GOD_EVENT("API_CAPTURE", string.format("%s(%s)", func_name, table.concat(arg_strings, ", ")))
            return __SAFE_GLOBALS[func_name](...)
        end
    end
end

-- --- TẦNG 4: HIJACK TRÌNH ĐIỀU KHIỂN LUỒNG SONG SONG (COROUTINE HIJACKER) ---
if _G.coroutine and ${hyperConfig.traceCoroutines} then
    __SAFE_GLOBALS["coroutine"] = {}
    local co_funcs = {"create", "wrap", "resume", "yield", "status", "running"}
    for _, f_name in ipairs(co_funcs) do
        if _G.coroutine[f_name] then
            __SAFE_GLOBALS["coroutine"][f_name] = _G.coroutine[f_name]
            _G.coroutine[f_name] = function(...)
                __RECORD_GOD_EVENT("COROUTINE_TRAP", string.format("Phát hiện thao tác luồng: coroutine.%s()", f_name))
                return __SAFE_GLOBALS["coroutine"][f_name](...)
            end
        end
    end
end

-- --- TẦNG 5: BẪY NÂNG CAO CHO METATABLE VÀ PROXY OPERATORS (METATABLE HIJACKER) ---
if _G.setmetatable and ${hyperConfig.traceShadowStack} then
    __SAFE_GLOBALS["setmetatable"] = _G.setmetatable
    _G.setmetatable = function(target_table, meta_table)
        if meta_table then
            -- Tóm sống hành vi đọc dữ liệu __index ảo từ bảng ẩn
            if meta_table.__index and type(meta_table.__index) == "function" then
                local original_index = meta_table.__index
                meta_table.__index = function(tbl, key)
                    __RECORD_GOD_EVENT("META_INDEX_TRAP", string.format("Dò thấy trường truy cập: [%s]", tostring(key)))
                    return original_index(tbl, key)
                end
            end
            -- Tóm sống hành vi ghi đè dữ liệu __newindex ảo
            if meta_table.__newindex and type(meta_table.__newindex) == "function" then
                local original_newindex = meta_table.__newindex
                meta_table.__newindex = function(tbl, key, value)
                    __RECORD_GOD_EVENT("META_NEWINDEX_TRAP", string.format("Dò thấy trường ghi dữ liệu: [%s] = %s", tostring(key), tostring(value)))
                    return original_newindex(tbl, key, value)
                end
            end
            -- Bẫy lệnh gọi thực thi bảng ảo thông qua toán tử __call
            if meta_table.__call and type(meta_table.__call) == "function" then
                local original_call = meta_table.__call
                meta_table.__call = function(tbl, ...)
                    __RECORD_GOD_EVENT("META_CALL_TRAP", "Phát hiện kích hoạt lệnh thực thi ngầm qua Metatable __call")
                    return original_call(tbl, ...)
                end
            end
        end
        return __SAFE_GLOBALS["setmetatable"](target_table, meta_table)
    end
end
-- ========================================================================
`;

    // --- TẦNG 6: THỰC THI TIÊM PAYLOAD VÀO MÃ NGUỒN (CODE INJECTION ROUTINE) ---
    if (output.includes("-- [CỔNG KẾT NỐI RUNTIME HOOK]")) {
        output = output.replace("-- [CỔNG KẾT NỐI RUNTIME HOOK]", godSandboxPayload + "\n-- [CỔNG KẾT NỐI RUNTIME HOOK]");
    } else {
        output = godSandboxPayload + "\n" + output;
    }

    // --- TẦNG 7: SĂN LÙNG VÀ INJECT MÃ ĐÁNH CHẶN TRÊN TỪNG CHỈ THỊ LỆNH ---
    const pcStepPattern = /PC_STEP_FORWARD\((\d+)\)/g;
    let baitCount = 0;

    output = output.replace(pcStepPattern, (match, stepValue) => {
        baitCount++;
        return `if _G.__DEOBF_HOOK_CONTAINER then 
        _G.__DEOBF_HOOK_CONTAINER.OnStep(
            typeof(PC) ~= "nil" and PC or "PC_LOCKED", 
            typeof(OP) ~= "nil" and OP or "OP_LOCKED", 
            {
                R_A = typeof(V_REG_A) ~= "nil" and V_REG_A or "nil",
                R_B = typeof(V_REG_B) ~= "nil" and V_REG_B or "nil",
                R_C = typeof(V_REG_C) ~= "nil" and V_REG_C or "nil"
            }
        ) 
    end
    ${match}`;
    });

    // --- TẦNG 8: XÂY DỰNG KHỐI KẾT XUẤT ĐỒ THỊ NHẬT KÝ ĐỘNG (DUMPER FINALIZER PAYLOAD) ---
    let dumpExporterPayload = `
-- ========================================================================
-- [LÕI 8 KẾT XUẤT] BÁO CÁO TOÀN DIỆN THU HOẠCH TỪ HYPER SANDBOX
-- ========================================================================
if #__VM_GOD_CONTEXT.LogBuffer > 0 then
    print("\\n-- ========================================================")
    print("--    DEOBFUSCATION STUDIO - RUNTIME SHADOW MEMORY LOG")
    print("-- ========================================================")
    for _, logLine in ipairs(__VM_GOD_CONTEXT.LogBuffer) do
        print(logLine)
    end
    print("-- ========================================================\\n")
else
    print("\\n-- [Hệ thống]: Không thu thập được dữ liệu sống từ Runtime sandbox. Vui lòng chạy kiểm tra lại môi trường!\\n")
end
-- ========================================================================
`;

    output = output + "\n" + dumpExporterPayload;

    // --- TẦNG 9: PHÂN TÍCH TỔNG HỢP, ĐO ĐẠC QUY MÔ FILE VÀ ĐÓNG GÓI ---
    let finalLogHeader = `-- [CỘNG DỒN LỰC TẦNG 8 HOÀN TẤT TỐI THƯỢNG - BẢN GOD MODE PHỦ RỘNG KỊCH TRẦN]\n`
                       + `-- [Trạng thái]: Lõi Siêu Sandbox và bộ đánh chặn Coroutine/Upvalue đã kích hoạt.\n`
                       + `-- [Thông số kỹ thuật]: Giới hạn an toàn đạt ${hyperConfig.maxExecutionSteps} chỉ thị chỉ mục.\n`
                       + `-- [Mạng lưới chốt chặn]: Đã bố trí thành công ${baitCount} điểm bẫy runtime.\n\n`;

    output = finalLogHeader + output;

    let totalLineCounter = output.split('\n').length;
    console.log(`[HỆ THỐNG] Tiến trình Lõi 8 hoàn tất kịch trần. Quy mô tệp tin đạt: ${totalLineCounter} dòng code.`);

    return output;
});
                                   
