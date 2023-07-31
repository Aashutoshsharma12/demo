import { StatusCodes } from "http-status-codes";
import { Request, Response, Router } from "express";
import favoriteController from "@controllers/customer/favorite";
import { success } from "@constants";
import { verifyAuthToken, checkRole } from "@utils/authValidator";
const _ = require("lodash")

const router = Router();
const { CREATED, OK } = StatusCodes;

export const content = {
    addFavorite: '/addFavorite',
    GetFavoriteByVendor: '/GetFavoriteByVendor',
    GetFavoriteByUser: '/GetFavoriteByUser'
} as const;


/////////////////////// Add favorite ///////////////////////
router.get(content.addFavorite, verifyAuthToken, checkRole(['Customer']), async (req: any, res: Response) => {
    const data = await favoriteController.addFavorite(req.query,req.user.id,req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(OK).send({ data, code: OK, message: success_msg.success });
});

/////////////////////// Get Favorite By Vendor ///////////////////////
router.get(content.GetFavoriteByVendor, verifyAuthToken, checkRole(['Vendor']), async (req: any, res: Response) => {
    const data = await favoriteController.GetFavoriteByVendor(req.query,req.user.id,req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(OK).send({data, code: OK, message: success_msg.success});
})

/////////////////////// Get Favorite by User ///////////////////////
router.get(content.GetFavoriteByUser, verifyAuthToken, checkRole(['Customer']), async (req: any, res:Response) => {
    const data = await favoriteController.GetFavoriteByUser(req.query,req.user.id,req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(OK).send({data, code: OK, message: success_msg.success})
});

export default router;