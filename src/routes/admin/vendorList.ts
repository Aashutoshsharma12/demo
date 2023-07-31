import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import vendorListController from '../../controllers/admin/vendorList';
import schemaValidator from '../../utils/schemaValidator';
import { success } from '../../constants/index';
import { verifyAuthToken, checkRole } from "../../utils/authValidator";
import upload from '@utils/multer';
import { Add_VendorSchema, Edit_VendorSchema } from '@validators/admin';


// Constants
const router = Router();
const { CREATED, OK } = StatusCodes;

// Paths
export const p = {
    list:'/list',
    updateStatus:'/updateStatus',
    update:'/update',
    addVendor:'/addVendor',
    editVendor:'/editVendor',
    details:'/details/:id',
    vendorDetails:'/vendorDetails/:id',
    rating_list:'/rating_list'



} as const;

/**
 * Vendor list
 */
 router.get(p.list, verifyAuthToken, checkRole(['Admin']), async (req: any, res: Response) => {
    const data = await vendorListController.vendor_list(req.query);
    return res.status(OK).send({ data, code: OK, message:success.en.recordFetched});
});
/**
 *  Active Deactive Vendor 
 */
 router.put(p.updateStatus, verifyAuthToken, checkRole(['Admin']), async (req: any, res: Response) => {
    const data = await vendorListController.updateStatus(req.query);
    return res.status(OK).send({ data, code: OK, message:success.en.success});
});
/**
 *  Approved Rejected  Vendor 
 */
 router.put(p.update, verifyAuthToken, checkRole(['Admin']), async (req: any, res: Response) => {
    const data = await vendorListController.update(req.query,req.headers);
    return res.status(OK).send({ data, code: OK, message:success.en.success});
});
/**
 *  Add  Vendor 
 */
 router.post(p.addVendor,upload.fields([{name:"image",maxCount:1}]), verifyAuthToken, checkRole(['Admin']),schemaValidator(Add_VendorSchema), async (req: any, res: Response) => {
    const data = await vendorListController.addVendor(req.body,req.files?.image,req.headers);
    return res.status(CREATED).send({ data, code: CREATED, message:success.en.success});
});
/**
 *  Edit  Vendor 
 */
 router.put(p.editVendor,upload.fields([{name:"image",maxCount:1}]), verifyAuthToken, checkRole(['Admin']),schemaValidator(Edit_VendorSchema), async (req: any, res: Response) => {
    const data = await vendorListController.editVendor(req.body,req.files?.image);
    return res.status(CREATED).send({ data, code: CREATED, message:success.en.success});
});
/**
 * deatials  Vendor 
 */
 router.get(p.details,upload.fields([{name:"image",maxCount:1}]), verifyAuthToken, checkRole(['Admin']), async (req: any, res: Response) => {
    const data = await vendorListController.details(req.params.id);
    return res.status(CREATED).send({ data, code: CREATED, message:success.en.success});
});

/**
 *  Vendor view 
 */
 router.get(p.vendorDetails, verifyAuthToken, checkRole(['Admin']), async (req: any, res: Response) => {
    const data = await vendorListController.vendorDetails(req.params.id);
    return res.status(OK).send({ data, code: OK, message:success.en.success});
});
/**
 *  Vendor store rating list 
 */
 router.get(p.rating_list, verifyAuthToken, checkRole(['Admin']), async (req: any, res: Response) => {
    const data = await vendorListController.rating_list(req.query);
    return res.status(OK).send({ data, code: OK, message:success.en.recordFetched});
});


// Export default
export default router;