import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import notificationController from '@controllers/vendor/notification';
import { success } from "@constants";
import { verifyAuthToken, checkRole } from "@utils/authValidator";

// Constants
const router = Router();
const { CREATED, OK } = StatusCodes;

// Paths
export const p = {
    update: '/update_status',
    get: '/get',
    list: '/list'
} as const;

/////////////////////// update_status ///////////////////////
router.post(p.update, verifyAuthToken, checkRole(['Vendor']), async (req: any, res: Response) => {
    const data = await notificationController.update_notification_status(req.query, req.user.id, req.headers);
    var success_msg = success.en;
    if (req.headers.language == 'ar') {
        var success_msg = success.ar;
    }
    return res.status(OK).send({ data, code: OK, message: success_msg.updateStatus });
});

/////////////////////// get status ///////////////////////
router.get(p.get, verifyAuthToken, checkRole(['Vendor']), async (req: any, res: Response) => {
    const data = await notificationController.notification_status(req.user.id, req.headers);
    var success_msg = success.en;
    if (req.headers.language == 'ar') {
        var success_msg = success.ar;
    }
    return res.status(OK).send({ data, code: OK, message: success_msg.success });
});

/////////////////////// Notification list ///////////////////////
router.get(p.list, verifyAuthToken, checkRole(['Vendor']), async (req: any, res: Response) => {
    const data = await notificationController.notification_list(req.query, req.user.id, req.headers);
    var success_msg = success.en;
    if (req.headers.language == 'ar') {
        var success_msg = success.ar;
    }
    return res.status(OK).send({ data, code: OK, message: success_msg.recordFetched });
});

// Export default
export default router;
