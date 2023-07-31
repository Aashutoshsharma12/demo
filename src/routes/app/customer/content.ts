import { StatusCodes } from "http-status-codes";
import { Request, Response, Router } from "express";
import contentController from "@controllers/customer/content";
import { success } from "@constants";
import { verifyAuthToken, checkRole } from "@utils/authValidator";
const _ = require("lodash")

const router = Router();
const { CREATED, OK } = StatusCodes;

export const content = {
    list: '/cuisinee-list',
    foodCatList: '/foodCategory-list',
    filter: '/search-filter'
} as const;


/////////////////////// categoryList ///////////////////////
router.get(content.list, verifyAuthToken, checkRole(['Customer']), async (req: any, res: Response) => {
    const data = await contentController.cuisineeList(req.query,req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(OK).send({ data, code: OK, message: success_msg.success });
});

/////////////////////// foodCategoryList ///////////////////////
router.get(content.foodCatList, verifyAuthToken, checkRole(['Customer']), async (req: any, res: Response) => {
    const data = await contentController.foodCategoryList(req.query,req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(OK).send({data, code: OK, message: success_msg.success});
})

/////////////////////// searchFilter ///////////////////////
router.get(content.filter, verifyAuthToken, checkRole(['Customer']), async (req: any, res:Response) => {
    const data = await contentController.searchFilter(req.query,req.headers);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(OK).send({data, code: OK, message: success_msg.success});
});



export default router;