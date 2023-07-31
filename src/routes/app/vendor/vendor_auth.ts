import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import vendorAuthController from '@controllers/vendor/auth';
import schemaValidator from '@utils/schemaValidator';
import { signUpSchema,accountVerificationSchema,logInSchema,otpVerificationSchema,resetPasswordSchema,changePasswordSchema} from "@validators/vendor/auth"
import { success } from '@constants';
import { verifyAuthToken, checkRole } from "@utils/authValidator";
const _ = require('lodash');


// Constants
const router = Router();
const { CREATED, OK } = StatusCodes;

// Paths
export const p = {
    login: '/login',
    signUp: '/sign-up',
    check: '/check-account',
    otpVerify:'/otpVerify',
    resetPassword:'/resetPassword',
    changePassword:'/changePassword',
    logout: '/logout'

} as const;

/*** User SignUp */
router.post(p.signUp, schemaValidator(signUpSchema), async (req: Request, res: Response) => {
    const data = await vendorAuthController.signUp(req.body,req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(CREATED).send({ data, code: CREATED, message: success_msg.signupSuccessful});
});

/*** Mark account Verified */
router.post(p.check, schemaValidator(accountVerificationSchema), async (req: Request, res: Response) => {
    const data = await vendorAuthController.checkAccount(req.body,req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(OK).send({ data, code: OK, message: data.isUser ? success_msg.accountExists: success_msg.noSuchAccountExist });
});

/*** User Login */
router.post(p.login, schemaValidator(logInSchema), async (req: Request, res: Response) => {
    const data = await vendorAuthController.login(req.body, req.headers, req.ip);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(OK).send({ data, code: OK, message: success_msg.loginSuccessful });
});

/*** verify Otp */
router.post(p.otpVerify,schemaValidator(otpVerificationSchema), async (req: Request, res: Response) => {
    const data = await vendorAuthController.otp_verification(req.body,req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(OK).send({ data, code: OK, message: success_msg.success });
});

/**** reset Password ****/
router.put(p.resetPassword, schemaValidator(resetPasswordSchema), async (req: Request, res: Response) => {
    const data = await vendorAuthController.resetPassword(req.body,req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(OK).send({ data, code: OK,message:success_msg.success });
});

/**** change Password  ****/
router.put(p.changePassword, verifyAuthToken, checkRole(['Vendor']), schemaValidator(changePasswordSchema), async (req: any, res: Response) => {
    const data = await vendorAuthController.changePassword(req.body,req.user.id,req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(OK).send({ data, code: OK, message:success_msg.updatePassword});
});

/*** User Logout */
router.get(p.logout, async (req: Request, res: Response) => {
    const data = await vendorAuthController.logOut(req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(OK).send({ data, code: OK, message: success_msg.logOutSuccessful });
});

// Export default
export default router;
