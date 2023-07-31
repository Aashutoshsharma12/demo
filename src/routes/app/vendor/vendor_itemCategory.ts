import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import vendor_itemCategoryController from '@controllers/vendor/vendor_itemCategory';
import schemaValidator from '@utils/schemaValidator';
import { categorySchema,edit_categorySchema} from "@validators/vendor/add_store"
import { success } from '@constants';
import { verifyAuthToken, checkRole } from "@utils/authValidator";
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
    delete_category:'/delete_category'
} as const;

/**
 * Add sub_Category
 */
 router.post(p.add,upload.single('image'), verifyAuthToken, checkRole(['Vendor']),schemaValidator(categorySchema), async (req: any, res: Response) => {
    const data = await vendor_itemCategoryController.add_itemCategory(req.body, req.user.id,req.file,req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(CREATED).send({ data, code: CREATED, message: success_msg.addCategory});
});
/**
 * Edit sub_Category
 */
 router.put(p.edit,upload.fields([{name:'image',maxCount:1}]), verifyAuthToken, checkRole(['Vendor']),schemaValidator(edit_categorySchema), async (req: any, res: Response) => {
    const data = await vendor_itemCategoryController.edit_itemCategory(req.body, req.user.id,req.files?.image,req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(OK).send({ data, code: OK, message: success_msg.success});
});
/**
 * List sub_Category
 */
 router.get(p.list, verifyAuthToken, checkRole(['Vendor']), async (req: any, res: Response) => {
    const data = await vendor_itemCategoryController.list_item_Category(req.query,req.user.id,req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(OK).send({ data, code: OK, message: success_msg.success});
});
/**
 * Details sub_Category
 */
 router.get(p.getDetails, verifyAuthToken, checkRole(['Vendor']), async (req: any, res: Response) => {
    const data = await vendor_itemCategoryController.getDetails(req.query,req.user.id,req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(OK).send({ data, code: OK, message: success_msg.success});
});/**
* updateStatus sub_Category
*/
router.get(p.updateStatus, verifyAuthToken, checkRole(['Vendor']), async (req: any, res: Response) => {
   const data = await vendor_itemCategoryController.updateStatus(req.query,req.headers);
   var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
   return res.status(OK).send({ data, code: OK, message: success_msg.success});
});/**
* Delete sub_Category
*/
router.get(p.delete_category, verifyAuthToken, checkRole(['Vendor']), async (req: any, res: Response) => {
   const data = await vendor_itemCategoryController.delete_category(req.query,req.headers);
   var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
   return res.status(OK).send({ data, code: OK, message: success_msg.success});
});


// Export default
export default router;