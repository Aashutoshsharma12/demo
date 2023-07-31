import { StatusCodes } from "http-status-codes";
import { success } from "@constants";
import {Response,Router,Request} from 'express'
import schemaValidator from "@utils/schemaValidator";
import { addReportSchema} from "@validators/vendor/add_store";
import reportIssueController from "@controllers/common/report&Issue";
import { checkRole, verifyAuthToken } from "@utils/authValidator";
import upload from "@utils/multer";

//Constant
var router = Router();
const {CREATED,OK} = StatusCodes;

export const p = {
add:'/addReport',
reportList:'/list',
report_List:'/report_List',
delete:'/delete',
get:'/get',
update:'/update',
unifonic:'/unifonic'
} as const

/*** Add Reports*/
router.post(p.add,upload.fields([{name:"image",maxCount:1}]),schemaValidator(addReportSchema), verifyAuthToken,checkRole(['Vendor','Customer']),async (req: any, res: Response) => {
    const data = await reportIssueController.addReport(req.body,req.user.id,req.files?.image);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(CREATED).send({ data, code: CREATED, message:success_msg.issueReported});
});

/*** List of Report*/
router.get(p.reportList,verifyAuthToken,checkRole(['Vendor','Customer']),async(req:any,res:Response) =>{
    const data = await reportIssueController.reportList(req.query,req.user.id);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(OK).send({data,code:OK,message:success_msg.recordFetched});
});

/*** List of Report for Admin Pannel*/
 router.get(p.report_List,verifyAuthToken,checkRole(['Admin']),async(req:any,res:Response) =>{
    const data = await reportIssueController.report_List(req.query,req.user.id);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(OK).send({data,code:OK,message:success_msg.recordFetched});
});

/*** View Report for Admin Pannel*/
 router.get(p.get,verifyAuthToken,checkRole(['Admin']),async(req:any,res:Response) =>{
    const data = await reportIssueController.reportView(req.query);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(OK).send({data,code:OK,message:success_msg.recordFetched});
});

/*** Delete Report for Admin Pannel*/
 router.get(p.delete,verifyAuthToken,checkRole(['Admin']),async(req:any,res:Response) =>{
    const data = await reportIssueController.deleteReport(req.query);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(OK).send({data,code:OK,message:success_msg.success});
});
/*** update status Report for Admin Pannel*/
router.get(p.update,verifyAuthToken,checkRole(['Admin']),async(req:any,res:Response) =>{
    const data = await reportIssueController.update_statusReport(req.query);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(OK).send({data,code:OK,message:success_msg.success});
});

/*** unifonic*/
 router.get(p.unifonic,verifyAuthToken,async(req:any,res:Response) =>{
    const data = await reportIssueController.unifonic(req.user.id);
    var success_msg = success.en;
    if(req.headers.language == 'ar'){
        var success_msg = success.ar;
    }
    return res.status(OK).send({data,code:OK,message:success_msg.success});
});

export default router;