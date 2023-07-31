import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import itemCategoryController from '../../controllers/admin/ItemCategory';
import schemaValidator from '../../utils/schemaValidator';
import { categorySchema,edit_categorySchema} from "../../validators/admin"
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
    delete_subCategory:'/delete_subCategory',
    vendor_categoryList:'/vendor_categoryList'
} as const;

/**
 * Add sub_Category
 */
 router.post(p.add,upload.fields([{name:'image',maxCount:1}]), verifyAuthToken, checkRole(['Admin']),schemaValidator(categorySchema), async (req: any, res: Response) => {
    const data = await itemCategoryController.add_itemCategory(req.body, req.user.id,req.files?.image);
    return res.status(CREATED).send({ data, code: CREATED, message: success.en.addCategory});
});
/**
 * Edit sub_Category
 */
 router.put(p.edit,upload.fields([{name:'image',maxCount:1}]), verifyAuthToken, checkRole(['Admin']),schemaValidator(edit_categorySchema), async (req: any, res: Response) => {
    const data = await itemCategoryController.edit_itemCategory(req.body, req.user.id,req.files?.image);
    return res.status(OK).send({ data, code: OK, message: success.en.success});
});
/**
 * List sub_Category
 */
 router.get(p.list, verifyAuthToken, checkRole(['Admin']), async (req: any, res: Response) => {
    const data = await itemCategoryController.list_Sub_Category(req.query);
    return res.status(OK).send({ data, code: OK, message: success.en.success});
});
/**
 * Details sub_Category
 */
 router.get(p.getDetails, verifyAuthToken, checkRole(['Admin']), async (req: any, res: Response) => {
    const data = await itemCategoryController.getDetails(req.query);
    return res.status(OK).send({ data, code: OK, message: success.en.success});
});/**
* updateStatus sub_Category
*/
router.get(p.updateStatus, verifyAuthToken, checkRole(['Admin']), async (req: any, res: Response) => {
   const data = await itemCategoryController.updateStatus(req.query);
   return res.status(OK).send({ data, code: OK, message: success.en.success});
});/**
* Delete sub_Category
*/
router.get(p.delete_subCategory, verifyAuthToken, checkRole(['Admin']), async (req: any, res: Response) => {
   const data = await itemCategoryController.delete_subCategory(req.query);
   return res.status(OK).send({ data, code: OK, message: success.en.success});
});
/**
vendor category list */
 router.get(p.vendor_categoryList, verifyAuthToken, checkRole(['Admin']), async (req: any, res: Response) => {
   const data = await itemCategoryController.vendor_item_Categories(req.query,req.headers);
   return res.status(OK).send({ data, code: OK, message: success.en.recordFetched});
});



// Export default
export default router;