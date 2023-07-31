import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import ratingController from '@controllers/customer/rating';
import { success } from "@constants";
import { verifyAuthToken, checkRole } from "@utils/authValidator";

// Constants
const router = Router();
const { CREATED, OK } = StatusCodes;

// Paths
export const p = {
    addRating: '/addRating',
    getVendorRating: '/getVendorRating'
} as const;

/////////////////////// Add Rating ///////////////////////
router.post(p.addRating, verifyAuthToken, checkRole(['Customer']), async (req: any, res: Response) => {
    const data = await ratingController.addRating(req.query, req.user.id,req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(OK).send({ data, code: OK, message: success_msg.addressAdded });
});

/////////////////////// Get Vendor Rating ///////////////////////
router.get(p.getVendorRating, verifyAuthToken, checkRole(['Vendor']), async (req: any, res: Response) => {
    const data = await ratingController.getVendorRating(req.query,req.user.id,req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(OK).send({ data, code: OK, message: success_msg.gotLatestAddress });
});

// Export default
export default router;