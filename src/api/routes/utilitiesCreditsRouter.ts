import { Router } from 'express';
import { UtilitiesCredits } from '../repos/utilitiesCredits';
import { Container } from 'typedi';

export class UtilitiesCreditsRouter {
    setupRouter(): Router {
        let utilitiesCredits = Container.get(UtilitiesCredits);
        let utilitiesCreditsRouter = Router();

        utilitiesCreditsRouter.get('/credits', utilitiesCredits.getCredits);
        utilitiesCreditsRouter.get('/credits/update', utilitiesCredits.update);
                
        return utilitiesCreditsRouter;
    }
}