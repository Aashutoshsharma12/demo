import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import cuisineController from '../../controllers/admin/cuisineCategory';
import schemaValidator from '../../utils/schemaValidator';
import {addCuisine} from '@validators/admin'
import { categorySchema,editCuisine} from "../../validators/admin"
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
    get:'/get',
    list:'/list',
    updateStatus:'/updateStatus',
    delete:'/delete'

} as const;

/**
 * Add Category
 */
 router.post(p.add,upload.fields([{name:"image",maxCount:1}]), verifyAuthToken, checkRole(['Admin']),schemaValidator(addCuisine), async (req: any, res: Response) => {
    const data = await cuisineController.add_cusineCategory(req.body, req.user.id,req.files?.image);
    return res.status(OK).send({ data, code: OK, message: "Success"});
});
/**
 * Edit Category
 */
 router.post(p.edit,upload.fields([{name:"image",maxCount:1}]), verifyAuthToken, checkRole(['Admin']),schemaValidator(editCuisine), async (req: any, res: Response) => {
    const data = await cuisineController.edit_cusineCategory(req.body, req.user.id,req.files?.image);
    return res.status(OK).send({ data, code: OK, message: "Success"});
});
/**
 * get Category
 */
 router.get(p.get, verifyAuthToken, checkRole(['Admin']), async (req: any, res: Response) => {
    const data = await cuisineController.getDetails(req.query);
    return res.status(OK).send({ data, code: OK, message: "Success"});
});
/**
*Category List
*/
 router.get(p.list,verifyAuthToken, checkRole(['Admin']), async (req: any, res: Response) => {
    const data = await cuisineController.list_Category(req.query);
    return res.status(OK).send({ data, code: OK, message: "Success"});
});
/**
 * update status
 */
 router.get(p.updateStatus,verifyAuthToken, checkRole(['Admin']), async (req: any, res: Response) => {
    const data = await cuisineController.updateStatus(req.query);
    return res.status(OK).send({ data, code: OK, message: "Success"});
});
/**
 * delete Category
 */
 router.delete(p.delete,verifyAuthToken, checkRole(['Admin']), async (req: any, res: Response) => {
    const data = await cuisineController.deleteCategory(req.query);
    return res.status(OK).send({ data, code: OK, message: "Success"});
});


// Export default
export default router;