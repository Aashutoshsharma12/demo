import { StatusCodes } from "http-status-codes";
import { Request, Response, Router } from "express";
import homeController from '@controllers/customer/homeScreen';
import { addressSchema } from "@validators/address";
import schemaValidator from '@utils/schemaValidator';
import { success } from "@constants";
import { verifyAuthToken, checkRole } from "@utils/authValidator";
import upload from '@utils/multer';
const _ = require('lodash');

const router = Router();
const { CREATED, OK } = StatusCodes;

export const category = {
    storeTypelist: '/storeType-list',
    shopList: '/shop-list',
    list: '/category-list',
    itemList: '/item-list',
    nearestRestaurant: '/near-by-restaurant',
    getRestaurant: '/get-restaurant',
    searchSave: '/searchSave',
    getSearchData: '/getSearchData',
    coupanList: '/coupanList',
    details:'/details',
    restaurant_list:'/restaurant_list'
} as const;


/////////////////////// storeType_list ///////////////////////
router.get(category.storeTypelist, verifyAuthToken, checkRole(['Customer']), async (req: any, res: Response) => {
    const data = await homeController.storeType_list(req.query, req.headers);
    var success_msg = success.en;
    if (req.headers.language == 'ar') {
        var success_msg = success.ar;
    }
    return res.status(OK).send({ data, code: OK, message: success_msg.success });
});

router.get(category.shopList, verifyAuthToken, upload.single('image'), checkRole(['Customer']), async (req: any, res: Response) => {
    const data = await homeController.shopList(req.query, req.headers);
    var success_msg = success.en;
    if (req.headers.language == 'ar') {
        var success_msg = success.ar;
    }
    return res.status(OK).send({ data, code: OK, message: success_msg.success });
});

/////////////////////// categoryList ///////////////////////
router.get(category.list, verifyAuthToken, checkRole(['Customer']), async (req: any, res: Response) => {
    const data = await homeController.categoryList(req.query, req.headers);
    var success_msg = success.en;
    if (req.headers.language == 'ar') {
        var success_msg = success.ar;
    }
    return res.status(OK).send({ data, code: OK, message: success_msg.success });
});

/////////////////////// itemList ///////////////////////
router.get(category.itemList, verifyAuthToken, checkRole(['Customer']), async (req: any, res: Response) => {
    const data = await homeController.itemList(req.query, req.headers);
    var success_msg = success.en;
    if (req.headers.language == 'ar') {
        var success_msg = success.ar;
    }
    return res.status(OK).send({ data, code: OK, message: success_msg.success });
});

///////////////////////// nearestRestaurant /////////////////////////
router.get(category.nearestRestaurant, verifyAuthToken, checkRole(['Customer']), schemaValidator(addressSchema), async (req: any, res: Response) => {
    const data = await homeController.nearestRestaurant(req.body, req.user.id, req.headers);
    var success_msg = success.en;
    if (req.headers.language == 'ar') {
        var success_msg = success.ar;
    }
    return res.status(OK).send({ data, code: OK, message: success_msg.success });
});

/////////////////////// get Address ///////////////////////
router.get(category.getRestaurant, verifyAuthToken, checkRole(['Customer']), async (req: any, res: Response) => {
    const data = await homeController.getRestaurant(req.query, req.user.id, req.headers);
    var success_msg = success.en;
    if (req.headers.language == 'ar') {
        var success_msg = success.ar;
    }
    return res.status(OK).send({ data, code: OK, message: success_msg.recordFetched });
});

///////////////////////// Save search data /////////////////////////
router.get(category.searchSave, verifyAuthToken, checkRole(['Customer']), async (req: any, res: Response) => {
    const data = await homeController.searchSave(req.query, req.user.id, req.headers);
    var success_msg = success.en;
    if (req.headers.language == 'ar') {
        var success_msg = success.ar;
    }
    return res.status(OK).send({ data, code: OK, message: success_msg.success });
});

///////////////////////// Get search data /////////////////////////
router.get(category.getSearchData, verifyAuthToken, checkRole(['Customer']), async (req: any, res: Response) => {
    const data = await homeController.getSearchData(req.query, req.user.id, req.headers);
    var success_msg = success.en;
    if (req.headers.language == 'ar') {
        var success_msg = success.ar;
    }
    return res.status(OK).send({ data, code: OK, message: success_msg.success });
});

// Get admin coupans
router.get(category.coupanList, verifyAuthToken, checkRole(['Customer']), async (req: any, res: Response) => {
    const data = await homeController.coupanList(req.user.id, req.headers);
    var success_msg = success.en;
    if (req.headers.language == 'ar') {
        var success_msg = success.ar;
    }
    return res.status(OK).send({ data, code: OK, message: success_msg.success });
});
//restaurant_details
router.get(category.details, verifyAuthToken, checkRole(['Customer']), async (req: any, res: Response) => {
    const data = await homeController.restaurant_details(req.query,req.user.id, req.headers);
    var success_msg = success.en;
    if (req.headers.language == 'ar') {
        var success_msg = success.ar;
    }
    return res.status(OK).send({ data, code: OK, message: success_msg.recordFetched });
});

//restaurant_list according to offer
router.get(category.restaurant_list, verifyAuthToken, checkRole(['Customer']), async (req: any, res: Response) => {
    const data = await homeController.restaurant_listAccordingto_offer(req.query,req.user.id, req.headers);
    var success_msg = success.en;
    if (req.headers.language == 'ar') {
        var success_msg = success.ar;
    }
    return res.status(OK).send({ data, code: OK, message: success_msg.recordFetched });
});


export default router;