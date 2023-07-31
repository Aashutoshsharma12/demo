import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import foodCategoryController from '../../controllers/admin/foodCategory';
import schemaValidator from '../../utils/schemaValidator';
import { categorySchema} from "../../validators/admin"
import { success } from '../../constants/index';
import { verifyAuthToken, checkRole } from "../../utils/authValidator";


// Constants
const router = Router();
const { CREATED, OK } = StatusCodes;

// Paths
export const p = {
    add:'/add'

} as const;

/**
 * Add address
 */
 router.post(p.add, verifyAuthToken, checkRole(['Admin']),schemaValidator(categorySchema), async (req: any, res: Response) => {
    const data = await foodCategoryController.add_foodCategory(req.body, req.user.id);
    return res.status(OK).send({ data, code: OK, message: success.en.addCategory});
});


// Export default
export default router;
