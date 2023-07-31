import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import admin_taxController from '../../controllers/admin/admin_taxes';
import { success } from '../../constants/index';
import { verifyAuthToken, checkRole } from "../../utils/authValidator";

// Constants
const router = Router();
const { CREATED, OK } = StatusCodes;

// Paths
export const p = {
    add:'/add',
    get:'/get'
} as const;

/**
 * add and update taxes
 */
 router.post(p.add,verifyAuthToken,checkRole(['Admin']), async (req: any, res: Response) => {
    const data = await admin_taxController.addTax(req.body);
    return res.status(CREATED).send({ data, code: CREATED, message:success.en.success});
});
/**
 * taxes details
 */
 router.get(p.get,verifyAuthToken,checkRole(['Admin']), async (req: any, res: Response) => {
    const data = await admin_taxController.details();
    return res.status(OK).send({ data, code: OK,message:success.en.success});
});
// Export default
export default router;