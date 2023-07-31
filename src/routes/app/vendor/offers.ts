import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import vendorOfferController from '@controllers/vendor/offers';
import schemaValidator from '@utils/schemaValidator';
import { success } from '@constants';
import {addOfferSchema, editOfferSchema} from '../../../validators/vendor/menuItems'
import { verifyAuthToken, checkRole } from "@utils/authValidator";
import upload  from "@utils/multer";
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
    deleteOffer:'/delete/:id'


} as const;

/*** add offers */
router.post(p.add,upload.fields([{name:'image',maxCount:1}]), verifyAuthToken,schemaValidator(addOfferSchema), async (req: any, res: Response) => {
    const data = await vendorOfferController.addOffer(req.body, req.user.id,req.headers,req.files?.image);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(CREATED).send({ data, code: CREATED, message: success_msg.OffersAdd });
});

/*** edit offers */
router.put(p.edit,upload.fields([{name:'image',maxCount:1}]), verifyAuthToken,schemaValidator(editOfferSchema), async (req: any, res: Response) => {
    const data = await vendorOfferController.editOffer(req.params,req.body, req.user.id,req.headers,req.files?.image);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(CREATED).send({ data, code: CREATED, message: success_msg.OffersEdit });
});

/*** Offers Details */
router.get(p.getDetails, verifyAuthToken, async (req: any, res: Response) => {
    const data = await vendorOfferController.offerDetails(req.params,req.user.id,req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(OK).send({ data, code: OK, message: success_msg.recordFetched });
});

/*** Offers List */
router.get(p.offers_list, verifyAuthToken, async (req: any, res: Response) => {
    const data = await vendorOfferController.offers_list(req.query,req.user.id,req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(OK).send({ data, code: OK, message: success_msg.recordFetched });
});

/*** status Update (Active Deactive) */
router.put(p.update_status, verifyAuthToken, async (req: any, res: Response) => {
    const data = await vendorOfferController.update_status(req.query,req.user.id,req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(CREATED).send({ data, code: CREATED, message: success_msg.OffersEdit });
});

/*** Delete Offer */
router.delete(p.deleteOffer, verifyAuthToken, async (req: any, res: Response) => {
    const data = await vendorOfferController.deleteOffer(req.params,req.user.id,req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(OK).send({ data, code: OK, message: success_msg.offerDelete });
});


export default router;