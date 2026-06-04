"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const connection_1 = __importDefault(require("./config/connection"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const cashier_routes_1 = __importDefault(require("./routes/cashier.routes"));
const doctor_routes_1 = __importDefault(require("./routes/doctor.routes"));
const crm_routes_1 = __importDefault(require("./routes/crm.routes"));
const swagger_1 = require("./config/swagger");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: '*',
    methods: '*',
    allowedHeaders: '*',
    credentials: false
}));
app.use(express_1.default.json());
app.use('/api/auth', auth_routes_1.default);
app.use('/api/admin', admin_routes_1.default);
app.use('/api/cashier', cashier_routes_1.default);
app.use('/api/doctor', doctor_routes_1.default);
app.use('/api/crm', crm_routes_1.default);
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'healthy', timestamp: new Date() });
});
(0, swagger_1.setupSwagger)(app);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const client = yield connection_1.default.connect();
        client.release();
        console.log(`Server is running on port ${PORT}`);
    }
    catch (error) {
        console.error('Failed to connect to the database:', error);
    }
}));
