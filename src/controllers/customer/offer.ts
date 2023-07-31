import { favoriteModel, offerModel, vendorStoreModel } from "@models/index";
import { CustomError } from "@utils/errors";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import { errors } from "@constants";
import moment from "moment-timezone";
import haversine from "haversine-distance";
import { array } from "joi";
import { aggregate } from "@models/customer";
import { offer } from "@routes/app/customer/offer";
const _ = require('lodash');



function checkOffer(query: any, headers: any): Promise<any> {
    var err_msg: any = errors.en;
    if (headers.language == 'ar') {
        var err_msg: any = errors.ar;
    }
    return new Promise(async (resolve, reject) => {
        const { couponCode, storeId, totalAmount } = query
        var check_couponCode = await offerModel.findOne({ storeId: storeId, couponCode: couponCode, expiryDate: { $gte: moment().tz(headers.timezone).format('YYYY-MM-DD') }, isDelete: false }, { offer_amount: 1, upto_Amount: 1, offer_type: 1, expiryDate: 1, startDate: 1, couponCode: 1, minimum_amount: 1 });
        if (check_couponCode) {
            var date = moment(check_couponCode.startDate).tz(headers.timezone).format('YYYY-MM-DD')
            if (date > moment().tz(headers.timezone).format('YYYY-MM-DD')) {
                reject(new CustomError(err_msg.notAvailable_thisTime.replace('{{Date}}', moment(date).tz(headers.timezone).format('MMM DD')), StatusCodes.BAD_REQUEST))
            } else if (check_couponCode.minimum_amount > totalAmount) {
                reject(new CustomError(err_msg.minimumAmount, StatusCodes.BAD_REQUEST))
            } else {
                resolve(check_couponCode)
            }
        } else {
            reject(new CustomError(err_msg.notAvailable, StatusCodes.BAD_REQUEST))
        }
    })
}

function offerList(query: any, userId: any, headers: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg: any = errors.en;
        if (headers.language == 'ar') {
            var err_msg: any = errors.ar;
        }
        try {
            const array: any = []
            var array1: any = []
            const array2: any = []
            const near: any = process.env.approx_distance
            var nearby: any = near * 0.621371
            const { search, storeTypeId, lat, lng, type } = query;
            var date = moment().tz(headers.timezone).format('YYYY-MM-DD');
            let condition: any = {
                isDelete: false,
                isActive: true,
                expiryDate: { $gte: new Date(moment().format('YYYY-MM-DD[T00:00:00.000Z]')) }
            }
            if (type == "Home") {
                condition = {
                    ...condition,
                    startDate: { $lte: new Date(moment().format('YYYY-MM-DD[T00:00:00.000Z]')) }
                }
            }
            let condition1: any = {
                online_status: true,
                store_openClosing_time:true,
                hightItemAmount: { $gte: 1 },
                isDelete: false,
                isActive: true
            }
            if (search && search != '') {
                condition = {
                    ...condition,
                    couponCode: { $regex: search, $options: 'i' },
                }
                condition1 = {
                    ...condition1
                }
            }
            if (storeTypeId) {
                condition = {
                    ...condition,
                    storeTypeId: new mongoose.Types.ObjectId(storeTypeId)
                }
                condition1 = {
                    ...condition1,
                    storeTypeId: new mongoose.Types.ObjectId(storeTypeId)
                }
            }
            if (lat && lng) {
                condition1 = {
                    ...condition1,
                    location: {
                        $geoWithin: {
                            $centerSphere: [[Number(lng), Number(lat)], Number(nearby) / 3963.2],
                        }
                    }
                }
            }
            var checkOnline_stores = await offerModel.aggregate([
                {
                    $lookup: {
                        localField: "storeTypeId",
                        from: "storetypes",
                        foreignField: "_id",
                        as: "storetypes"
                    }
                },
                {
                    $lookup: {
                        localField: "storeId",
                        from: "vendorstores",
                        foreignField: "_id",
                        as: "vendorstores",
                        pipeline: [
                            {
                                $addFields: {
                                    location: ['$lng', '$lat']
                                }
                            },
                            {
                                $lookup: {
                                    localField: "cuisineeId",
                                    from: "cusinecategories",
                                    foreignField: "_id",
                                    as: "cuisinee",
                                    pipeline: [
                                        { $limit: Number(4) }
                                    ]
                                }
                            },
                            {
                                $match: condition1
                            },
                            { $project: { 'image': 1, 'branchName': 1, 'fullAddress': 1, 'rating': 1, 'cuisinee': 1, 'lat': 1, 'lng': 1, 'ar_branchName': 1, 'location': 1, '_id': 1, 'hightItemAmount': 1, 'isActive': 1, 'online_status': 1, 'userId': 1 } },
                        ],
                    }
                },
                { $match: condition },
                { $project: { storeTypeId: 0, storeId: 0 } },
                { $sort: { createdAt: -1 } }
            ])
            if (type == 'Home') {
                await Promise.all(checkOnline_stores.map(async (list: any) => {
                    if (list.vendorstores.length != 0) {
                        var stores: any = list.vendorstores
                        await Promise.all(stores.map(async (Id: any) => {
                            var lat2: any = Id.lat;
                            var lon2: any = Id.lng;
                            var lat1: any = lat;
                            var lon1: any = lng;
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
                            var fav = false
                            var favourate = await favoriteModel.findOne({ storeId: Id._id, userId: userId }, { _id: 1 })
                            var coupandata = await offerModel.findOne({ 'storeId': new mongoose.Types.ObjectId(Id._id), 'isActive': true, 'isDelete': false, "offer_type": "Percentage", 'expiryDate': { $gte: date }, 'startDate': { $lte: date } }, { expiryDate: 1, offer_type: 1, offer_amount: 1 });
                            if (favourate) {
                                var fav = true
                            }
                            Id.dictance = dist
                            Id.favourite = fav
                            Id.offer = coupandata
                            Id.vendorId = Id.userId
                            Id.near_restaurantAvailable = true
                        }))
                        list.storeTypeId = {
                            "_id": list.storetypes[0]._id,
                            "storeType": list.storetypes[0].storeType,
                            "ar_storeType": list.storetypes[0].ar_storeType,
                            "isActive": list.storetypes[0].isActive
                        }
                        array1.push(list)
                    }
                }))
                const total = array1.length;
                resolve({ offer: array1.sort((firstItem: any, secondItem: any) => secondItem.createdAt - firstItem.createdAt), total });
            } else {
                checkOnline_stores.map((list) => {
                    if (list.vendorstores.length != 0) {
                        var new_obj: any = {
                            _id: list._id,
                            image: list.image,
                            "userId": list.userId,
                            "storeTypeId": {
                                "_id": list.storetypes[0]._id,
                                "ar_storeType": list.storetypes[0].ar_storeType,
                                "storeType": list.storetypes[0].storeType,
                                "isActive": list.storetypes[0].isActive
                            },
                            "couponCode": list.couponCode,
                            "title": list.title,
                            "description": list.description,
                            "offer_type": list.offer_type,
                            "minimum_amount": list.minimum_amount ? list.minimum_amount : '',
                            "offer_amount": list.offer_amount,
                            "ar_title": list.ar_title,
                            "ar_description": list.ar_description,
                            "upto_Amount": list.upto_Amount,
                            "expiryDate": list.expiryDate,
                            "startDate": list.startDate,
                            "isDelete": list.isDelete
                        }
                        array1.push(new_obj)
                    }
                })
                const total = array1.length;
                resolve({ offer: array1.sort((firstItem: any, secondItem: any) => secondItem.createdAt - firstItem.createdAt), total });
            }
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
}

export default {
    offerList,
    checkOffer
}

