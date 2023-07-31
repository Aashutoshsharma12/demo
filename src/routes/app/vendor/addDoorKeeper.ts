import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import addDoor_keeperController from '@controllers/vendor/addDoor_Keeper';
import schemaValidator from '@utils/schemaValidator';
import { addDoorKeeperSchema} from "@validators/doorKeeper/auth";
import { success } from '@constants';
import { verifyAuthToken, checkRole } from "@utils/authValidator";
const _ = require('lodash');


// Constants
const router = Router();
const { CREATED, OK } = StatusCodes;

// Paths
export const p = {
    addDoor_keeper: '/add'

} as const;

/*** User SignUp */
 router.post(p.addDoor_keeper, verifyAuthToken, checkRole(['Vendor']), schemaValidator(addDoorKeeperSchema), async (req: any, res: Response) => {
    const data = await addDoor_keeperController.addDoor_keeper(req.body,req.user.id,req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(CREATED).send({ data, code: CREATED, message:success_msg.doorKeeperSuccessful});
});


// Export default
export default router;
