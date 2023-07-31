import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import vendor_timingController from '@controllers/vendor/vendor_timing';
import schemaValidator from '@utils/schemaValidator';
// import {timingSchema} from '@validators/vendor/menuItems';
import { success } from '@constants';
import { verifyAuthToken, checkRole } from "@utils/authValidator";
const _ = require('lodash')


// Constants
const router = Router();
const { CREATED, OK } = StatusCodes;

// Paths
export const p = {
    addEditTiming:'/add',
    getTiming:'/get'
} as const;

/*** add and Edit vendor timing */
router.post(p.addEditTiming, verifyAuthToken, checkRole(['Vendor']),async (req: any, res: Response) => {
    const data = await vendor_timingController.addEditTiming(req.body,req.user.id,req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(CREATED).send({ data, code: CREATED, message:success_msg.success});
});

/*** Get Timing */
router.get(p.getTiming, verifyAuthToken, checkRole(['Vendor']),async (req: any, res: Response) => {
    const data = await vendor_timingController.getTiming(req.query,req.user.id,req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(OK).send({ data, code: OK, message:success_msg.recordFetched});
});


// Export default
export default router;
