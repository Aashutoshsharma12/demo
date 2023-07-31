import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import addressController from '@controllers/customer/address';
import schemaValidator from '@utils/schemaValidator';
import { addressSchema } from "@validators/address"
import { success } from "@constants";
import { verifyAuthToken, checkRole } from "@utils/authValidator";

// Constants
const router = Router();
const { CREATED, OK } = StatusCodes;

// Paths
export const p = {
    add: '/add',
    getAddress: '/get'

} as const;

/////////////////////// Add address ///////////////////////
router.post(p.add, verifyAuthToken, checkRole(['Customer']), schemaValidator(addressSchema), async (req: any, res: Response) => {
    const data = await addressController.addAddress(req.body, req.user.id,req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(OK).send({ data, code: OK, message: success_msg.addressAdded });
});

/////////////////////// get Address ///////////////////////
router.get(p.getAddress, verifyAuthToken, checkRole(['Customer']), async (req: any, res: Response) => {
    const data = await addressController.getAddress(req.user.id,req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(OK).send({ data, code: OK, message: success_msg.gotLatestAddress });
});

// Export default
export default router;
