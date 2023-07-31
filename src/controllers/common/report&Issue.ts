import { customerModel, messageModel, reportModel, vendorModel } from '@models/index';
import { errors } from '@constants';
import { CustomError } from '@utils/errors';
import { StatusCodes } from 'http-status-codes';
import { identityGenerator } from '@utils/helpers';
import { count } from 'console';
import moment from 'moment-timezone';
import { ObjectId } from 'mongodb';

// Add Message
function addMessage(userId: any, issueId: any, msg: any, sender: any, image1: any) {
    const ar_msg = '';
    if (image1 && msg) {

        var obj = {
            userId,
            issueId,
            msg,
            msgType: 'text',
            sender,
            date: moment().tz('Asia/Kolkata').format()
        };
        var obj1 = {
            userId,
            issueId,
            msg: image1[0].path,
            sender,
            msgType: 'image',
            date: moment().tz('Asia/Kolkata').format()
        };
        messageModel.create(obj);
        messageModel.create(obj1);
    } else if (image1) {
        var msgType = "image";
        var obj = {
            userId,
            issueId,
            msg: image1,
            msgType,
            sender,
            date: moment().tz('Asia/Kolkata').format()
        };
        messageModel.create(obj);
    } else {
        var msgType = "text";
        var obj = {
            userId,
            issueId,
            msg: msg,
            msgType,
            sender,
            date: moment().tz('Asia/Kolkata').format()
        };
        messageModel.create(obj);
    }
}

// Add Report
function addReport(body: any, userId: any, image: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const count = await reportModel.countDocuments();
            const issueId = identityGenerator(count, "RID");
            const obj = {
                ...body,
                userId,
                issueId,
                image: image ? image[0].path : ''
            };
            // if (body.role == 'Vendor') {
            //     obj.storeId = body.storeId
            // }

            addMessage(userId, issueId, body.description, body.role, image);
            const add = await reportModel.create(obj);
            resolve(add);
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}

// List of report
function reportList(query: any, userId: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { page = 1, perPage = 10, role, storeId } = query;
            if (!role) {
                reject(new CustomError("role required", StatusCodes.BAD_REQUEST));
            }
            let obj: any = {}
            if (role == 'Vendor') {
                obj = {
                    userId, role, storeId, isDelete: false
                }
            }else{
                obj = {
                    userId, role, isDelete: false 
    
                }
            }
            const reportList = await reportModel.find(obj).sort({ createdAt: -1 }).skip((page * perPage) - perPage).limit(perPage);
            resolve({ items: reportList });
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}

// List of report for Admin Pannel
function report_List(query: any, userId: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { ObjectId } = require('mongodb')
            const { page = 1, perPage = 10, search, sort = -1, sortName } = query;
            var array: any = []
            let condition: any = {
                isDelete: false,
                // status: "Pending"
            }
            if (sortName && sortName != '' && sortName != undefined && sortName != 'NaN') {
                if (sortName == "userName") {
                    var sortObj: any = {
                        $sort: { 'vendorDetails.ownerName': Number(sort) },
                    }
                } else {
                    var sortObj: any = {
                        $sort: { createdAt: Number(sort) }
                    }
                }
            } else {
                var sortObj: any = {
                    $sort: { createdAt: Number(sort) }
                }
            }
            if (search && search != '') {
                condition = {
                    ...condition,
                    $or: [
                        { 'vendorDetails.ownerName': { $regex: search, $options: 'i' } },
                        { 'vendor_storeDetails.phoneNumber': { $regex: search, $options: 'i' } },
                        { 'userDetails.phoneNumber': { $regex: search, $options: 'i' } },
                        { 'userDetails.name': { $regex: search, $options: 'i' } },
                        { 'userDetails.email': { $regex: search, $options: 'i' } },
                        { 'vendor_storeDetails.email': { $regex: search, $options: 'i' } }
                    ]
                }
            }
            const reportList = await reportModel.aggregate([
                {
                    $addFields: {
                        usId: { $toObjectId: "$userId" },
                    }
                },
                {
                    $lookup: {
                        localField: "usId",
                        foreignField: "_id",
                        from: 'vendors',
                        as: 'vendorDetails'
                    }
                },
                {
                    $lookup: {
                        localField: "storeId",
                        foreignField: "_id",
                        from: 'vendorstores',
                        as: 'vendor_storeDetails'
                    }
                },
                {
                    $lookup: {
                        localField: "usId",
                        foreignField: "_id",
                        from: 'customers',
                        as: 'userDetails'
                    }
                },
                { $match: condition },
                { $project: { 'vendorDetails._id': 1, 'userDetails._id': 1, 'vendorDetails.ownerName': 1, 'vendor_storeDetails.phoneNumber': 1, 'vendor_storeDetails.email': 1, 'userDetails.phoneNumber': 1, createdAt: 1, 'userDetails.name': 1, 'userDetails.email': 1, role: 1, status: 1, isDelete: 1 } },
                sortObj,
                { $skip: Number((page * perPage) - perPage) },
                { $limit: Number(perPage) }
            ])
            const count = await reportModel.aggregate([
                {
                    $addFields: {
                        usId: { $toObjectId: "$userId" },
                    }
                },
                {
                    $lookup: {
                        localField: "usId",
                        foreignField: "_id",
                        from: 'vendors',
                        as: 'vendorDetails'
                    }
                },
                {
                    $lookup: {
                        localField: "storeId",
                        foreignField: "_id",
                        from: 'vendorstores',
                        as: 'vendor_storeDetails'
                    }
                },
                {
                    $lookup: {
                        localField: "usId",
                        foreignField: "_id",
                        from: 'customers',
                        as: 'userDetails'
                    }
                },
                { $match: condition },
                { $count: 'total' }
            ])
            console.log(condition, "lpooii")
            // const count = await reportModel.count(condition)
            if (count.length) {
                var total: any = count[0].total
            } else {
                var total: any = 0
            }
            resolve({ items: reportList, Total: total })
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}

//View
function reportView(query: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { ObjectId } = require('mongodb')
            const { reportId } = query
            if (!reportId) {
                reject(new CustomError("reportId required", StatusCodes.BAD_REQUEST))
            }
            const details = await reportModel.aggregate([
                {
                    $addFields: {
                        usId: { $toObjectId: "$userId" },
                    }
                },
                {
                    $lookup: {
                        localField: "usId",
                        foreignField: "_id",
                        from: 'vendors',
                        as: 'vendorDetails'
                    }
                },
                {
                    $lookup: {
                        localField: "storeId",
                        foreignField: "_id",
                        from: 'vendorstores',
                        as: 'vendor_storeDetails'
                    }
                },
                {
                    $lookup: {
                        localField: "usId",
                        foreignField: "_id",
                        from: 'customers',
                        as: 'userDetails'
                    }
                },
                { $match: { _id: ObjectId(reportId) } },
                { $project: { 'vendorDetails.ownerName': 1, 'vendorDetails.phoneNumber': 1, 'userDetails.phoneNumber': 1, createdAt: 1, 'userDetails.name': 1, 'userDetails.email': 1, role: 1, status: 1, isDelete: 1, description: 1, image: 1, "vendor_storeDetails.email": 1 } },

            ])
            resolve(details)

        } catch (err) {
            reject(err)
        }
    })
}
//Delete Report
function deleteReport(query: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { reportId } = query
            if (!reportId) {
                reject(new CustomError("reportId required", StatusCodes.BAD_REQUEST))
            }
            const details = await reportModel.findOne({ _id: reportId });
            if (details) {
                await reportModel.updateOne({ _id: reportId }, { isDelete: true });
                resolve({ success: true })
            } else {
                reject(new CustomError(errors.en.noDatafound, StatusCodes.BAD_REQUEST))
            }
        } catch (err) {
            reject(err)
        }
    })
}

function update_statusReport(query: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { reportId } = query
            if (!reportId) {
                reject(new CustomError("reportId required", StatusCodes.BAD_REQUEST))
            }
            await reportModel.updateOne({ _id: reportId }, { status: 'Resolved' });
            resolve({ success: true })

        } catch (err) {
            reject(err)
        }
    })
}

//  unifonic
function unifonic(userId: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const lib = require('lib');
            const configuration = lib.Configuration;
            const controller = lib.WrapperController;
            // let appsid = '9mvfpGdBFfauEmCoaVwBq63wjUPpe2F5rSSoFufNsYU2';
            let appsid = 'tfp_F32EcNU5SvUqhxVinNiD6WxiH5hSx16cevBGTEHU7wZS_hk8H17uEHGu1';
            let msg = 'Test';
            let to = 8979012645;
            let sender = '9mvfpGdBFfauEmCoaVwBq63wjUPpe2F5rSSoFufNsYU2';
            let baseEncode = false;
            let encoding = 'GSM7';
            const promise = controller.createSendMessage(appsid, msg, to, sender, baseEncode, encoding);
            console.log(promise, "ananannanana");
            resolve(promise);
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}
export default {
    addReport,
    reportList,
    report_List,
    reportView,
    deleteReport,
    update_statusReport,
    unifonic
} as const;

//for seraching
// if (search && search != '') {
//     var obj: any = {
//         $or: [
//             { phoneNumber: { $regex: search, $options: 'i' } },
//             { ownerName: { $regex: search, $options: 'i' } },
//             // { email: { $regex: search, $options: 'i' } }
//         ]
//     }
//     var obj1: any = {
//         $or: [
//             { name: { $regex: search, $options: 'i' } },
//             { phoneNumber: { $regex: search, $options: 'i' } },
//             { email: { $regex: search, $options: 'i' } }
//         ]
//     }
//     var checkVendor = await vendorModel.find(obj, { _id: 1 });
//     var checkUser = await customerModel.find(obj1, { _id: 1 });
//     var merge = [...checkVendor, ...checkUser]
//     if (merge.length > 0) {
//         for (let i = 0; i < merge.length; i++) {
//             array.push((merge[i]._id).toString())
//         }
//         condition = {
//             ...condition,
//             userId: { $in: array }
//         }
//     } else {
//         condition = {
//             userId: { $in: array }
//         }
//     }
// }