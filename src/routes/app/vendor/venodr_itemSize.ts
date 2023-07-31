import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import vendorItemSizeController from '@controllers/vendor/vendor_itemSize';
import schemaValidator from '@utils/schemaValidator';
import { success } from '@constants';
import {menuItem_sizeSchema} from '../../../validators/vendor/menuItems'
import { verifyAuthToken, checkRole } from "@utils/authValidator";
import upload  from "@utils/multer";
const _ = require('lodash')


// Constants
const router = Router();
const { CREATED, OK } = StatusCodes;

// Paths
export const p = {
    add: '/add',
    edit:'/edit',
    get:'/get',
    update:'/update',
    list:'/list',
    delete_itemSize:'/delete_itemSize/:id'
} as const;

/*** add Menu Item_size */
router.post(p.add, verifyAuthToken,schemaValidator(menuItem_sizeSchema), async (req: any, res: Response) => {
    const data = await vendorItemSizeController.addItem_size(req.body, req.user.id,req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(CREATED).send({ data, code: CREATED, message: success_msg.AddItem_size });
});

/*** edit Menu Item_size */
router.put(p.edit,schemaValidator(menuItem_sizeSchema), verifyAuthToken,schemaValidator(menuItem_sizeSchema), async (req: any, res: Response) => {
    const data = await vendorItemSizeController.edit(req.query,req.body,req.user.id,req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(CREATED).send({ data, code: CREATED, message: success_msg.updItemSize });
});

/*** get Menu Item_size */
router.get(p.get,verifyAuthToken, async (req: any, res: Response) => {
    const data = await vendorItemSizeController.getItemSize(req.query,req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(OK).send({ data, code: OK, message: success_msg.recordFetched });
});

/*** Update status */
router.get(p.update,verifyAuthToken, async (req: any, res: Response) => {
    const data = await vendorItemSizeController.updateStatus(req.query,req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(OK).send({ data, code: OK, message: success_msg.updItemSize });
});

/*** list of Item_size */
router.get(p.list,verifyAuthToken, async (req: any, res: Response) => {
    const data = await vendorItemSizeController.item_sizeList(req.query,req.user.id,req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(OK).send({ data, code: OK, message: success_msg.recordFetched });
});
/*** delete Item_size */
router.delete(p.delete_itemSize,verifyAuthToken, async (req: any, res: Response) => {
    const data = await vendorItemSizeController.delete_itemSize(req.params.id,req.user.id,req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(OK).send({ data, code: OK, message: success_msg.itemSizeDelete });
});

export default router;