const CODE_SUCCESS = 200;
const CODE_CREATED = 201;
const CODE_ERROR = 500;
const CODE_NOT_FOUND = 404;
const CODE_BAD_REQUEST = 400;
const CODE_UNAUTHORIZED = 401;
const CODE_FORBIDDEN = 403;


export const Codes = {
    CODE_SUCCESS,
    CODE_CREATED,
    CODE_ERROR,
    CODE_NOT_FOUND,
    CODE_BAD_REQUEST,
    CODE_UNAUTHORIZED,
    CODE_FORBIDDEN,
}

interface BaseResponse {
    code: number;
    message: string;
}

interface SuccessResponse<T> extends BaseResponse {
    code: 200;
    message: "success";
    data: T;
}

interface ErrorResponse extends BaseResponse {
    code: number;
    message: string;
}

export type { BaseResponse, SuccessResponse, ErrorResponse };

export class Response {
    static success<T>(data: T): SuccessResponse<T> {
        return {
            code: CODE_SUCCESS,
            message: "success",
            data: data,
        };
    }

    static pureSuccess(message: string): BaseResponse {
        return {
            code: CODE_CREATED,
            message: message,
        };
    }

    static error(message: string): ErrorResponse {
        return {
            code: CODE_ERROR,
            message: message,
        };
    }

    static notFound(message: string): ErrorResponse {
        return {
            code: CODE_NOT_FOUND,
            message: message,
        };
    }

    static badRequest(message: string): ErrorResponse {
        return {
            code: CODE_BAD_REQUEST,
            message: message,
        };
    }


    static unauthorized(message: string): ErrorResponse {
        return {
            code: CODE_UNAUTHORIZED,
            message: message,
        };
    }

    static forbidden(message: string): ErrorResponse {
        return {
            code: CODE_FORBIDDEN,
            message: message,
        };
    }

    static internalServerError(message: string): ErrorResponse {
        return {
            code: CODE_ERROR,
            message: message,
        };
    }
}
