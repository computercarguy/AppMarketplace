import { Response } from "express-serve-static-core";
import * as settings from '../../Settings.json';

function useSendResponse(res: Response, message?: string | object | null, error?: string | null) {
    res.status(error != null ? 400 : 200).json({
        message: message || "",
        error: error || (message ? null : settings.errorMessage),
    });
}

export default useSendResponse;
