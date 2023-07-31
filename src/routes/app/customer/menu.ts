import { StatusCodes } from "http-status-codes";
import { Request, Response, Router } from "express";
import menuController from "@controllers/customer/menu";
import { success } from "@constants";
import { verifyAuthToken, checkRole } from "@utils/authValidator";
const _ = require("lodash")

const router = Router();
const { CREATED, OK } = StatusCodes;

export const menu = {
    list: '/cat-list',
    storeMenu: '/store-menu',
    menuList: '/menu-list',
    menuItemSize: '/item-size',
    offer_list:'/offer_list'
} as const;

/////////////////////// catList ///////////////////////
router.get(menu.list, verifyAuthToken, checkRole(['Customer']), async (req: any, res: Response) => {
    const data = await menuController.catList(req.query,req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(OK).send({ data, code: OK, message: success_msg.success });
});

/////////////////////// storeMenu ///////////////////////
router.get(menu.storeMenu, verifyAuthToken, checkRole(['Customer']), async (req: any, res: Response) => {
    const data = await menuController.storeCatItemList(req.query,req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(OK).send({ data, code: OK, message: success_msg.success });
});

/////////////////////// menuItemList ///////////////////////
router.get(menu.menuList, verifyAuthToken, checkRole(['Customer']), async (req: any, res: Response) => {
    const data = await menuController.menuItemList(req.query,req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(OK).send({ data, code: OK, message: success_msg.success });
});

/////////////////////// menuItemSize ///////////////////////
router.get(menu.menuItemSize, verifyAuthToken, checkRole(['Customer']), async (req: any, res: Response) => {
    const data = await menuController.menuItemSize(req.query,req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(OK).send({ data, code: OK, message: success_msg.success });
});
/////////////////////// offerList ///////////////////////
router.get(menu.offer_list, verifyAuthToken, checkRole(['Customer']), async (req: any, res: Response) => {
    const data = await menuController.offerlist_forRestaurant(req.query,req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(OK).send({ data, code: OK, message: success_msg.success });
});

export default router;