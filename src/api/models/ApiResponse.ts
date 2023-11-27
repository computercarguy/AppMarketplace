export interface ApiResponse{
    message: string | object | null | undefined;
    error: string;
    results: string[] | object[] | null;
}