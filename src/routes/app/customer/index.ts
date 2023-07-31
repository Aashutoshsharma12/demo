import { Router } from 'express';
import authRoute from './auth';
import addressRoute from './address';
import globalRoute from './globalSearch';
import homeRoute from './homeScreen';
import contentRoute from './content';
import menuRoute from './menu';
import offerRouter from './offer';
import profileRoute from './profile';
import orderRoute from './customer_order';
import favoriteRoute from './favorite';
import ratingRoute from './rating';
import notificationRoute from './notification';
import paymentRoute from './payment';
import { Console } from 'console';
import { base } from '@models/customer';
const baseRouter = Router();
console.log("enter1")

// Setup routers
baseRouter.use('/auth', authRoute);
baseRouter.use('/address', addressRoute);
baseRouter.use('/search', globalRoute);
baseRouter.use('/home', homeRoute);
baseRouter.use('/content', contentRoute);
baseRouter.use('/menu', menuRoute);
baseRouter.use('/offer', offerRouter);
baseRouter.use('/profile', profileRoute);
baseRouter.use('/order', orderRoute);
baseRouter.use('/fav',favoriteRoute);
baseRouter.use('/rating',ratingRoute);
baseRouter.use('/notification',notificationRoute);
baseRouter.use('/payment',paymentRoute);

// Export default.
export default baseRouter;