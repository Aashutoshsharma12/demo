import { Router } from 'express';
import { Request, Response } from 'express';
import path from 'path';
const viewsDir = path.join(__dirname, '../../public/admin/views');
const baseRouter = Router();

baseRouter.get('/', (_: Request, res: Response) => {
    res.redirect('/login')
    res.redirect('/admin/login');
});

/***********Login Page*************/
baseRouter.get('/login', (_: Request, res: Response) => {
    res.sendFile('auth/login.html', { root: viewsDir });
});

/***********Dashboard Page*************/
baseRouter.get('/dashboard', (_: Request, res: Response) => {
    res.sendFile('dashboard.html', { root: viewsDir });
});

/***********Change Password*************/
baseRouter.get('/changePassword', (_: Request, res: Response) => {
    res.sendFile('setting/changePassword.html', { root: viewsDir });
});
/***********Change Password*************/
baseRouter.get('/version', (_: Request, res: Response) => {
    res.sendFile('setting/app_version.html', { root: viewsDir });
});


/*** vendor listing */
baseRouter.get('/vendor_list', (_: Request, res: Response) => {
    res.sendFile('listing/vendorList.html', { root: viewsDir });
});

/*** add vendor */
baseRouter.get('/addVendor', (_: Request, res: Response) => {
    res.sendFile('add/addVendor.html', { root: viewsDir });
});

/*** edit vendor */
baseRouter.get('/editVendor', (_: Request, res: Response) => {
    res.sendFile('add/editVendor.html', { root: viewsDir });
});

/*** View vendor */
baseRouter.get('/vendorView', (_: Request, res: Response) => {
    res.sendFile('add/vendorView.html', { root: viewsDir });
});

/***  vendor category */
baseRouter.get('/vendorCategoey', (_: Request, res: Response) => {
    res.sendFile('listing/vendor_category.html', { root: viewsDir });
});

/*** category list */
baseRouter.get('/category', (_: Request, res: Response) => {
    res.sendFile('listing/category.html', { root: viewsDir });
});

/*** sub_category list */
baseRouter.get('/sub_category', (_: Request, res: Response) => {
    res.sendFile('listing/sub_category.html', { root: viewsDir });
});

/*** Add Sub Category */
baseRouter.get('/addSub_category', (_: Request, res: Response) => {
    res.sendFile('add/addSub_category.html', { root: viewsDir });
});

/*** Edit Sub Category */
baseRouter.get('/editSub_category', (_: Request, res: Response) => {
    res.sendFile('add/editSub_category.html', { root: viewsDir });
});

/*** Sub Admin list */
baseRouter.get('/sub_admin', (_: Request, res: Response) => {
    res.sendFile('listing/sub_admin.html', { root: viewsDir });
});

/*** Add Sub Admin  */
baseRouter.get('/addSub_admin', (_: Request, res: Response) => {
    res.sendFile('add/addSub_admin.html', { root: viewsDir });
});

/*** Edit Sub Admin  */
baseRouter.get('/editSub_admin', (_: Request, res: Response) => {
    res.sendFile('add/editSub_admin.html', { root: viewsDir });
});

/*** View Sub Admin  */
baseRouter.get('/viewSub_admin', (_: Request, res: Response) => {
    res.sendFile('add/viewSub_admin.html', { root: viewsDir });
});

/***********User Listing Page*************/
baseRouter.get('/user', (_: Request, res: Response) => {
    res.sendFile('listing/userListing.html', { root: viewsDir });
});

/***********Coupon Listing Page*************/
baseRouter.get('/offers', (_: Request, res: Response) => {
    res.sendFile('listing/offerListing.html', { root: viewsDir });
});

/***********Add Offer*************/
baseRouter.get('/addOffers', (_: Request, res: Response) => {
    res.sendFile('add/addOffers.html', { root: viewsDir });
});

/***********Edit Offer*************/
baseRouter.get('/editOffers', (_: Request, res: Response) => {
    res.sendFile('add/editOffers.html', { root: viewsDir });
});

/***********User View Page*************/
baseRouter.get('/userView', (_: Request, res: Response) => {
    res.sendFile('add/userView.html', { root: viewsDir });
});

/***********Order Management*************/
baseRouter.get('/orderManagement', (_: Request, res: Response) => {
    res.sendFile('listing/orderManagement.html', { root: viewsDir });
});

/***********View Order Management*************/
baseRouter.get('/viewOrderManagement', (_: Request, res: Response) => {
    res.sendFile('add/viewOrderManagement.html', { root: viewsDir });
});

/***********Bulk Notification List*************/
baseRouter.get('/notification', (_: Request, res: Response) => {
    res.sendFile('listing/notification.html', { root: viewsDir });
});

/***********Single Notification List*************/
// baseRouter.get('/singleNotification', (_: Request, res: Response) => {
//     res.sendFile('listing/singleNotification.html', { root: viewsDir });
// });

/***********Builk Management*************/
// baseRouter.get('/bulkNotification', (_: Request, res: Response) => {
//     res.sendFile('listing/bulkNotification.html', { root: viewsDir });
// });

/***********Queries Management*************/
baseRouter.get('/queries', (_: Request, res: Response) => {
    res.sendFile('listing/queriesManagement.html', { root: viewsDir });
});

/***********Payment Management*************/
baseRouter.get('/payment', (_: Request, res: Response) => {
    res.sendFile('listing/payment.html', { root: viewsDir });
});

/***********Cousine Category Management*************/
baseRouter.get('/cuisine_category', (_: Request, res: Response) => {
    res.sendFile('listing/cuisine_category.html', { root: viewsDir });
});
/***********Faq Management*************/
baseRouter.get('/faq_list', (_: Request, res: Response) => {
    res.sendFile('listing/faq.html', { root: viewsDir });
});

// invoice pdf
baseRouter.get('/invoice_pdf', (_: Request, res: Response) => {
    res.sendFile('invoice_pdf.html', { root: viewsDir });
});
// invoice pdf
baseRouter.get('/no_internet', (_: Request, res: Response) => {
    res.sendFile('common/noconnection.html', { root: viewsDir });
});
// parking management
baseRouter.get('/parking', (_: Request, res: Response) => {
    res.sendFile('listing/parking.html', { root: viewsDir });
});
export default baseRouter;