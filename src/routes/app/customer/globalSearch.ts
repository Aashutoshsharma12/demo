import { StatusCodes } from "http-status-codes";
import { Request, Response, Router } from "express";
import globalSearchController from '@controllers/customer/globalSearch';
import { success } from "@constants";
import { verifyAuthToken, checkRole } from "@utils/authValidator";
const _ = require('lodash')

const router = Router();
const { CREATED, OK } = StatusCodes;

export const global = {
    globalSearchList: '/globalSearchList',
    trending_search: '/trending-search',
    list: '/vendorShop-list',
} as const;


/////////////////////// globalSearchList ///////////////////////
router.get(global.globalSearchList, verifyAuthToken, checkRole(['Customer']), async (req: any, res: Response) => {
    const data = await globalSearchController.globalSearchList(req.query,req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(OK).send({ data, code: OK, message: success_msg.success });
});

/////////////////////// trending_search ///////////////////////
router.get(global.trending_search, verifyAuthToken, checkRole(['Customer']), async (req: any, res: Response) => {
    const data = await globalSearchController.trending_search(req.body,req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(OK).send({ data, code: OK, message: success_msg.success });
});

/////////////////////// vendorShopList ///////////////////////
router.get(global.list, verifyAuthToken, checkRole(['Customer']), async (req: any, res: Response) => {
    const data = await globalSearchController.vendorShopList(req.query,req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(OK).send({ data, code: OK, message: success_msg.success });
});

export default router;