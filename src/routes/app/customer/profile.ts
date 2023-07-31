import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import customerProfileController from '@controllers/customer/profile';
import schemaValidator from '@utils/schemaValidator';
import {profileSchema} from "@validators/auth";
import { success } from '@constants';
import { verifyAuthToken, checkRole } from "@utils/authValidator";
import upload from '@utils/multer';
const _ = require('lodash');


// Constants
const router = Router();
const { CREATED, OK } = StatusCodes;

// Paths
export const p = {
    getDetails: '/get',
    updateProfile:'/edit'

} as const;



// /*** getDetails */
router.get(p.getDetails, verifyAuthToken, checkRole(['Customer']), async (req: any, res: Response) => {
    const data = await customerProfileController.getDetails(req.user.id,req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(OK).send({ data, code: OK, message:success_msg.gotUserProfile});
});

// /*** Edit Profile  */
router.put(p.updateProfile,schemaValidator(profileSchema),upload.fields([{name:"image",maxCount:1}]), verifyAuthToken, checkRole(['Customer']), async (req: any, res: Response) => {
    const data = await customerProfileController.updateProfile(req.body,req.user.id,req.files?.image,req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(OK).send({ data, code: OK, message:success_msg.updateSuccessful});
});

// Export default
export default router;