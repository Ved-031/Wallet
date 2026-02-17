export class ApiResponse<T = any> {
    success: boolean;
    message?: string;
    data?: T;
    meta?: any;

    constructor(options: { message?: string; data?: T; meta?: any, success?: boolean }) {
        this.success = true;
        this.message = options.message;
        this.data = options.data;
        this.meta = options.meta;
    }
}
