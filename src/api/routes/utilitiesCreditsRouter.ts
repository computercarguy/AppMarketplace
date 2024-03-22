import { Router } from 'express';
import { UtilitiesCredits } from '../repos/utilitiesCredits';
import { Container } from 'typedi';

export class UtilitiesCreditsRouter {
    setupRouter(): Router {
        let utilitiesCredits = Container.get(UtilitiesCredits);
        let router = Router();

        router.get('/credits', utilitiesCredits.getCredits);
        router.get('/credits/all', utilitiesCredits.getAllCredits);
        router.post('/credits/update', (req, res) => utilitiesCredits.update(req, res));
                
        return router;
    }
}