import { StatusCodes } from "http-status-codes";
import { success } from "@constants";
import { Response, Router, Request } from 'express'
import paymentController from "@controllers/common/payment";
import { checkRole, verifyAuthToken } from "@utils/authValidator";

//Constant
var router = Router();
const { CREATED, OK } = StatusCodes;

export const p = {
    addPayment: '/add',
} as const

//Add Faq
router.post(p.addPayment, verifyAuthToken, checkRole(['Customer']), async (req: any, res: Response) => {
    const data = await paymentController.save_paymentstatus(req.user.id, req.body,req.headers);
    return res.status(CREATED).send({ data, code: CREATED, message: success.en.success });
});
//Add Faq
// router.post(p.addPayment, verifyAuthToken, checkRole(['Customer']), async (req: any, res: Response) => {
//     const data = await paymentController.payment(req.body);
//     return res.status(CREATED).send({ data, code: CREATED, message: success.en.success });
// });

export default router;