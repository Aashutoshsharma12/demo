import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import vendorAddonsTypeController from '@controllers/vendor/addons_type';
import schemaValidator from '@utils/schemaValidator';
import {addonsSchema} from '@validators/vendor/menuItems';
import { success } from '@constants';
import { verifyAuthToken, checkRole } from "@utils/authValidator";
const _ = require('lodash');


// Constants
const router = Router();
const { CREATED, OK } = StatusCodes;

// Paths
export const p = {
    add:'/add',
    edit:'/edit/:id',
    get:'/get/:id',
    list:'/list'

} as const;

/*** add Addons_type */
 router.post(p.add, verifyAuthToken, checkRole(['Vendor']),async (req: any, res: Response) => {
    const data = await vendorAddonsTypeController.addAddons_type(req.body,req.user.id,req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(CREATED).send({ data, code: CREATED, message:success_msg.addons_type});
});

/****edit addons_type ****/

 router.put(p.edit, verifyAuthToken, checkRole(['Vendor']),async (req: any, res: Response) => {
    const data = await vendorAddonsTypeController.editAddons_Type(req.query,req.params,req.user.id,req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(CREATED).send({ data, code: CREATED, message:success_msg.addons_typeEdit});
});

/****get addons_type ****/

 router.get(p.get, verifyAuthToken, checkRole(['Vendor']),async (req: any, res: Response) => {
    const data = await vendorAddonsTypeController.getAddons_Type(req.params,req.user.id,req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(OK).send({ data, code: OK, message:success_msg.recordFetched});
});

/***** Addons_type list ****/

router.get(p.list, verifyAuthToken, checkRole(['Vendor']),async (req: any, res: Response) => {
    const data = await vendorAddonsTypeController.listOfAddons_Type(req.query,req.user.id,req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(OK).send({ data, code: OK, message:success_msg.recordFetched});
});
// Export default
export default router;
