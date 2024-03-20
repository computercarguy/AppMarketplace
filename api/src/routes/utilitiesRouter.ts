import { Router } from 'express';
import { Utilities } from '../repos/utilities';
import Container from "typedi";

export class UtilitiesRouter {
    setupRouter(): Router {
        let utilities = Container.get(Utilities);
        let router = Router();
        
        router.get('/utilities', (req, res) => utilities.getUtility(req, res));
        
        return router;
    }
}