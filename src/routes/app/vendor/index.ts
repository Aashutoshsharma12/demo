import { Router } from 'express';
import authRoute from './vendor_auth';
import vendor_storeRoute from './vendor_store';
import vendor_menuItemsRoute from './vendor_menuItems';
import vendor_itemSizeRoute from './venodr_itemSize';
import addons_typeRoute from './addons_type';
import addonsRoute from './addons';
import dashBoardRoute from './dashBoard'
import offerRoute from './offers'
import galleryRoute from './gallery'
import doorKeeperRoute from './addDoorKeeper'
import timingRoute from './vendor_timing'
import orderRoute from './orders'
import profileRoute from './profile'
import earningRoute from './vendor_Earning'
import vendor_categoryRoute from './vendor_itemCategory'
import notificationRoute from './notification'






// Export the base-router
const baseRouter = Router();
// Setup routers
baseRouter.use('/auth', authRoute)
baseRouter.use('/vendor_store', vendor_storeRoute)
baseRouter.use('/vendor_menuItems', vendor_menuItemsRoute)
baseRouter.use('/vendor_itemSize', vendor_itemSizeRoute)
baseRouter.use('/addons_type', addons_typeRoute)
baseRouter.use('/addons', addonsRoute)
baseRouter.use('/dashBoard', dashBoardRoute)
baseRouter.use('/offer', offerRoute)
baseRouter.use('/gallery', galleryRoute)
baseRouter.use('/addDoor_Keeper', doorKeeperRoute)
baseRouter.use('/timing', timingRoute)
baseRouter.use('/order', orderRoute)
baseRouter.use('/profile', profileRoute)
baseRouter.use('/earning', earningRoute)
baseRouter.use('/item_category', vendor_categoryRoute)
baseRouter.use('/notification',notificationRoute)







// Export default.
export default baseRouter;