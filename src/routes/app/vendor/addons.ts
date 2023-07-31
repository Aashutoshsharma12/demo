import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import vendorAddonsController from '@controllers/vendor/addons';
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
    list:'/list',
    updateStatus:'/update/:id',
    delete_Addons:'/delete_Addons/:id'

} as const;


router.post(p.add, verifyAuthToken, checkRole(['Vendor']),schemaValidator(addonsSchema),async (req: any, res: Response) => {
    const data = await vendorAddonsController.addAddons(req.body,req.user.id,req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(CREATED).send({ data, code: CREATED, message:success_msg.addonsAdd});
});

/****edit addons ****/
router.put(p.edit, verifyAuthToken, checkRole(['Vendor']),schemaValidator(addonsSchema),async (req: any, res: Response) => {
    const data = await vendorAddonsController.editAddons(req.body,req.params,req.user.id,req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(CREATED).send({ data, code: CREATED, message:success_msg.addonsEdit});
});

/****get addons ****/
router.get(p.get, verifyAuthToken, checkRole(['Vendor']),async (req: any, res: Response) => {
    const data = await vendorAddonsController.getAddons(req.params,req.user.id,req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(OK).send({ data, code: OK, message:success_msg.recordFetched});
});

/***** Addons list ****/
router.get(p.list, verifyAuthToken, checkRole(['Vendor']),async (req: any, res: Response) => {
    const data = await vendorAddonsController.listOfAddons(req.query,req.user.id,req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(OK).send({ data, code: OK, message:success_msg.recordFetched});
});

/***** update status Active Deactive ****/
router.get(p.updateStatus, verifyAuthToken, checkRole(['Vendor']),async (req: any, res: Response) => {
    const data = await vendorAddonsController.updateStatus(req.params,req.query,req.user.id,req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(OK).send({ data, code: OK, message:success_msg.addonsEdit});
});
/***** Delete Addons ****/
router.delete(p.delete_Addons, verifyAuthToken, checkRole(['Vendor']),async (req: any, res: Response) => {
    const data = await vendorAddonsController.delete_addons(req.params.id,req.user.id,req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(OK).send({ data, code: OK, message:success_msg.addondelete});
});


// Export default
export default router;
