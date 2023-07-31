import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import parkingController from '../../controllers/admin/parking';
import schemaValidator from '../../utils/schemaValidator';
import { admin_authSchema,admin_loginSchema,admin_passowrdSchema} from "../../validators/admin"
import { success } from '../../constants/index';
import { verifyAuthToken, checkRole } from "../../utils/authValidator";

// Constants
const router = Router();
const { CREATED, OK } = StatusCodes;

// Paths
export const p = {
    add:'/add-parking',
    list:'/list'
} as const;

/**
 * add Parking
 */
 router.post(p.add,verifyAuthToken,checkRole(['Admin']), async (req: any, res: Response) => {
    const data = await parkingController.add_parking(req.body);
    return res.status(CREATED).send({ data, code: CREATED, message:success.en.success});
});
/**
 * parking list
 */
 router.get(p.list,verifyAuthToken,checkRole(['Admin']), async (req: any, res: Response) => {
    const data = await parkingController.parking_list(req.query);
    return res.status(OK).send({ data, code: OK, message:success.en.recordFetched});
});
// Export default
export default router;