import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import vendorStoreController from '@controllers/vendor/vendor_store';
import schemaValidator from '@utils/schemaValidator';
import {addStoreSchema,addBranchSchema} from '@validators/vendor/add_store';
import { success } from '@constants';
import { verifyAuthToken, checkRole } from "@utils/authValidator";
const _ = require('lodash');

// Constants
const router = Router();
const { CREATED, OK } = StatusCodes;

// Paths
export const p = {
    list:'/list',
    add:'/add', // Main branch with store type
    add_branch:'/add_branch',
    editBranch:'/editBranch',
    branchDetails:'/branchDetails/:id',
    listOf_branch:'/listOf_branch',
    update_status:'/update_status',
    delete_branch:'/delete_branch/:id'


} as const;


/**** store List ****/
router.get(p.list, verifyAuthToken, checkRole(['Vendor']),async (req: any, res: Response) => {
    const data = await vendorStoreController.listOf_storeType(req.query,req.user.id,req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(OK).send({ data, code: OK, message:success_msg.recordFetched});
});

/**** add store for vendor ****/
router.post(p.add, verifyAuthToken, checkRole(['Vendor']),schemaValidator(addStoreSchema),async (req: any, res: Response) => {
    const data = await vendorStoreController.addStore(req.body,req.user.id,req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(CREATED).send({ data, code: CREATED, message:success_msg.storeAdd});
});

/**** add Branch ****/
router.post(p.add_branch, verifyAuthToken, checkRole(['Vendor']),schemaValidator(addBranchSchema),async (req: any, res: Response) => {
    const data = await vendorStoreController.add_branch(req.body,req.user.id,req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(CREATED).send({ data, code: CREATED, message:success_msg.branchAdd});
});

/**** edit Branch ****/
router.put(p.editBranch, verifyAuthToken, checkRole(['Vendor']),schemaValidator(addBranchSchema),async (req: any, res: Response) => {
    const data = await vendorStoreController.editBranch(req.query,req.body,req.user.id,req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(CREATED).send({ data, code: CREATED, message:success_msg.branchEdit});
});

/**** Branch Details ****/
router.get(p.branchDetails, verifyAuthToken, checkRole(['Vendor']),async (req: any, res: Response) => {
    const data = await vendorStoreController.branchDetails(req.params,req.user.id,req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(OK).send({ data, code: OK, message:success_msg.recordFetched});
});

/**** list of Branchs ****/
router.get(p.listOf_branch, verifyAuthToken, checkRole(['Vendor']),async (req: any, res: Response) => {
    const data = await vendorStoreController.listOf_branch(req.query,req.user.id,req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(OK).send({ data, code: OK, message:success_msg.recordFetched});
});

/**** update_status(Active Deactive) ****/
router.get(p.update_status, verifyAuthToken, checkRole(['Vendor']),async (req: any, res: Response) => {
    const data = await vendorStoreController.update_status(req.query,req.user.id,req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(OK).send({ data, code: OK, message:success_msg.branchstatus});
});

/**** Delete branchs ****/
router.delete(p.delete_branch, verifyAuthToken, checkRole(['Vendor']),async (req: any, res: Response) => {
    const data = await vendorStoreController.delete_branch(req.params,req.user.id,req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(OK).send({ data, code: OK, message:success_msg.branchDelete});
});

// Export default
export default router;