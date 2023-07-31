import { StatusCodes } from "http-status-codes";
import { errors } from "@constants";
import faqModel from "@models/faq";
import { CustomError } from "@utils/errors";

// faqList for App
function faqList(query: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { page = 1, perPage = 10, role } = query;
            const obj = {
                role:{$in:[role,'Both']},
                isDelete: false,
                isActive: true
            }
            if (!role) {
                reject(new CustomError("Role required", StatusCodes.BAD_REQUEST));
            } else {
                const list = await faqModel.find(obj).skip((page * perPage) - perPage).limit(perPage);
                resolve({ items: list });
            }
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
};

// Add Faq
function addFaq(body: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const Add = await faqModel.create(body);
            resolve(Add);
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}

// Edit Faq
function editFaq(body: any, query: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { faqId } = query;
            if (!faqId) {
                reject(new CustomError("faqId required", StatusCodes.BAD_REQUEST));
            } else {
                const checkFaq = await faqModel.findOne({ _id: faqId, isDelete: false });
                if (checkFaq) {
                    await faqModel.updateOne({ _id: faqId }, body);
                    resolve({ success: true });
                } else {
                    reject(new CustomError(errors.en.noDatafound, StatusCodes.BAD_REQUEST));
                }
            }
        } catch (err) {
            console.log(err);
            reject(err);
        }
    })
}

// faqList for Admin Pannel
function list_faq(query: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { page = 1, perPage = 10,sort, role, search } = query;

            let condition: any = {
                isDelete: false
            }
            if (search && search != '' && role && role != '') {
                condition = {
                    ...condition,
                    $or: [
                        { question: { $regex: search, $options: 'i' } },
                        { ar_question: { $regex: search, $options: 'i' } },
                        { answer: { $regex: search, $options: 'i' } },
                        { ar_answer: { $regex: search, $options: 'i' } },
                    ],
                    role: role
                }
            } else if (search && search != '') {
                condition = {
                    ...condition,
                    $or: [
                        { question: { $regex: search, $options: 'i' } },
                        { ar_question: { $regex: search, $options: 'i' } },
                        { answer: { $regex: search, $options: 'i' } },
                        { ar_answer: { $regex: search, $options: 'i' } },
                    ]
                }
            } else if (role && role != '') {
                condition = {
                    ...condition,
                    role: role
                }
            } else {
                condition = {
                    ...condition
                }
            }
            const totalCount = await faqModel.count(condition)
            const list = await faqModel.find(condition).sort({createdAt:sort}).skip((page * perPage) - perPage).limit(perPage);
            resolve({ items: list ,totalCount:totalCount});
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
};

// faq details
function details(query: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { faqId} = query;
            if (!faqId) {
                reject(new CustomError("faqId required", StatusCodes.BAD_REQUEST));
            } else {
                const details = await faqModel.findOne({ _id:faqId,isDelete:false }).sort({createdAt:-1});
                if(details){
                    resolve({ response: details });
                }else{
                    reject(new CustomError(errors.en.noDatafound,StatusCodes.BAD_REQUEST))
                }
            }
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
};
// faq delete
function delete_faq(query: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { faqId} = query;
            if (!faqId) {
                reject(new CustomError("faqId required", StatusCodes.BAD_REQUEST));
            } else {
                const details = await faqModel.findOne({ _id:faqId });
                if(details){
                    await faqModel.updateOne({_id:faqId},{isDelete:true});
                    resolve({success:true})
                }else{
                    reject(new CustomError(errors.en.noDatafound,StatusCodes.BAD_REQUEST))
                }
            }
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
};


export default {
    faqList,
    addFaq,
    editFaq,
    list_faq,
    details,
    delete_faq
} as const;