import { StatusCodes } from "http-status-codes";
import { Request, Response, Router } from "express";
import paymentController from '@controllers/customer/payment';
import { success } from "@constants";
import { verifyAuthToken, checkRole } from "@utils/authValidator";
const _ = require('lodash')

const router = Router();
const { CREATED, OK } = StatusCodes;

export const checkout = {
    CheckOut: '/CheckOut',
    AddCard:'/AddCard',
    getCard:'/getCard',
    deleteCard:'/deleteCard',
    paymentCallBack:'/paymentCallBack',
    verifyPayment:'/verifyPayment',
    AdddefaultCard:'/AdddefaultCard',
    AddBankAccount:'/AddBankAccount',
    GetBankAccount:'/GetBankAccount',
    DeleteBankAccount:'/DeleteBankAccount'
} as const;

router.post(checkout.CheckOut, verifyAuthToken, checkRole(['Customer']), async (req: any, res: Response) => {
    const data = await paymentController.CheckOut(req.body,req.user.id,req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(OK).send({ data, code: OK, message: success_msg.success });
});

router.post(checkout.AddCard, verifyAuthToken, checkRole(['Customer']), async (req: any, res: Response) => {
    const data = await paymentController.AddCard(req.body,req.user.id,req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(OK).send({ data, code: OK, message: success_msg.success });
});

router.post(checkout.getCard, verifyAuthToken, checkRole(['Customer']), async (req: any, res: Response) => {
    const data = await paymentController.getCard(req.body,req.user.id,req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(OK).send({ data, code: OK, message: success_msg.success });
});

router.post(checkout.deleteCard, verifyAuthToken, checkRole(['Customer']), async (req: any, res: Response) => {
    const data = await paymentController.deleteCard(req.body,req.user.id,req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(OK).send({ data, code: OK, message: success_msg.success });
});

router.post(checkout.paymentCallBack,  async (req: any, res: Response) => {
    const data = await paymentController.paymentCallBack(req.body,req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(OK).send({ data, code: OK, message: success_msg.success });
});

router.post(checkout.verifyPayment,  async (req: any, res: Response) => {
    const data = await paymentController.verifyPayment(req.body,req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(OK).send({ data, code: OK, message: success_msg.success });
});

router.post(checkout.AdddefaultCard,verifyAuthToken,  async (req: any, res: Response) => {
    const data = await paymentController.AdddefaultCard(req.body,req.user.id,req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(OK).send({ data, code: OK, message: success_msg.success });
});

router.post(checkout.AddBankAccount,verifyAuthToken,  async (req: any, res: Response) => {
    const data = await paymentController.AddBankAccount(req.body,req.user.id,req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(OK).send({ data, code: OK, message: success_msg.success });
});

router.get(checkout.GetBankAccount,verifyAuthToken,  async (req: any, res: Response) => {
    const data = await paymentController.GetBankAccount(req.user.id,req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(OK).send({ data, code: OK, message: success_msg.success });
});

router.post(checkout.DeleteBankAccount,verifyAuthToken,  async (req: any, res: Response) => {
    const data = await paymentController.DeleteBankAccount(req.body,req.user.id,req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(OK).send({ data, code: OK, message: success_msg.success });
});

export default router;