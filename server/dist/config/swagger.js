"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSwagger = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Clinica API',
            version: '1.0.0',
            description: 'API documentation for the Clinica backend application',
        },
        tags: [
            { name: 'Auth', description: 'Authentication operations' },
            { name: 'Admin', description: 'Admin operations' },
            { name: 'Doctor', description: 'Doctor operations' },
            { name: 'Cashier', description: 'Cashier operations' },
            { name: 'CRM', description: 'Omborxona / CRM operations' }
        ],
        servers: [
            {
                url: '/',
                description: 'Current server (Auto-detected)',
            },
            {
                url: 'https://clinica-1-o4l9.onrender.com',
                description: 'Production server',
            },
            {
                url: 'http://localhost:5000',
                description: 'Local development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ['./routes/*.ts', './dist/routes/*.js', './server/routes/*.ts', './server/dist/routes/*.js'], // Flexible paths for different environments
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
const setupSwagger = (app) => {
    app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
    console.log('Swagger Docs available at http://localhost:5000/api-docs');
};
exports.setupSwagger = setupSwagger;
