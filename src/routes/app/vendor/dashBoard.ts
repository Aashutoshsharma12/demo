import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import vendorDashBoardController from '@controllers/vendor/dashBoard';
import schemaValidator from '@utils/schemaValidator';
import {addonsSchema} from '@validators/vendor/menuItems';
import { success } from '@constants';
import { verifyAuthToken, checkRole } from "@utils/authValidator";
const _ = require('lodash');


// Constants
const router = Router();
const { CREATED, OK } = StatusCodes;

// Paths
export const p = {
    get:'/get',
    update:'/update_status'
} as const;

/****get addons ****/
router.get(p.get, verifyAuthToken, checkRole(['Vendor']),async (req: any, res: Response) => {
    const data = await vendorDashBoardController.dashBoardApi(req.query,req.user.id,req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(OK).send({ data, code: OK, message:success_msg.recordFetched});
});
/****online status ****/
router.get(p.update, verifyAuthToken, checkRole(['Vendor']),async (req: any, res: Response) => {
    const data = await vendorDashBoardController.online_offlineStore(req.query,req.user.id,req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(OK).send({ data, code: OK, message:success_msg.success});
});

// Export default
export default router;
