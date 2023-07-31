import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import vendorEarningController from '@controllers/vendor/vendor_Earning';
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
    totalEarningList:'/list'
} as const;


 
/*** Earning list */
router.get(p.totalEarningList, verifyAuthToken, checkRole(['Vendor']),async (req: any, res: Response) => {
    const data = await vendorEarningController.totalEarningList(req.query,req.user.id,req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(OK).send({ data, code: OK, message:success_msg.recordFetched});
});

// Export default
export default router;