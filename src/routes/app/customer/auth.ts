import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import customerAuthController from '@controllers/customer/auth';
import schemaValidator from '@utils/schemaValidator';
import { signUpSchema, accountVerificationSchema, logInSchema } from "@validators/auth";
import { success } from '@constants';
console.log('eneter')
// Constants
const router = Router();
const { CREATED, OK } = StatusCodes;

// Paths
export const p = {
    signUp: '/sign-up',
    login: '/login',
    check: '/check-account',
    logout: '/logout'

} as const;

/////////////////////// User SignUp ///////////////////////
router.post(p.signUp, schemaValidator(signUpSchema), async (req: Request, res: Response) => {
    const data = await customerAuthController.signUp(req.body, req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(CREATED).send({ data, code: CREATED, message: success_msg.signupSuccessful });
});

/////////////////////// Mark account Verified ///////////////////////
router.post(p.check, schemaValidator(accountVerificationSchema), async (req: Request, res: Response) => {
    const data = await customerAuthController.checkAccount(req.body,req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(OK).send({ data, code: OK, message: data.isUser ? success_msg.accountExists : success_msg.noSuchAccountExist });
});

/////////////////////// User Login ///////////////////////
router.post(p.login, schemaValidator(logInSchema), async (req: Request, res: Response) => {
    const data = await customerAuthController.login(req.body, req.headers, req.ip);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(OK).send({ data, code: OK, message: success_msg.loginSuccessful });
});

/////////////////////// User Logout ///////////////////////
router.get(p.logout, async (req: Request, res: Response) => {
    const data = await customerAuthController.logOut(req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(OK).send({ data, code: OK, message: success_msg.logOutSuccessful });
});

// Export default
export default router;
