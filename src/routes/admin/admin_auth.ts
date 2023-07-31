import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import adminController from '../../controllers/admin/auth';
import schemaValidator from '../../utils/schemaValidator';
import { admin_authSchema,admin_loginSchema,admin_passowrdSchema} from "../../validators/admin"
import { success } from '../../constants/index';
import { verifyAuthToken, checkRole } from "../../utils/authValidator";

// Constants
const router = Router();
const { CREATED, OK } = StatusCodes;

// Paths
export const p = {
    add:'/signUp',
    login:'/login',
    changePassword:'/changePassword',
    logout:'/logout',
    details:'/details'


} as const;

/**
 * Admin registered SignUp
 */
 router.post(p.add,schemaValidator(admin_authSchema), async (req: any, res: Response) => {
    const data = await adminController.registerAdmin(req.body);
    return res.status(CREATED).send({ data, code: CREATED, message:success.en.success});
});
/**
 * Admin login
 */
 router.post(p.login,schemaValidator(admin_loginSchema), async (req: any, res: Response) => {
    const data = await adminController.login(req.body,req.headers);
    return res.status(OK).send({ data, code: OK,message:success.en.success});
});
/**
 * Change Password
 */
 router.post(p.changePassword,verifyAuthToken,checkRole(['Admin']),schemaValidator(admin_passowrdSchema), async (req: any, res: Response) => {
    const data = await adminController.changePassword(req.body,req.user.id);
    return res.status(OK).send({ data, code: OK,message:success.en.success});
});
/**
 *logout
 */
 router.get(p.logout,verifyAuthToken,checkRole(['Admin']), async (req: any, res: Response) => {
    const data = await adminController.logout(req.headers);
    return res.status(OK).send({ data, code: OK,message:success.en.success});
});
/**
 *details
 */
 router.get(p.details,verifyAuthToken,checkRole(['Admin']), async (req: any, res: Response) => {
    const data = await adminController.details(req.user.id);
    return res.status(OK).send({ data, code: OK,message:success.en.recordFetched});
});


// Export default
export default router;