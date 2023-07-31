import { StatusCodes } from "http-status-codes";
import { errors } from "@constants";
import schemaValidator from "@utils/schemaValidator";
import orderController from '@controllers/admin/order'
import { Response, Request, Router } from "express";
import { success } from "@constants";
import { verifyAuthToken,checkRole } from "@utils/authValidator";


//constant
const router = Router()
const {CREATED, OK} = StatusCodes

//path
export const p = {
list:'/list',
details:'/details/:id',
payment_list:'/paymentList'
} as const;
 
//Order list
router.get(p.list,verifyAuthToken,checkRole(['Admin']),async(req:any,res:Response)=>{
    const data = await orderController.order_list(req.query);
    return res.status(OK).send({data,code:OK,message:success.en.recordFetched});
});
//order details
router.get(p.details,verifyAuthToken,checkRole(['Admin']),async(req:any,res:Response)=>{
    const data = await orderController.details(req.params.id);
    return res.status(OK).send({data,code:OK,message:success.en.recordFetched});
});

//payment list
router.get(p.payment_list,verifyAuthToken,checkRole(['Admin']),async(req:any,res:Response)=>{
    const data = await orderController.payment_list(req.query);
    return res.status(OK).send({data,code:OK,message:success.en.recordFetched});
});

export default router;