import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import vendorGalleryController from '@controllers/vendor/gallery';
import schemaValidator from '@utils/schemaValidator';
import {gallerySchema} from '@validators/vendor/menuItems';
import { success } from '@constants';
import { verifyAuthToken, checkRole } from "@utils/authValidator";
import upload from '@utils/multer';
const _ = require('lodash');


// Constants
const router = Router();
const { CREATED, OK } = StatusCodes;

// Paths
export const p = {
    addImage:'/add',
    updateImage:'/update/:id',
    ImageList:'/ImageList',
    delete_image:'/delete_image'
} as const;

/****Add image ****/
router.post(p.addImage,upload.single('image'),schemaValidator(gallerySchema), verifyAuthToken, checkRole(['Vendor']),async (req: any, res: Response) => {
    const data = await vendorGalleryController.addImage(req.body,req.user.id,req.file,req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(CREATED).send({ data, code: CREATED, message:success_msg.ImageAdd});
});

/****Update image ****/
router.put(p.updateImage,upload.fields([{name:'image',maxCount:1}]), verifyAuthToken, checkRole(['Vendor']),async (req: any, res: Response) => {
    const data = await vendorGalleryController.updateImage(req.params,req.user.id,req.files?.image,req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(CREATED).send({ data, code: CREATED, message:success_msg.ImageUpdate});
});

/****Image list ****/
router.get(p.ImageList, verifyAuthToken, checkRole(['Vendor']),async (req: any, res: Response) => {
    const data = await vendorGalleryController.ImageList(req.query,req.user.id,req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(OK).send({ data, code: OK, message:success_msg.recordFetched});
});

/****Delete Images ****/
router.delete(p.delete_image, verifyAuthToken, checkRole(['Vendor']),async (req: any, res: Response) => {
    const data = await vendorGalleryController.delete_image(req.body,req.user.id,req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(OK).send({ data, code: OK, message:success_msg.imageDelete});
});

// Export default
export default router;
 