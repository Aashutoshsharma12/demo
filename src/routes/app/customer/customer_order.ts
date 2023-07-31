import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import orderController from '../../../controllers/customer/customer_order';
import schemaValidator from '../../../utils/schemaValidator';
import { addOrderSchema,editOrderSchema,updateStatusSchema} from "../../../validators/customer_order"
import { success } from '../../../constants/index';
import { verifyAuthToken, checkRole } from "../../../utils/authValidator";
console.log('eneter12')

// Constants
const router = Router();
const { CREATED, OK } = StatusCodes;

// Paths
export const p = {
    add:'/add',
    edit:'/edit',
    orderDetails:'/orderDetails/:id',
    orderList:'/orderList',
    updateStatus:'/updateStatus/:id',
    vendorCart:'/vendorCart',
    removeCart:'/removeCart/:id',
    GetTimeSlot:'/GetTimeSlot',
    checkOrder:'/checkOrder',
    reorder_details:'/reorder_details'
} as const;

/*** Add order*/
 router.post(p.add, verifyAuthToken, checkRole(['Customer']), async (req: any, res: Response) => {
    const data = await orderController.addOrder_toCart(req.body, req.user.id,req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(CREATED).send({ data, code: CREATED, message: success_msg.orderAdd});
});

/*** update order*/
 router.post(p.edit, verifyAuthToken, checkRole(['Customer']), async (req: any, res: Response) => {
    const data = await orderController.update_order(req.body, req.user.id,req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(CREATED).send({ data, code: CREATED, message: success_msg.orderEdit});
});

/*** Order details*/
 router.get(p.orderDetails, verifyAuthToken, checkRole(['Customer']), async (req: any, res: Response) => {
    const data = await orderController.orderDetails(req.params.id, req.user.id,req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(OK).send({ data, code: OK, message: success_msg.recordFetched});
});

/*** Order List*/
 router.get(p.orderList, verifyAuthToken, checkRole(['Customer']), async (req: any, res: Response) => {
    const data = await orderController.orderList(req.query,req.user.id,req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(OK).send({ data, code: OK, message: success_msg.recordFetched});
});

/*** update Order*/
 router.put(p.updateStatus, verifyAuthToken, checkRole(['Customer']), async (req: any, res: Response) => {
    const data = await orderController.updateStatus(req.body,req.params.id,req.user.id,req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(OK).send({ data, code: OK, message: success_msg.success});
});

/*** cart details*/
router.get(p.vendorCart, verifyAuthToken, checkRole(['Customer']), async (req: any, res: Response) => {
    const data = await orderController.vendorCart(req.query, req.user.id,req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(OK).send({ data, code: OK, message: success_msg.recordFetched});
});

/***Remove cart*/
router.get(p.removeCart, verifyAuthToken, checkRole(['Customer']), async (req: any, res: Response) => {
    const data = await orderController.removeCart(req.params, req.user.id,req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(OK).send({ data, code: OK, message: success_msg.recordFetched});
});

/***Get time slot*/
router.get(p.GetTimeSlot,verifyAuthToken, async (req: any, res: Response) => {
    const data = await orderController.GetTimeSlot(req.query,req.user.id,req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(OK).send({ data, code: OK, message: success_msg.recordFetched});
});

/***Check Order*/
router.get(p.checkOrder,verifyAuthToken, async (req: any, res: Response) => {
    const data = await orderController.checkOrder(req.user.id,req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(OK).send({ data, code: OK, message: success_msg.recordFetched});
});
/***reorder_details*/
router.get(p.reorder_details,verifyAuthToken, async (req: any, res: Response) => {
    const data = await orderController.reorder_details(req.query,req.user.id,req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(OK).send({ data, code: OK, message: success_msg.recordFetched});
});

// Export default
export default router;
