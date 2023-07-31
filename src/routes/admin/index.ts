import { Router } from 'express';
import foodCategoryRoute from './foodCategory';
import itemCategoryRoute from './itemCategory';
import cuisineRoute from './cuisineCategory';
import userRoute from './user';
import authRoute from './admin_auth';
import vendorRoute from './vendorList';
import storeTypeRoute from './storeType';
import offersRoute from './offers'
import sub_AdminRoute from './sub_admin';
import orderRoute from './order';
import notificationRoute from './notification'
import dashboardRoute from './dashboard'
import taxRoute from './admin_taxes'
import settingRoute from './setting'
import parkingRoute from './parking'


const baseRouter = Router();

// Setup routers
baseRouter.use('/foodCategory', foodCategoryRoute)
baseRouter.use('/itemCategory', itemCategoryRoute)
baseRouter.use('/cuisineCategory', cuisineRoute)
baseRouter.use('/user', userRoute)
baseRouter.use('/auth', authRoute)
baseRouter.use('/vendor', vendorRoute)
baseRouter.use('/storeType', storeTypeRoute)
baseRouter.use('/offer', offersRoute)
baseRouter.use('/sub_Admin', sub_AdminRoute)
baseRouter.use('/order', orderRoute)
baseRouter.use('/notification', notificationRoute)
baseRouter.use('/dashboard', dashboardRoute)
baseRouter.use('/tax', taxRoute)
baseRouter.use('/setting', settingRoute)
baseRouter.use('/parking', parkingRoute)


// Export default.
export default baseRouter;