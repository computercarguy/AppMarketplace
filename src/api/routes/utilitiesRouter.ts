import { Router } from 'express';
import { Utilities } from '../repos/utilities';
import Container from "typedi";

export class UtilitiesRouter {
    setupRouter(): Router {
        let utilities = Container.get(Utilities);
        let utilitiesRouter = Router();
        
        utilitiesRouter.get('/utilities', utilities.getUtility);
        
        return utilitiesRouter;
    }
}