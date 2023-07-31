import { Router } from 'express';
import authRoute from './auth';
import profileRoute from './profile';
import parkingRoute from './parking';

// Export the base-router
const baseRouter = Router();
// Setup routers
baseRouter.use('/auth', authRoute);
baseRouter.use('/profile', profileRoute);
baseRouter.use('/parking', parkingRoute);

// Export default.
export default baseRouter;