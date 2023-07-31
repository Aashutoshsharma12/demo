import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import vendorOrderController from '@controllers/vendor/orders';
import schemaValidator from '@utils/schemaValidator';
import {addonsSchema} from '@validators/vendor/menuItems';
import { success } from '@constants';
import { verifyAuthToken, checkRole } from "@utils/authValidator";
const _ = require('lodash')


// Constants
const router = Router();
const { CREATED, OK } = StatusCodes;

// Paths
export const p = {
    orderList:'/list',
    details:'/details',
    update:'/update',
    scan_QRcode:'/scan_QRcode'

} as const;


 
/*** order list  */
router.get(p.orderList, verifyAuthToken, checkRole(['Vendor']),async (req: any, res: Response) => {
    const data = await vendorOrderController.orderList(req.query,req.user.id,req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(OK).send({ data, code: OK, message:success_msg.recordFetched});
});

/*** order details */
router.get(p.details,verifyAuthToken,checkRole(['Vendor']),async(req:any,res:Response)=>{
    const data = await vendorOrderController.orderDetails(req.query,req.user,req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(OK).send({ data, code: OK, message:success_msg.recordFetched});
});

/*** update status Cancelled Accepted */
router.put(p.update,verifyAuthToken,checkRole(['Vendor']),async(req:any,res:Response)=>{
    const data = await vendorOrderController.update_status(req.query,req.user,req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(OK).send({ data, code: OK, message:success_msg.success});
});
/*** scan QRcode */
router.get(p.scan_QRcode,verifyAuthToken,checkRole(['Vendor']),async(req:any,res:Response)=>{
    const data = await vendorOrderController.scan_QRcode(req.query,req.user,req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(OK).send({ data, code: OK, message:success_msg.orderComplete});
});

// Export default
export default router;
