import { StatusCodes } from "http-status-codes";
import { CustomError } from "@utils/errors";
import { errors } from "@constants";
import { reject } from "promise";
import { resolve } from "path";
import { array } from "joi";
import { customerModel, customerOrderModel, vendorStoreModel } from "@models/index";
import { ObjectId } from "mongodb";
import vendor_Earning from "@controllers/vendor/vendor_Earning";
/**
 * Order list
 */

// Order list
function order_list(query: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { page = 1, perPage = 10, sortName = "orderId", sort = -1, search, status } = query;
            var array: any = [];
            var array1: any = [];
            if (sortName && sortName != '') {
                if (sortName == "amount") {
                    var obj: any = {
                        totalAmount: sort
                    }
                } else {
                    var obj: any = {
                        orderId: sort
                    }
                }
            } else {
                var obj: any = {
                    orderId: sort
                }
            }
            let condition: any = {
                status: { $in: ["Completed", "Cancelled", "Pending", "Accepted", "Rejected", "Rescheduled"] }
            }
            if (search && search != null && status && status != null) {
                if (status == "Pending") {
                    condition = {
                        ...condition,
                        status: { $in: ['Pending', 'Accepted'] }
                    }
                } else {
                    condition = {
                        ...condition,
                        status: status
                    }
                }

                const condition1: any = {
                    $or: [
                        { name: { $regex: search, $options: 'i' } },
                        { phoneNumber: { $regex: search, $options: 'i' } }
                    ],
                }
                const check1: any = await customerModel.find(condition1)
                if (check1 && check1.length) {
                    for (let i = 0; i < check1.length; i++) {
                        array.push(check1[i]._id)
                    }
                    condition.userId = { $in: array }
                } else {
                    const condition11: any = {
                        branchName: { $regex: search, $options: 'i' }
                    }
                    const check2: any = await vendorStoreModel.find(condition11)
                    if (check2 && check2.length) {
                        for (let i1 = 0; i1 < check2.length; i1++) {
                            array1.push(check2[i1]._id)
                        }
                        condition.storeId = { $in: array1 }
                    } else {
                        condition.orderId = { $regex: search, $options: 'i' }
                    }
                }
            } else if (search && search != null) {
                condition = {
                    ...condition
                }
                const condition1: any = {
                    $or: [
                        { name: { $regex: search, $options: 'i' } },
                        { phoneNumber: { $regex: search, $options: 'i' } }
                    ],
                }
                const check1: any = await customerModel.find(condition1)
                if (check1 && check1.length) {
                    for (let i = 0; i < check1.length; i++) {
                        array.push(check1[i]._id)
                    }
                    condition.userId = { $in: array }
                } else {
                    const condition11: any = {
                        branchName: { $regex: search, $options: 'i' }
                    }
                    const check2: any = await vendorStoreModel.find(condition11)
                    if (check2 && check2.length) {
                        for (let i1 = 0; i1 < check2.length; i1++) {
                            array1.push(check2[i1]._id)
                        }
                        condition.storeId = { $in: array1 }
                    } else {
                        condition.orderId = { $regex: search, $options: 'i' }
                    }
                }
            } else if (status && status != null) {
                if (status == "Pending") {
                    condition = {
                        ...condition,
                        status: { $in: ['Pending', 'Accepted'] }
                    }
                } else {
                    condition = {
                        ...condition,
                        status: status
                    }
                }
            } else {
                condition = {
                    ...condition
                }
            }
            const count = await customerOrderModel.count(condition)
            const orderList = await customerOrderModel.find(condition, { orderId: 1, order_dateTime: 1, totalAmount: 1, status: 1, device_modelName: 1 }).sort(obj).populate({ path: "userId storeId", select: "name branchName phoneNumber" }).skip((page * perPage) - perPage).limit(perPage);
            resolve({ list: orderList, totalCount: count });
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}

//Order Details
function details(Id: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { ObjectId } = require('mongodb')
            if (!Id) {
                reject(new CustomError('OrderId require', StatusCodes.BAD_REQUEST))
            } else {
                const details = await customerOrderModel.findOne({ _id: Id }).populate({ path: "userId vendorId items.itemId items.item_size", select: "item_size ownerName businessName itemName image name email phoneNumber" });
                resolve({ response: details })
            }
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}

// Payment list
function payment_list(query: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { page = 1, perPage = 10, sortName = "orderId", sort = -1, search } = query;
            var array: any = [];
            var array1: any = [];
            if (sortName && sortName != '') {
                if (sortName == "amount") {
                    var obj: any = {
                        totalAmount: sort
                    }
                } else if (sortName == "orderId") {
                    var obj: any = {
                        orderId: sort
                    }
                } else {
                    var obj: any = {
                        updatedAt: sort
                    }
                }
            } else {
                var obj: any = {
                    updatedAt: sort
                }
            }
            let condition: any = {
                paymentStatus: 'Completed'
            }
            if (search && search != null && search != "") {
                const condition1: any = {
                    name: { $regex: search, $options: 'i' }
                }

                const check1: any = await customerModel.find(condition1)
                if (check1 && check1.length) {
                    for (let i = 0; i < check1.length; i++) {
                        array.push(check1[i]._id)
                    }
                    condition.userId = { $in: array }
                } else {
                    resolve({ list: [], totalCount: 0 });
                }
            }
            const count = await customerOrderModel.count(condition)
            const paymentList = await customerOrderModel.find(condition, { orderId: 1, updatedAt: 1, totalAmount: 1, paymentStatus: 1,userId: 1,paid:1}).sort(obj).populate({ path: "userId", select: "name phoneNumber" }).skip((page * perPage) - perPage).limit(perPage);
            resolve({ list: paymentList, totalCount: count });
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}

export default {
    order_list,
    details,
    payment_list
} as const;