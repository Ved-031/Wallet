import swaggerJsdoc from 'swagger-jsdoc';

export const swaggerSpec = swaggerJsdoc({
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Wallet API',
            version: '1.0.0',
            description: 'Personal + Group Expense Tracking API',
        },
        servers: [
            {
                url: 'http://localhost:8080/api/v1',
                description: 'Development server',
            },
            {
                url: 'https://wallet-g00e.onrender.com/api/v1',
                description: 'Production server',
            },
        ],
        tags: [
            { name: 'Auth', description: 'Authentication & user sync' },
            { name: 'Dashboard', description: 'Dashboard & summary data' },
            { name: 'Transactions', description: 'Personal transactions' },
            { name: 'Groups', description: 'Group management' },
            { name: 'Expenses', description: 'Group expenses' },
            { name: 'Settlements', description: 'Payment settlements' },
            { name: 'Invites', description: 'Group invitations' },
            { name: 'Analytics', description: 'Graphs & analytics' },
            { name: 'Notifications', description: 'User notifications' },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                ApiResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean' },
                        data: { type: 'object' },
                        message: { type: 'string' },
                        meta: { type: 'object' },
                    },
                },
            },
        },
        security: [{ bearerAuth: [] }],
    },
    apis: ['src/modules/**/*.ts'],
});
