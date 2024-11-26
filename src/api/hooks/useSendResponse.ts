import { Response } from "express-serve-static-core";
import * as settings from '../../Settings.json';
import { ApiResponse } from "../models/ApiResponse";

export default function useSendResponse(res: Response, message?: string | object | ApiResponse | null, error?: string | null, statusCode?: number | null) {
    let status = error != null ? 400 : 200;

    res.status(statusCode ?? status).json({
        message: message || "",
        error: error || (message ? null : settings.errorMessage),
    });
}
