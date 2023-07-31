import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import doorKeeperAuthController from '@controllers/door_Keeper/auth';
import schemaValidator from '@utils/schemaValidator';
import {logInSchema,changePasswordSchema} from "@validators/doorKeeper/auth"
import { success } from '@constants';
import { verifyAuthToken, checkRole } from "@utils/authValidator";
const _ = require('lodash')


// Constants
const router = Router();
const { CREATED, OK } = StatusCodes;

// Paths
export const p = {
    login: '/login',
    check: '/check-account',
    changePassword:'/changePassword',
    logout: '/logout',
    forgot:'/forgot'

} as const;


/*** Mark account Verified */
router.post(p.check, async (req: Request, res: Response) => {
    const data = await doorKeeperAuthController.checkAccount(req.body,req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(OK).send({ data, code: OK, message: data.isUser ? success_msg.accountExists: success_msg.noSuchAccountExist });
});

/*** User Login */
router.post(p.login, schemaValidator(logInSchema), async (req: Request, res: Response) => {
    const data = await doorKeeperAuthController.login(req.body, req.headers, req.ip);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(OK).send({ data, code: OK, message: success_msg.loginSuccessful });
});


/**** change Password ****/

router.put(p.changePassword, verifyAuthToken, checkRole(['DoorKeeper']),schemaValidator(changePasswordSchema), async (req: any, res: Response) => {
    const data = await doorKeeperAuthController.changePassword(req.body,req.user.id,req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(OK).send({ data, code: OK, message:success_msg.updatePassword});
});
// /*** User forgot password  */
router.put(p.forgot, async (req: Request, res: Response) => {
    const data = await doorKeeperAuthController.forgotPassword(req.body,req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(OK).send({ data, code: OK, message: success_msg.updatePassword });
});

// /*** User Logout  */
 router.get(p.logout, async (req: Request, res: Response) => {
    const data = await doorKeeperAuthController.logOut(req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(OK).send({ data, code: OK, message: success_msg.logOutSuccessful });
});

// Export default
export default router;