import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import offerController from '@controllers/admin/offers';
import schemaValidator from '@utils/schemaValidator';
import { success } from '@constants';
import {verifyAuthToken,checkRole } from "@utils/authValidator";
import upload  from "@utils/multer";
import { addOfferSchema } from '@validators/admin';
import { verify } from 'jsonwebtoken';
const _ = require('lodash');


// Constants
const router = Router();
const { CREATED, OK } = StatusCodes;

// Paths
export const p = {
    add: '/add',
    edit:'/edit/:id',
    getDetails:'/get/:id',
    offers_list:'/list',
    update_status:'/update_status',
    deleteOffer:'/delete/:id',
    storeList:'/storeList'


} as const;

/**
 * add offers
 */
router.post(p.add,upload.fields([{name:"image",maxCount:1}]),verifyAuthToken,checkRole(['Admin']), async (req: any, res: Response) => {
    const data = await offerController.add_Offer(req.body,req.user.id,req.files?.image);
    return res.status(CREATED).send({ data, code: CREATED, message: success.en.OffersAdd });
})
/**
 * edit offers
 */
 router.put(p.edit,upload.fields([{name:"image",maxCount:1}]),verifyAuthToken,checkRole(['Admin']), async (req: any, res: Response) => {
    const data = await offerController.edit_Offer(req.params,req.body, req.user.id,req.files?.image);
    return res.status(CREATED).send({ data, code: CREATED, message: success.en.OffersEdit });
})
/**
 * Offers Details
 */
 router.get(p.getDetails,verifyAuthToken,checkRole(['Admin']), async (req: any, res: Response) => {
    const data = await offerController.offer_Details(req.params,req.user.id);
    return res.status(OK).send({ data, code: OK, message: success.en.recordFetched });
})
/**
 * Offers List
 */
 router.get(p.offers_list,verifyAuthToken,checkRole(['Admin']), async (req: any, res: Response) => {
    const data = await offerController.offersList(req.query,req.user.id,req.headers);
    return res.status(OK).send({ data, code: OK, message: success.en.recordFetched });
})
/**
 * status Update (Active Deactive)
 */
 router.put(p.update_status,verifyAuthToken,checkRole(['Admin']), async (req: any, res: Response) => {
    const data = await offerController.updateStatus(req.query,req.user.id);
    return res.status(CREATED).send({ data, code: CREATED, message: success.en.OffersEdit });
})
/**
 * Delete Offer
 */
 router.delete(p.deleteOffer,verifyAuthToken,checkRole(['Admin']), async (req: any, res: Response) => {
    const data = await offerController.delete_Offer(req.params,req.user.id);
    return res.status(OK).send({ data, code: OK, message: success.en.offerDelete });
})
/**
 * Store LIST
 */
 router.get(p.storeList,verifyAuthToken,checkRole(['Admin']), async (req: any, res: Response) => {
    const data = await offerController.storeList(req.query,req.user.id);
    return res.status(OK).send({ data, code: OK, message: success.en.recordFetched });
})



export default router;