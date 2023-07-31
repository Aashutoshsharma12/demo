import { customerModel, customerOrderModel, reportModel, userSessionModel } from "../../models/index";
import { CustomError } from "@utils/errors";
import { StatusCodes } from "http-status-codes";
import { errors, fcm } from "@constants";
import { sendPushNotification } from "@utils/helpers";
const _ = require('lodash');

//user list
function userList(query: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { page = 1, pageSize = 10, sort1 = 1, sort, search, isActive } = query;
            let condition: any = {
                isDelete: false
            }
            if (sort && sort != '') {
                if (sort == "customerRCId") {
                    var obj: any = {
                        customerRCId: sort1
                    }
                }
                else {
                    var obj: any = {
                        createdAt: sort1
                    }
                }
            } else {
                var obj: any = {
                    createdAt: sort1
                }
            }
            if (search && search != '' && isActive == "true") {
                condition = {
                    ...condition,
                    $or: [
                        { customerRCId: { '$regex': search, "$options": 'i' } },
                        { name: { '$regex': search, "$options": 'i' } },
                        { email: { '$regex': search, "$options": 'i' } },
                        { phoneNumber: { '$regex': search, "$options": 'i' } }],
                    isActive: true,
                }
            } else if (search && search != '' && isActive == "false") {
                condition = {
                    ...condition,
                    $or: [
                        { customerRCId: { '$regex': search, "$options": 'i' } },
                        { name: { '$regex': search, "$options": 'i' } },
                        { email: { '$regex': search, "$options": 'i' } },
                        { phoneNumber: { '$regex': search, "$options": 'i' } }],
                    isActive: false,
                }
            } else if (search && search != '') {
                condition = {
                    ...condition,
                    $or: [
                        { customerRCId: { '$regex': search, "$options": 'i' } },
                        { name: { '$regex': search, "$options": 'i' } },
                        { email: { '$regex': search, "$options": 'i' } },
                        { phoneNumber: { '$regex': search, "$options": 'i' } }]
                }

            } else if (isActive && isActive != '') {
                condition = {
                    ...condition,
                    isActive: isActive,
                }

            } else {
                condition = {
                    ...condition
                }
            }
            const response = await customerModel.find(condition).sort(obj).skip((page * pageSize) - pageSize).limit(pageSize);
            const Total = await customerModel.countDocuments(condition);
            var userActive = await customerModel.countDocuments({ 'isActive': true });
            var userDeactive = await customerModel.countDocuments({ 'isActive': false });
            if (!response) {
                reject(new CustomError(errors.en.noDatafound, StatusCodes.BAD_REQUEST));
            } else {
                resolve({ response, Total, userActive, userDeactive });
            }
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
}

//user Details
function userProfile(query: any, userId: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { userId } = query;
            const pending_queries = await reportModel.count({ userId: userId, status: "Pending" });
            const resolve_queries = await reportModel.count({ userId: userId, status: 'Resolves' });
            const complete_order = await customerOrderModel.count({ userId: userId, status: "Completed" })
            const cancelled_order = await customerOrderModel.count({ userId: userId, status: "Cancelled" })
            const response = await customerModel.findOne({ _id: userId });
            if (!response) {
                reject(new CustomError(errors.en.noDatafound, StatusCodes.BAD_REQUEST));
            } else {
                resolve({ response, pending_queries: pending_queries, resolve_queries: resolve_queries, complete_order: complete_order, cancelled_order: cancelled_order });
            }
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
}

//user order list
function orderList(query: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { userId, page = 1, perPage = 10, sort = -1, sortName } = query
            if (sortName && sortName != '') {
                if (sortName == "orderId") {
                    var obj: any = {
                        orderId: sort
                    }
                } else {
                    var obj: any = {
                        createdAt: sort
                    }
                }
            } else {
                var obj: any = {
                    createdAt: sort
                }
            }
            if (!userId) {
                reject(new CustomError('CustomerId required', StatusCodes.BAD_REQUEST))
            } else {
                const count = await customerOrderModel.count({ userId: userId, status: { $in: ['Pending', 'Accepted', 'Rejected', 'Completed', 'Cancelled'] } })
                const userOrderList = await customerOrderModel.find({ userId: userId, status: { $in: ['Pending', 'Accepted', 'Rejected', 'Completed', 'Cancelled'] } }, { orderId: 1, storeId: 1, userId: 1, vendorId: 1, status: 1, totalAmount: 1, subTotal: 1, order_date: 1, order_dateTime: 1, order_time: 1, paid: 1, statusList: 1, pickup_dateTime: 1, pickup_date: 1, pickup_time: 1 }).populate({ path: 'userId vendorId storeId', select: 'ownerName name branchName' }).sort(obj).skip((page * perPage) - perPage).limit(perPage);
                resolve({ items: userOrderList, Total: count })
            }
        } catch (err) {
            reject(err)
        }
    })
}

//upadte status active deative
function userStatus(body: any, userId: Object): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { status, userId } = body;
            const response: any = await customerModel.findOne({ _id: userId });
            if (!response) {
                reject(new CustomError(errors.en.noDatafound, StatusCodes.BAD_REQUEST));
            } else {
                const editdata = {
                    ...body,
                    isActive: status
                }
                const userObj = await customerModel.updateOne({ _id: userId }, editdata, { new: true });
                const session: any = await userSessionModel.findOne({ userId: userId, status: true }, { deviceToken: 1 })
                const tokens = session ? session.deviceToken || '' : ''
                var data = {
                    navigateTo: "Update status",
                    id: userId,
                    deviceToken: tokens,
                    title: fcm.statusUpdate.title,
                    body: fcm.statusUpdate.body.replace('{{name}}', response.name).replace('{{status}}', "Delete")
                }
                sendPushNotification(data);
                resolve(userObj);
            }
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
}

//delete user
function userDelete(body: any, userId: Object): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { userId, isDelete } = body;
            const response = await customerModel.findOne({ _id: userId });
            if (!response) {
                reject(new CustomError(errors.en.noDatafound, StatusCodes.BAD_REQUEST));
            } else {
                const deleteUser = {
                    ...body,
                    isDelete: isDelete
                }
                const userObj = await customerModel.updateOne({ _id: userId }, deleteUser, { new: true });
                const session: any = await userSessionModel.findOne({ userId: userId, status: true }, { deviceToken: 1 })
                const tokens = session ? session.deviceToken || '' : ''
                var data = {
                    navigateTo: "Delete Account",
                    id: userId,
                    deviceToken: tokens,
                    title: fcm.deleteAccount.title,
                    body: fcm.deleteAccount.body.replace('{{name}}', response.name).replace('{{status}}', "Delete")
                }
                sendPushNotification(data);
                resolve(userObj);
            }
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
}

//Excel sheet
function userExcelList(body: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            let condition: any = {
                isDelete: false
            }
            const response1 = await customerModel.find(condition, { name: 1, email: 1, image: 1, phoneNumber: 1, countryCode: 1, customerRCId: 1, createdAt: 1 }).sort({ "createdAt": -1 });

            const response = response1.map(user => {
                return {
                    customerId: user.customerRCId ? user.customerRCId : "N/A", name: user.name ? user.name : "N/A", email: user.email[0] ? user.email[0] : "N/A", countryCode: user.countryCode ? user.countryCode : "N/A", phoneNumber: user.phoneNumber ? user.phoneNumber : "N/A"
                };
            });
            if (!response) {
                reject(new CustomError(errors.en.noDatafound, StatusCodes.BAD_REQUEST));
            } else {
                resolve(response);
            }
        } catch (error) {
            console.log(error);
            reject(error);
        }
    })
}

//user order status list
function orderStatus_List(query: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { order_id } = query;
            const details = await customerOrderModel.findOne({ _id: order_id }, { status: 1, statusList: 1, storeId: 1, pickup_dateTime: 1 }).populate({ path: 'storeId', select: 'branchName' })
            resolve(details)
        } catch (err) {
            reject(err)
        }
    })
}

export default {
    userList,
    userProfile,
    orderList,
    userStatus,
    userDelete,
    userExcelList,
    orderStatus_List
} as const;