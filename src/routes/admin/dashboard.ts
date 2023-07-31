import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import dashboardController from '../../controllers/admin/dashboard';
import { success } from '../../constants/index';
import { verifyAuthToken, checkRole } from "../../utils/authValidator";
import upload from '@utils/multer';


// Constants
const router = Router();
const { CREATED, OK } = StatusCodes;

// Paths
export const p = {
    details:'/details',
    list:'/list',
    latestOrder_list:'/latestOrder_list',
    profit_details:'/profit_details',
    graph_Api:'/graph_Api'
} as const;


/**
dashboard details
*/
 router.get(p.details,verifyAuthToken, checkRole(['Admin']), async (req: any, res: Response) => {
    const data = await dashboardController.dashboardApi(req.user.id);
    return res.status(OK).send({ data, code: OK, message:success.en.recordFetched});
});
/**
vendor list
*/
router.get(p.list,verifyAuthToken, checkRole(['Admin']), async (req: any, res: Response) => {
    const data = await dashboardController.recent_acceptedVendor_list(req.user.id,req.headers);
    return res.status(OK).send({ data, code: OK, message:success.en.recordFetched});
});
/**
latest order list
*/
router.get(p.latestOrder_list,verifyAuthToken, checkRole(['Admin']), async (req: any, res: Response) => {
    const data = await dashboardController.latestOrderList(req.headers);
    return res.status(OK).send({ data, code: OK, message:success.en.recordFetched});
});
/**
dashboard profit section details
*/
router.get(p.profit_details,verifyAuthToken, checkRole(['Admin']), async (req: any, res: Response) => {
    const data = await dashboardController.storeType_Profit(req.query,req.user.id);
    return res.status(OK).send({ data, code: OK, message:success.en.recordFetched});
});
/**
dashboard order placed Amount Graph api
*/
router.get(p.graph_Api,verifyAuthToken, checkRole(['Admin']), async (req: any, res: Response) => {
    const data = await dashboardController.order_PlacedAmountGraphApi(req.query,req.user.id,req.headers);
    return res.status(OK).send({ data, code: OK, message:success.en.recordFetched});
});



// Export default
export default router;