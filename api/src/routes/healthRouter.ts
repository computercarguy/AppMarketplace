import { Router } from 'express';
import Container from "typedi";
import { Health } from '../repos/health';

export class HealthRouter {
    setupRouter(): Router {
        let health = Container.get(Health);
        let router = Router();
        
        router.get('/health', (req, res) => health.getHealth(req, res));
        
        return router;
    }
}