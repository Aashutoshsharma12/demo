import { CustomError } from "@utils/errors";
import { errors } from "@constants";
import { StatusCodes } from "http-status-codes";
import customerOrderModel from "@models/customer_order";
import moment from "moment-timezone";
import { reject } from "promise";
import parkingModel from "@models/parking";


//update parkingstatus
var update_parkingstatus = async (parkingNumber: any) => {
    await parkingModel.updateOne({ title: parkingNumber }, { parkingSlot_booked: false });
}
// order list
function orderList(query: any, userId: any, headers: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg: any = errors.en;
        if (headers.language == 'ar') {
            var err_msg: any = errors.ar;
        }
        try {
            const { page = 1, perPage = 10, type = "Pending", storeId } = query;
            let obj: any = {
                vendorId: userId,
                storeId: storeId,
            }
            if (type == "Pending") {
                obj = {
                    ...obj,
                    status: { $in: ['Pending', 'Accepted'] }
                }
            } else {
                obj = {
                    ...obj,
                    status: type
                }
            }
            const obj1 = {
                vendorId: userId,
                storeId: storeId,
                status: { $in: ['Pending', 'Accepted', 'Completed', 'Cancelled'] }
            }
            if (!storeId) {
                reject(new CustomError(err_msg.requiredStore, StatusCodes.BAD_REQUEST));
            } else {
                const count = await customerOrderModel.countDocuments(obj1);
                const list = await customerOrderModel.find(obj, { userId: 1, vendorId: 1, storeId: 1, orderId: 1, order_time: 1, order_date: 1, order_dateTime: 1, totalAmount: 1, totalItems: 1, paid: 1, status: 1, pickup_date: 1, pickup_dateTime: 1, pickup_time: 1 }).populate({ path: "userId", select: 'name' }).sort({ order_dateTime: -1 }).skip((page * perPage) - perPage).limit(perPage);
                resolve({ items: list, count: count });
            }
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}

// orderDetails
function orderDetails(query: any, user: any, headers: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg: any = errors.en;
        if (headers.language == 'ar') {
            var err_msg: any = errors.ar;
        }
        try {
            const { orderId } = query;
            if (!orderId) {
                reject(new CustomError(err_msg.requireOrder, StatusCodes.BAD_REQUEST));
            } else {
                const details = await customerOrderModel.findOne({ vendorId: user.id, _id: orderId }).populate({ path: 'userId items.itemId items.item_size items.addons.addonsId items.addons.addonsTypeId', select: "name countryCode phoneNumber itemName title item_size" });
                if (details) {
                    resolve(details);
                } else {
                    reject(new CustomError(err_msg.invalidOrderInfo, StatusCodes.BAD_REQUEST));
                }
            }
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}

// update status Cancelled, Accepted,Rejected,Completed
function update_status(query: any, user: any, header: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg: any = errors.en;
        if (header.language == 'ar') {
            var err_msg: any = errors.ar;
        }
        try {
            const { timezone } = header;
            const { status, orderId } = query;
            if (!orderId) {
                reject(new CustomError(err_msg.requireOrder, StatusCodes.BAD_REQUEST));
            } else {
                const details = await customerOrderModel.findOne({ vendorId: user.id, _id: orderId });
                if (details) {
                    const array = details.statusList;
                    const obj1: any = {
                        status,
                        dateAndTime: moment().tz(timezone).format('YYYY-MM-DD HH:mm'),
                        time: moment().tz(timezone).format('HH:mm')
                    }
                    const array1 = [...array, { ...obj1 }];
                    let obj: any = {
                        statusList: array1,
                        status: status
                    }
                    if (status == "Completed") {
                        obj = {
                            ...obj,
                            parkingStatus: "Out", outparkingDateTime: moment().tz(timezone).format('YYYY-MM-DD HH:mm')
                        }
                        // await customerOrderModel.updateOne({ vendorId: user.id, _id: orderId }, obj);
                        update_parkingstatus(details.parkingNumber)
                    }
                    if(status == "Cancelled"){
                        update_parkingstatus(details.parkingNumber)
                    }
                    await customerOrderModel.updateOne({ vendorId: user.id, _id: orderId }, obj);
                    resolve({ success: true });
                } else {
                    reject(new CustomError(err_msg.invalidOrderInfo, StatusCodes.BAD_REQUEST));
                }
            }
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}

//scan Order QRcode
function scan_QRcode(query: any, userId: any, headers: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg: any = errors.en;
        if (headers.language == 'ar') {
            var err_msg: any = errors.ar;
        }
        try {
            const { order_id } = query
            if (!order_id) {
                reject(new CustomError(err_msg.invalidQRcode, StatusCodes.BAD_REQUEST))
                return
            }
            const check = await customerOrderModel.findOne({ _id: order_id, vendorId: userId.id });
            if (!check) {
                reject(new CustomError(err_msg.orderNotExists, StatusCodes.BAD_REQUEST))
            } else if (check.status == "Pending") {
                reject(new CustomError(err_msg.invalidQRcode, StatusCodes.BAD_REQUEST))
            } else if (check.status == "Rejected") {
                reject(new CustomError(err_msg.actionAlreadyTaken, StatusCodes.BAD_REQUEST))
            } else if (check.status == "Cancelled") {
                reject(new CustomError(err_msg.actionAlreadyTaken, StatusCodes.BAD_REQUEST))
            } else if (check.status == "Completed") {
                reject(new CustomError(err_msg.actionAlreadyTaken, StatusCodes.BAD_REQUEST))
            } else {
                const array = check.statusList;
                const obj1: any = {
                    status: "Completed",
                    dateAndTime: moment().tz(headers.timezone).format('YYYY-MM-DD HH:mm'),
                    time: moment().tz(headers.timezone).format('HH:mm')
                }
                const array1 = [...array, { ...obj1 }];
                await customerOrderModel.updateOne({ _id: order_id, vendorId: userId.id }, {
                    status: "Completed", statusList: array1, parkingStatus: "Out", outparkingDateTime: moment().tz(headers.timezone).format('YYYY-MM-DD HH:mm'),
                })
                update_parkingstatus(check.parkingNumber)
                resolve({ success: true })
            }
        } catch (err) {
            reject(err)
        }
    })
}

export default {
    orderList,
    orderDetails,
    update_status,
    scan_QRcode
} as const