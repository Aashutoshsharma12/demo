import { customerModel, customerOrderModel, vendorStoreModel, tax_chargesModel, ratingModel, vendorStoreTypeModel, timingModel, offerModel, favoriteModel } from '../../models/index';
import { CustomError } from '../../utils/errors';
import StatusCodes from 'http-status-codes';
import { errors } from '../../constants/index';
import { identityGenerator } from '@utils/helpers';
import moment from 'moment-timezone';
import mongoose from "mongoose";
const _ = require('lodash');
import qr from "qrcode";
import haversine from "haversine-distance";
import user from '@controllers/admin/user';
import { array } from 'joi';
import haversineDistance from 'haversine-distance';
import { ObjectId } from 'mongodb';

// Order Add To Cart
function addOrder_toCart(data: any, userId: any, headers: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg: any = errors.en;
        if (headers.language == 'ar') {
            var err_msg: any = errors.ar;
        }
        try {
            const count = await customerOrderModel.countDocuments();
            const orderId = identityGenerator(count, "Id");
            const storeType: any = await vendorStoreTypeModel.findOne({ userId: data.vendorId })
            const obj = {
                orderId,
                ...data,
                storeTypeId: storeType.storeTypeId,
                userId
            };
            const user = await customerModel.findOne({ _id: new mongoose.Types.ObjectId(userId), isDelete: false });
            if (user) {
                const Add_cart = await customerOrderModel.create(obj);
                var qrcode = await qr.toDataURL((Add_cart._id).toString());
                await customerOrderModel.updateOne({ '_id': Add_cart._id }, { 'qrCode': qrcode });
                resolve(Add_cart);
            } else {
                reject(new CustomError(err_msg.noDatafound, StatusCodes.BAD_REQUEST));
            }
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}

// Update Order
function update_order(data: any, userId: any, headers: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg: any = errors.en;
        if (headers.language == 'ar') {
            var err_msg: any = errors.ar;
        }
        try {
            const check = await customerOrderModel.findOne({ userId: new mongoose.Types.ObjectId(userId), _id: new mongoose.Types.ObjectId(data.order_id), isDelete: false });
            if (check) {
                const obj = {
                    ...data
                }
                const user = await customerModel.findOne({ _id: userId, isDelete: false });
                if (user) {
                    await customerOrderModel.updateOne({ _id: data.order_id }, obj);
                    resolve({ success: true });
                } else {
                    reject(new CustomError(err_msg.noDatafound, StatusCodes.BAD_REQUEST));
                }
            } else {
                reject(new CustomError(err_msg.orderNotExists, StatusCodes.BAD_REQUEST));
            }
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}

// Order Details
function orderDetails(order_id: any, userId: any, headers: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg: any = errors.en;
        if (headers.language == 'ar') {
            var err_msg: any = errors.ar;
        }
        try {
            const details = await customerOrderModel.findOne({ _id: new mongoose.Types.ObjectId(order_id), userId: new mongoose.Types.ObjectId(userId) }).populate([{ path: "items.itemId", select: "itemName foodCategoryId", populate: { path: 'foodCategoryId', select: 'title' } }, { path: "items.item_size items.addons.addonsId storeId", select: "title item_size branchName fullAddress lat lng" }]);
            if (details) {
                resolve(details);
            } else {
                reject(new CustomError(err_msg.noDatafound, StatusCodes.BAD_REQUEST));
            }
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}

// Order Details
function vendorCart(query: any, userId: any, headers: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg: any = errors.en;
        if (headers.language == 'ar') {
            var err_msg: any = errors.ar;
        }
        try {
            const { storeId, vendorId } = query
            const details = await customerOrderModel.findOne({ vendorId: new mongoose.Types.ObjectId(vendorId), storeId: new mongoose.Types.ObjectId(storeId), userId: new mongoose.Types.ObjectId(userId), status: 'Add to cart' }).populate({ path: "items.itemId items.item_size", select: "itemName item_size" });
            const tax1: any = await tax_chargesModel.findOne({ 'isActive': true, 'isDelete': false });
            if (details) {
                resolve({ details, tax: tax1.tax });
            } else {
                reject(new CustomError(err_msg.noDatafound, StatusCodes.BAD_REQUEST));
            }
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}

// Remove cart
function removeCart(orderId: any, userId: any, headers: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg: any = errors.en;
        if (headers.language == 'ar') {
            var err_msg: any = errors.ar;
        }
        try {
            const details = await customerOrderModel.deleteOne({ '_id': new mongoose.Types.ObjectId(orderId) });
            if (details) {
                resolve({});
            } else {
                reject(new CustomError(err_msg.noDatafound, StatusCodes.BAD_REQUEST));
            }
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}

// Order List
function orderList(query: any, userId: any, headers: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg: any = errors.en;
        if (headers.language == 'ar') {
            var err_msg: any = errors.ar;
        }
        try {
            const { page = 1, perPage = 10 } = query;
            const list = await customerOrderModel.find({ userId: new mongoose.Types.ObjectId(userId), status: { $ne: 'Add to cart' } })
                .populate([{ path: "storeId", select: 'branchName fullAddress lat lng' }, { path: 'storeTypeId', select: 'storeType ar_storeType' }, { path: 'items.itemId', select: 'itemName foodCategoryId', populate: { path: 'foodCategoryId', select: 'title' } }
                    , { path: 'items.item_size', select: 'item_size amount' }, { path: 'items.addons.addonsId', select: 'title amount' }])
                .sort({ createdAt: -1 }).skip((page * perPage) - perPage).limit(perPage);
            if (list && list.length) {
                var arr: any = [];
                await Promise.all(list.map(async (Id: any) => {
                    var lat2: any = Id.storeId.lat;
                    var lon2: any = Id.storeId.lng;
                    var lat1: any = Id.address.lat;
                    var lon1: any = Id.address.lng;
                    lon1 = lon1 * Math.PI / 180;
                    lon2 = lon2 * Math.PI / 180;
                    lat1 = lat1 * Math.PI / 180;
                    lat2 = lat2 * Math.PI / 180;
                    let dlon = lon2 - lon1;
                    let dlat = lat2 - lat1;
                    let a = Math.pow(Math.sin(dlat / 2), 2)
                        + Math.cos(lat1) * Math.cos(lat2)
                        * Math.pow(Math.sin(dlon / 2), 2);
                    let c = 2 * Math.asin(Math.sqrt(a));
                    // Radius of earth in kilometers. Use 3956
                    // for miles
                    let r = 6371;
                    var dist = (c * r)
                    var obj = {
                        "address": Id.address,
                        "pickup_dateTime": Id.pickup_dateTime,
                        "pickup_time": Id.pickup_time,
                        "pickup_date": Id.pickup_date,
                        "_id": Id._id,
                        "vendorId": Id.vendorId,
                        "storeId": Id.storeId,
                        "orderId": Id.orderId,
                        "userId": Id.userId,
                        "items": Id.items,
                        "storeTypeId": Id.storeTypeId,
                        "totalItems": Id.totalItems,
                        "status": Id.status,
                        "description": Id.description,
                        "order_dateTime": Id.order_dateTime,
                        "order_time": Id.order_time,
                        "discount": Id.discount,
                        "order_date": Id.order_date,
                        "parkingStatus": Id.parkingStatus,
                        "inparkingDateTime": Id.inparkingDateTime,
                        "outparkingDateTime": Id.outparkingDateTime,
                        "couponCode": Id.couponCode,
                        "couponCodeAmount": Id.couponCodeAmount,
                        "subTotal": Id.subTotal,
                        "taxes_Charges": Id.taxes_Charges,
                        "taxes_Charges_amount": Id.taxes_Charges_amount,
                        "totalAmount": Id.totalAmount,
                        "paymentStatus": Id.paymentStatus,
                        "paid": Id.paid,
                        "statusList": Id.statusList,
                        "distance": dist,
                        "rating": Id.rating,
                        "qrCode": Id.qrCode,
                        "parkingNumber": Id.parkingNumber ? Id.parkingNumber : "",
                        "review": "",
                        "ar_review": "",
                        "createdAt": Id.createdAt
                    }
                    var rating: any = await ratingModel.findOne({ 'orderId': Id._id });
                    if (rating) {
                        obj.review = rating.review ? rating.review : '';
                        obj.ar_review = rating.ar_review ? rating.ar_review : '';
                    }
                    arr.push(obj);
                }))
                resolve({ items: arr.sort((firstItem: any, secondItem: any) => secondItem.createdAt - firstItem.createdAt) });
            } else {
                resolve({ items: [] });
            }
            // resolve(list)
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}

// UPDATE STATUS
function updateStatus(data: any, order_id: any, userId: any, header: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg: any = errors.en;
        if (header.language == 'ar') {
            var err_msg: any = errors.ar;
        }
        try {
            const { status, dateAndTime, time, paid, paymentStatus, couponCode, discount, device_modelName } = data;
            const { timezone } = header;
            const check = await customerOrderModel.findOne({ _id: new mongoose.Types.ObjectId(order_id), userId: new mongoose.Types.ObjectId(userId) });
            if (check) {
                const array = check.statusList;
                const obj1: any = {
                    status,
                    dateAndTime: moment().tz(timezone).format('YYYY-MM-DD HH:mm'),
                    time: moment().tz(timezone).format('HH:mm')
                }
                const array1 = [...array, { ...obj1 }];
                const obj = {
                    paid,
                    device_modelName,
                    paymentStatus,
                    couponCode,
                    discount,
                    status: status,
                    statusList: array1
                }
                await customerOrderModel.updateOne({ _id: order_id, userId: userId }, obj);
                resolve({ success: true });
            } else {
                reject(new CustomError(err_msg.noDatafound, StatusCodes.BAD_GATEWAY));
            }
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}

// Get TimeSlot
function GetTimeSlot(data: any, userId: any, headers: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg: any = errors.en;
        if (headers.language == 'ar') {
            var err_msg: any = errors.ar;
        }
        try {
            var req_data = data;
            req_data.serviceTime = 30;
            var workingHours: any = await timingModel.findOne({ 'storeId': data.storeId });
            if (workingHours) {
                var day = moment(req_data.bookingDate).format('dddd');
                var workingHourData = workingHours[day];
                if (workingHourData.openingTime != 'closed') {
                    var a: any = [];
                    var serviceTime = req_data.serviceTime;
                    var openingTime = workingHourData.openingTime;
                    var closingTime = workingHourData.closingTime;
                    var startTime = moment(openingTime, 'HH:mm');
                    var endTime = moment(closingTime, 'HH:mm').subtract(30, 'minutes');
                    var et = moment(endTime, 'HH:mm').tz(headers.timezone);
                    var timeSlots = [];
                    const unit = "hour";
                    var duration = 1 / 2;
                    var slTime = moment().add(duration, unit).tz(headers.timezone).format('HH:mm'); // current time
                    var todayDate = moment().tz(headers.timezone).format('YYYY-MM-DD');
                    while (startTime <= endTime) {
                        if (a && a.length) {
                            for (var i = 0; i < a.length; i++) {
                                var x = a;
                                var y = moment(startTime, 'HH:mm');
                                y.add(serviceTime, 'minutes');
                                var s = moment(x[i].time, 'HH:mm');
                                if (s < y && s >= startTime) {
                                    s.add(x[i].serviceTime1, 'minutes');
                                    startTime = moment(s, 'HH:mm');
                                    x.splice(0, a[i].time);
                                }
                            }
                            timeSlots.push(moment(startTime).format('HH:mm'));
                            startTime.add(serviceTime, 'minutes');
                        } else {
                            timeSlots.push(moment(startTime).format('HH:mm'));
                            startTime.add(serviceTime, 'minutes');
                        }
                    }
                    var resArr: any = [];
                    if (todayDate == data.bookingDate) {
                        for (var i = 0; i < timeSlots.length; i++) {
                            var startTime1 = moment(timeSlots[i], 'HH:mm').tz(headers.timezone);
                            var slTime1 = moment(slTime, 'HH:mm').tz(headers.timezone);
                            if (startTime1 >= slTime1) {
                                resArr.push(timeSlots[i]);
                            }
                        }
                    } else {
                        var resArr: any = timeSlots;
                    }
                    var startTime2 = moment(timeSlots[0], 'HH:mm').tz(headers.timezone);
                    if (startTime2 <= et) {
                        resArr = resArr;
                    } else {
                        resArr = [];
                    }
                    resolve(resArr);
                } else {
                    resolve([]);
                }
            } else {
                resolve([])
            }
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
}

// check Order listing
function checkOrder(userId: any, header: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg: any = errors.en;
        if (header.language == 'ar') {
            var err_msg: any = errors.ar;
        }
        try {
            const { timezone } = header;
            var array: any = []
            // const check = await customerOrderModel.find({ 'userId': new mongoose.Types.ObjectId(userId), 'status': 'Pending' }).populate([{ path: "storeId", select: 'branchName fullAddress lat lng' }, { path: 'storeTypeId', select: 'storeType ar_storeType' }, { path: 'items.itemId', select: 'itemName foodCategoryId', populate: { path: 'foodCategoryId', select: 'title' } }
            //     , { path: 'items.item_size', select: 'item_size amount' }, { path: 'items.addons.addonsId', select: 'title amount' }]).sort({ 'pickup_dateTime': -1 });
            const check = await customerOrderModel.aggregate([
                {
                    $lookup: {
                        localField: "storeId",
                        from: "vendorstores",
                        foreignField: "_id",
                        as: "store",
                    }
                },
                { $match: { 'userId': new mongoose.Types.ObjectId(userId), 'status': { $in: ['Pending', "Accepted"] } } },
                { $project: { 'address': 1, 'pickup_dateTime': 1, 'pickup_time': 1, 'pickup_date': 1, 'storeId': 1, "store": 1, "status": 1 } }
            ])
            if (check && check.length) {
                await Promise.all(check.map(async (list: any) => {
                    var point1 = { lat: list.store[0].lat, lng: list.store[0].lng }
                    var point2 = { lat: list.address.lat, lng: list.address.lng }
                    var haversine_m = haversine(point1, point2);
                    var haversine_km = haversine_m / 1000;
                    var obj: any = {
                        _id: list._id,
                        distance: haversine_km,
                        pickup_dateTime: list.pickup_dateTime,
                        pickup_time: list.pickup_time,
                        pickup_date: list.pickup_date,
                        status: list.status
                    };
                    array.push(obj)
                }))
                resolve(array);
            } else {
                resolve(array);
            }
            resolve(check)
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
}

//reorder restaurant details details
function reorder_details(query: any, userId: any, headers: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg: any = errors.en;
        if (headers.language == 'ar') {
            var err_msg: any = errors.ar;
        }
        try {
            const { lat, lng, storeId } = query
            var nearby: any = process.env.approx_distance
            if (!storeId) {
                reject(new CustomError(err_msg.requiredStore, StatusCodes.BAD_REQUEST))
            }
            const storeDetails = await vendorStoreModel.aggregate([
                {
                    $addFields: {
                        storeId: { $toObjectId: "$_id" },
                        location: ["$lng", "$lat"]
                    }
                },
                {
                    $lookup: {
                        localField: "cuisineeId",
                        from: "cusinecategories",
                        foreignField: "_id",
                        as: "cuisinee",
                    }
                },
                { $match: { _id: new mongoose.Types.ObjectId(storeId) } },
            ])
            if (storeDetails) {
                var favourite: any = false;
                var point1 = { lat: lat, lng: lng };
                var point2 = { lat: storeDetails[0].lat, lng: storeDetails[0].lng };
                var haversine_m = haversine(point1, point2);
                var haversine_km = haversine_m / 1000;
                var date = moment().tz(headers.timezone).format('YYYY-MM-DD');
                var favData = await favoriteModel.findOne({ 'userId': new mongoose.Types.ObjectId(userId), 'storeId': storeId });
                if (favData) {
                    var favourite: any = true;
                }
                if (haversine_km > nearby) {
                    var obj: any = {
                        near_restaurantAvailable: false
                    }
                } else {
                    var obj: any = {
                        _id: storeDetails[0]._id,
                        vendorId: storeDetails[0].userId,
                        branchName: storeDetails[0].branchName ? storeDetails[0].branchName : '',
                        fullAddress: storeDetails[0].fullAddress ? storeDetails[0].fullAddress : '',
                        image: storeDetails[0].image ? storeDetails[0].image : '',
                        rating: storeDetails[0].rating ? storeDetails[0].rating : 0,
                        online_status: storeDetails[0].online_status,
                        hightItemAmount: storeDetails[0].hightItemAmount,
                        isActive: storeDetails[0].isActive,
                        near_restaurantAvailable: true,
                        favourite: favourite,
                        cuisinee: storeDetails[0].cuisinee,
                        lat: storeDetails[0].lat,
                        lng: storeDetails[0].lng,
                        dictance: haversine_km ? haversine_km : 0
                    }
                }
                resolve(obj)
            } else {
                resolve({})
            }
        } catch (err) {
            reject(err)
        }
    })
}

export default {
    addOrder_toCart,
    update_order,
    orderDetails,
    orderList,
    updateStatus,
    vendorCart,
    removeCart,
    GetTimeSlot,
    checkOrder,
    reorder_details
} as const;


// var lat2: any = check[0].storeId.lat;
                // var lon2: any = check[0].storeId.lng;
                // var lat1: any = check[0].address.lat;
                // var lon1: any = check[0].address.lng;
                // lon1 = lon1 * Math.PI / 180;
                // lon2 = lon2 * Math.PI / 180;
                // lat1 = lat1 * Math.PI / 180;
                // lat2 = lat2 * Math.PI / 180;
                // // Haversine formula
                // let dlon = lon2 - lon1;
                // let dlat = lat2 - lat1;
                // let a = Math.pow(Math.sin(dlat / 2), 2)
                //     + Math.cos(lat1) * Math.cos(lat2)
                //     * Math.pow(Math.sin(dlon / 2), 2);
                // let c = 2 * Math.asin(Math.sqrt(a));
                // // Radius of earth in kilometers. Use 3956
                // // for miles
                // let r = 6371;
                // var dist: any = (c * r)