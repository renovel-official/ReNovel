interface ApiResponse {
    success: boolean;
    message: string;
    body?:   any;
}

export default ApiResponse;