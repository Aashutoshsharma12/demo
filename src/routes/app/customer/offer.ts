import { StatusCodes } from "http-status-codes";
import { Request, Response, Router } from "express";
import offerController from "@controllers/customer/offer";
import { success } from "@constants";
import { verifyAuthToken, checkRole } from "@utils/authValidator";
const _ = require('lodash')

const router = Router();
const { CREATED, OK } = StatusCodes

export const offer = {
    offerList: '/offer-list',
    checkOffer:'/checkOffer'
}

/////////////////////// offerList ///////////////////////
router.get(offer.offerList, verifyAuthToken, checkRole(["Customer"]), async (req: any, res: Response) => {
    const data = await offerController.offerList(req.query,req.user.id,req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(OK).send({ data, code: OK, message: success_msg.success });
})
/////////////////////// check coupon code ///////////////////////
router.get(offer.checkOffer, verifyAuthToken, checkRole(["Customer"]), async (req: any, res: Response) => {
    const data = await offerController.checkOffer(req.query,req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(OK).send({ data, code: OK, message: success_msg.success });
})

export default router;