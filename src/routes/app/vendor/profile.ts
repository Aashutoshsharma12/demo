import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import vendorProfileController from '@controllers/vendor/profile';
import schemaValidator from '@utils/schemaValidator';
import {profileSchema} from '@validators/vendor/auth';
import { success } from '@constants';
import { verifyAuthToken, checkRole } from "@utils/authValidator";
const _ = require('lodash');


// Constants
const router = Router();
const { CREATED, OK } = StatusCodes;

// Paths
export const p = {
    details:'/details',
    updateProfile:'/Edit',
    pushNotification:'/updateStataus'

} as const;


 
/*** vendor Details */
router.get(p.details, verifyAuthToken, checkRole(['Vendor']),async (req: any, res: Response) => {
    const data = await vendorProfileController.details(req.user.id,req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(OK).send({ data, code: OK, message:success_msg.gotUserProfile});
});

/*** Edit Profile */
router.put(p.updateProfile,verifyAuthToken,checkRole(['Vendor']),schemaValidator(profileSchema),async(req:any,res:Response)=>{
    const data = await vendorProfileController.updateProfile(req.body,req.user.id,req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(CREATED).send({ data, code: CREATED, message:success_msg.profileUpdate});
});

/*** push Notification */
router.put(p.pushNotification,verifyAuthToken,checkRole(['Vendor']),async(req:any,res:Response)=>{
    const data = await vendorProfileController.pushNotification(req.body,req.user.id,req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(CREATED).send({ data, code: CREATED, message:success_msg.updateStatus});
});

// Export default
export default router;