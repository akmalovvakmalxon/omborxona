import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options: swaggerJsdoc.Options = {
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
            { name: 'Cashier', description: 'Cashier operations' }
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

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Express) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    console.log('Swagger Docs available at http://localhost:5000/api-docs');
};
