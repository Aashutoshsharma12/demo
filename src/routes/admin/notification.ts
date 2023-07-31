import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import notificationController from '@controllers/admin/notification';
import schemaValidator from '@utils/schemaValidator';
import { notificationSchema } from "@validators/admin";
import { verifyAuthToken, checkRole } from "@utils/authValidator";
import upload from '@utils/multer';
import { success } from '@constants';

// Constants
const router = Router();
const { CREATED, OK } = StatusCodes;

// Paths
export const p = {
    sendNotification: '/sendNotification',
    notificationList: '/adminSend-notificationList',
} as const;


/////////////////////// Send  Notification ///////////////////////
router.post(p.sendNotification, verifyAuthToken, checkRole(['Admin']), upload.single('image'), schemaValidator(notificationSchema), async (req: any, res: Response) => {
    const data = await notificationController.sendNotification(req.body, req.headers, req.file);
    return res.status(OK).send({ data, code: OK, message: success.en.success });
});

/////////////////////// Admin Notification List ///////////////////////
router.get(p.notificationList, verifyAuthToken, checkRole(['Admin']), async (req: Request, res: Response) => {
    const data = await notificationController.adminNotificationList(req.query);
    return res.status(OK).send({ data, code: OK, message: success.en.recordFetched });
});

// Export default
export default router;