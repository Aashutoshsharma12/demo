import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import vendorItemsController from '@controllers/vendor/vendor_menuItems';
import schemaValidator from '@utils/schemaValidator';
import { success } from '@constants';
import {menuItemsSchema,updateMenuItemsSchema} from '../../../validators/vendor/menuItems';
import { verifyAuthToken, checkRole } from "@utils/authValidator";
import upload  from "@utils/multer";
const _ = require('lodash');


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
    cusinecategoriesList:'/cusinecategoriesList',
    foodCategoryList:'/foodCategoryList',
    itemcategoriesList:'/itemcategoriesList',
    delete_items:'/delete_items/:id'

} as const;

/*** Add Menu Items */
router.post(p.add,upload.fields([{name:'image',maxCount:1}]), verifyAuthToken,schemaValidator(menuItemsSchema), async (req: any, res: Response) => {
    const data = await vendorItemsController.addItems(req.body, req.user.id,req.files.image[0].path,req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(CREATED).send({ data, code: CREATED, message: success_msg.ItemsAdd });
});

/*** Edit Menu Items */
router.put(p.edit,upload.fields([{name:'image',maxCount:1}]), verifyAuthToken,schemaValidator(updateMenuItemsSchema), async (req: any, res: Response) => {
    const data = await vendorItemsController.edit(req.query,req.body,req.user.id,req.files?.image,req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(CREATED).send({ data, code: CREATED, message: success_msg.ItemsUpda });
});

/*** Get Menu Items  */
router.get(p.get,verifyAuthToken, async (req: any, res: Response) => {
    const data = await vendorItemsController.getMenuItems(req.query,req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(OK).send({ data, code: OK, message: success_msg.recordFetched });
});

/*** Update status */
router.get(p.update,verifyAuthToken, async (req: any, res: Response) => {
    const data = await vendorItemsController.updateStatus(req.query,req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(OK).send({ data, code: OK, message: success_msg.ItemsUpda });
});

/*** list of Items */
router.get(p.list,verifyAuthToken, async (req: any, res: Response) => {
    const data = await vendorItemsController.itemsList(req.query,req.user.id,req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(OK).send({ data, code: OK, message: success_msg.recordFetched });
});

/*** list of cuisine */
router.get(p.cusinecategoriesList,verifyAuthToken, async (req: any, res: Response) => {
    const data = await vendorItemsController.cusinecategoriesList(req.query,req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(OK).send({ data, code: OK, message: success_msg.recordFetched });
});

/*** list of food category */
router.get(p.foodCategoryList,verifyAuthToken, async (req: any, res: Response) => {
   const data = await vendorItemsController.foodCategoryList(req.query,req.headers);
   var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
   return res.status(OK).send({ data, code: OK, message: success_msg.recordFetched });
});

/*** list of Item category */
router.get(p.itemcategoriesList,verifyAuthToken, async (req: any, res: Response) => {
   const data = await vendorItemsController.itemcategoriesList(req.query,req.user.id,req.headers);
   var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
   return res.status(OK).send({ data, code: OK, message: success_msg.recordFetched });
});
/*** delete Items */
router.delete(p.delete_items,verifyAuthToken, async (req: any, res: Response) => {
    const data = await vendorItemsController.delete_menuItems(req.params.id,req.user.id,req.headers);
    var success_msg = success.en;
     if(req.headers.language == 'ar'){
         var success_msg = success.ar;
     }
    return res.status(OK).send({ data, code: OK, message: success_msg.menuItemDelete });
 });

export default router;