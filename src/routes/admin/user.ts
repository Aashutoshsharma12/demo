import { StatusCodes } from "http-status-codes";
import { Request, Response, Router } from 'express';
import userController from '../../controllers/admin/user'
import { verifyAuthToken,checkRole } from "@utils/authValidator";
import { success } from "@constants";
const _ = require('lodash')

// Constants
const router = Router();
const { CREATED, OK } = StatusCodes;

// Paths
export const user = {
    userlist: '/list',
    details: '/detail',
    userStatus: '/status/:id',
    delete: '/user-delete',
    userExceldata: '/user-excelData',
    orderList:'/orderList',
    order_statusList:'/order_statusList'
} as const;

/////////////////////// User List ///////////////////////
router.get(user.userlist, verifyAuthToken, async (req: Request, res: Response) => {
    const data = await userController.userList(req.query);
    return res.status(OK).send({ data, code: OK, message: success.en.success });
});

// /////////////////////// User Profile ///////////////////////
// router.get(user.details, verifyAuthToken, async (req: Request, res: Response) => {
//     const data = await userController.userProfile(req.params.id);
//     return res.status(OK).send({ data, code: OK, message: success.en.success });
// });

/////////////////////// User Profile ///////////////////////
router.get(user.details, verifyAuthToken, async (req: Request, res: Response) => {
    const data = await userController.userProfile(req.query, req.params.id);
    return res.status(OK).send({ data, code: OK, message: success.en.success });
});

/////////////////////// User Status ///////////////////////
router.put(user.userStatus, verifyAuthToken, async (req: Request, res: Response) => {
    const data = await userController.userStatus(req.body, req.params.id);
    return res.status(OK).send({data, code: OK, message: success.en.success});
});

/////////////////////// User Delete ///////////////////////
router.post(user.delete, verifyAuthToken, async (req: Request, res: Response) => {
    const data = await userController.userDelete(req.body, req.params.id)
    return res.status(OK).send({ data, code: OK, message: success.en.success })
});

/////////////////////// User Excel List ///////////////////////
router.get(user.userExceldata, async (req: Request, res: Response) => {
    const data = await userController.userExcelList(req.body);
    return res.status(OK).send({data, code: OK, message: success.en.success});
});
/////////////////////// User order List ///////////////////////
router.get(user.orderList, async (req: Request, res: Response) => {
    const data = await userController.orderList(req.query);
    return res.status(OK).send({data, code: OK, message: success.en.recordFetched});
});
/////////////////////// User order status List ///////////////////////
router.get(user.order_statusList, async (req: Request, res: Response) => {
    const data = await userController.orderStatus_List(req.query);
    return res.status(OK).send({data, code: OK, message: success.en.recordFetched});
});

// Export default
export default router;