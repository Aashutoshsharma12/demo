import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import doorKepperParkingController from '../../../controllers/door_Keeper/parking';
import schemaValidator from '../../../utils/schemaValidator';
import { success } from '../../../constants/index';
import { verifyAuthToken, checkRole } from "../../../utils/authValidator";

// Constants
const router = Router();
const { CREATED, OK } = StatusCodes;

// Paths
export const p = {
    parking:'/parking'
} as const;

/**
 * provide Parking to customer
 */
 router.post(p.parking,verifyAuthToken,checkRole(['DoorKeeper']), async (req: any, res: Response) => {
    const data = await doorKepperParkingController.provide_parking(req.body,req.user.id,req.headers);
    return res.status(CREATED).send({ data, code: CREATED, message:success.en.success});
});

// Export default
export default router;