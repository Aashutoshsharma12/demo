import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import storeTypeController from '../../controllers/admin/storeType';
import schemaValidator from '../../utils/schemaValidator';
import { storeTypeSchema,editStoreTypeSchema,getstoreTypeSchema} from "../../validators/admin"
import { success } from '../../constants/index';
import { verifyAuthToken, checkRole } from "../../utils/authValidator";
import upload from '@utils/multer';

// Constants
const router = Router();
const { CREATED, OK } = StatusCodes;

// Paths
export const p = {
    add:'/add',
    edit:'/edit',
    list:'/list',
    getDetails:'/getDetails',
    updateStatus:'/updateStatus',
    deleteStore:'/deleteStore'

} as const;

/**
 * Add storeType
 */
 router.post(p.add,upload.fields([{name:"image",maxCount:1}]), verifyAuthToken, checkRole(['Admin']),schemaValidator(storeTypeSchema), async (req: any, res: Response) => {
    const data = await storeTypeController.add_storeType(req.body, req.user.id,req.files?.image);
    return res.status(CREATED).send({ data, code: CREATED, message:success.en.success});
});
/**
 * Edit storeType
 */
 router.put(p.edit,upload.fields([{name:'image',maxCounr:1}]), verifyAuthToken, checkRole(['Admin']),schemaValidator(editStoreTypeSchema), async (req: any, res: Response) => {
    const data = await storeTypeController.edit_storeType(req.body, req.user.id,req.files?.image);
    return res.status(OK).send({ data, code: OK, message:success.en.success});
});
/**
 * List
 */
 router.get(p.list, verifyAuthToken, checkRole(['Admin']), async (req: any, res: Response) => {
    const data = await storeTypeController.list_Category(req.query);
    return res.status(OK).send({ data, code: OK, message:success.en.success});
});
/**
 * get Details
 */
 router.get(p.getDetails, verifyAuthToken, checkRole(['Admin']), async (req: any, res: Response) => {
    const data = await storeTypeController.getDetails(req.query);
    return res.status(OK).send({ data, code: OK, message:success.en.success});
});
/**
 * update status
 */
 router.get(p.updateStatus, verifyAuthToken, checkRole(['Admin']), async (req: any, res: Response) => {
    const data = await storeTypeController.updateStatus(req.query);
    return res.status(OK).send({ data, code: OK, message:success.en.success});
});/**
* delete 
*/
router.get(p.deleteStore, verifyAuthToken, checkRole(['Admin']), async (req: any, res: Response) => {
   const data = await storeTypeController.deleteStore(req.query);
   return res.status(OK).send({ data, code: OK, message:success.en.success});
});

// Export default
export default router;