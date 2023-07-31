import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import paymentController from '../../controllers/admin/payment';
import schemaValidator from '../../utils/schemaValidator';
import { admin_authSchema,admin_loginSchema,admin_passowrdSchema} from "../../validators/admin"
import { success } from '../../constants/index';
import { verifyAuthToken, checkRole } from "../../utils/authValidator";

// Constants
const router = Router();
const { CREATED, OK } = StatusCodes;

// Paths
export const p = {
    paymentList:'/list'
} as const;

/**
 * Admin registered SignUp
 */
 router.get(p.paymentList,verifyAuthToken, async (req: any, res: Response) => {
    const data = await paymentController.paymentlist_list(req.query);
    return res.status(CREATED).send({ data, code: CREATED, message:success.en.success});
});


// Export default
export default router;