export class ApiResponse{
    message: string | object | null | undefined;
    error: string;
    results: string[] | object[] | null;
    status: number | null | undefined;
}