import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import sub_adminController from '../../controllers/admin/sub_admin';
import schemaValidator from '../../utils/schemaValidator';
import { sub_AdminSchema,edit_sub_AdminSchema} from "../../validators/admin"
import { success } from '../../constants/index';
import { verifyAuthToken, checkRole } from "../../utils/authValidator";

// Constants
const router = Router();
const { CREATED, OK } = StatusCodes;

// Paths
export const p = {
    add:'/add_subAdmin',
    edit:'/edit_subAdmin',
    get:'/details/:id',
    updateStatus:'/updateStatus/:id',
    list:'/list'

} as const;
/**
 * Add sub_Admin
 */
 router.post(p.add,verifyAuthToken,checkRole(['Admin']),schemaValidator(sub_AdminSchema), async (req: any, res: Response) => {
    const data = await sub_adminController.add_subAdmin(req.body,req.user.id);
    return res.status(CREATED).send({ data, code: CREATED, message:success.en.success});
});
/**
 * Edit sub_Admin
 */
 router.put(p.edit,verifyAuthToken,checkRole(['Admin']),schemaValidator(edit_sub_AdminSchema), async (req: any, res: Response) => {
    const data = await sub_adminController.edit_subAdmin(req.body);
    return res.status(OK).send({ data, code: OK, message:success.en.success});
});
/**
 *details sub_Admin
 */
 router.get(p.get,verifyAuthToken,checkRole(['Admin']), async (req: any, res: Response) => {
    const data = await sub_adminController.details(req.params.id);
    return res.status(OK).send({ data, code: OK, message:success.en.recordFetched});
});
/**
* updateStatus sub_Admin
*/
router.get(p.updateStatus,verifyAuthToken,checkRole(['Admin']), async (req: any, res: Response) => {
   const data = await sub_adminController.updateStatus(req.params.id);
   return res.status(OK).send({ data, code: OK, message:success.en.updateStatus});
});
/**
* list sub_Admin
*/
router.get(p.list,verifyAuthToken,checkRole(['Admin']), async (req: any, res: Response) => {
   const data = await sub_adminController.list(req.query);
   return res.status(OK).send({ data, code: OK, message:success.en.recordFetched});
});

// Export default
export default router;