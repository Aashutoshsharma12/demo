import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import doorKeeperProfileController from '@controllers/door_Keeper/profile';
import schemaValidator from '@utils/schemaValidator';
import { profileSchema } from "@validators/doorKeeper/auth";
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
    updateProfile: '/edit'

} as const;



/*** getDetails */
router.get(p.getDetails, verifyAuthToken, checkRole(['DoorKeeper']), async (req: any, res: Response) => {
    const data = await doorKeeperProfileController.getDetails(req.user.id, req.headers);
    var success_msg = success.en;
    if (req.headers.language == 'ar') {
        var success_msg = success.ar;
    }
    return res.status(OK).send({ data, code: OK, message: success_msg.gotUserProfile });
});

/*** Edit Profile */
router.put(p.updateProfile, upload.fields([{ name: "image", maxCount: 1 }]), verifyAuthToken, checkRole(['DoorKeeper']), async (req: any, res: Response) => {
    const data = await doorKeeperProfileController.updateProfile(req.body, req.user.id, req.files?.image, req.headers);
    var success_msg = success.en;
    if (req.headers.language == 'ar') {
        var success_msg = success.ar;
    }
    return res.status(OK).send({ data, code: OK, message: success_msg.profileUpdate });
});
// Export default
export default router;