import { vendor_menueItemsModel, addressModel, vendorStoreModel, itemCategoryModel } from "../../models/index";
import { CustomError } from "../../utils/errors";
import StatusCodes from "http-status-codes";
import { errors } from "../../constants/index";
import mongoose from "mongoose";
import haversine from "haversine-distance";
const _ = require('lodash');

function globalSearchList(query: any, headers: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg: any = errors.en;
        if (headers.language == 'ar') {
            var err_msg: any = errors.ar;
        }
        try {
            const { page = 1, perPage = 10, search, storeId } = query;
            let condition: any = {
                isDelete: false,
                "storeId": storeId
            }
            if (search && search != '') {
                condition = {
                    ...condition,
                    $or: [
                        { itemName: { $regex: search, $options: 'i' } }
                    ]
                }
            }
            const array: any = [];
            const searchList = await vendor_menueItemsModel.find(condition).skip((page * perPage) - perPage).limit(perPage);
            const total = await vendor_menueItemsModel.countDocuments(condition);
            if (searchList && searchList.length) {
                for (let i = 0; i < searchList.length; i++) {
                    var a = new Object();
                    a = searchList[i].toObject();
                    array.push(a);
                }
                resolve({ array, total });
            } else {
                resolve({ array, total });
            }
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
}

function trending_search(body: any, headers: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg: any = errors.en;
        if (headers.language == 'ar') {
            var err_msg: any = errors.ar;
        }
        try {
            const arr: any = [];
            const chck = await addressModel.aggregate([
                { "$unwind": "$addressLine1" },
                {
                    $group: {
                        _id: "$addressLine1",
                        count: { $sum: 1 }
                    }
                },
                { $sort: { count: -1 } }, { $limit: 5 }
            ]);
            if (chck && chck.length) {
                for (let i = 0; i < chck.length; i++) {
                    const popular = await addressModel.findOne({ "addressLine1": chck[i]._id });
                    arr.push(popular);
                }
                resolve(arr);
            } else {
                resolve(arr);
            }
        } catch (error) {
            console.log(error);
            reject(error);
        }
    })
}

function vendorShopList(query: any, headers: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg: any = errors.en;
        if (headers.language == 'ar') {
            var err_msg: any = errors.ar;
        }
        try {
            const { search, page = 1, perPage = 20, lat, lng, storeTypeId } = query;
            var nearby: any = process.env.approx_distance
            var condition: any = {
                'isDelete': false,
                'isActive': true,
                'online_status': true,
                'hightItemAmount': { $gte: 1 },
                'store_openClosing_time': true,
                'storeTypeId': new mongoose.Types.ObjectId(storeTypeId),
                $or: [
                    { branchName: { $regex: search, $options: 'i' } }
                ]
            }

            var catCondition = {
                'isDelete': false,
                'isActive': true,
                'storeTypeId': new mongoose.Types.ObjectId(storeTypeId),
                $or: [
                    { title: { $regex: search, $options: 'i' } }
                ]
            }

            var itemCondition = {
                'isDelete': false,
                'isActive': true,
                'storeTypeId': new mongoose.Types.ObjectId(storeTypeId),
                $or: [
                    { itemName: { $regex: search, $options: 'i' } }
                ]
            }
            const catList = await itemCategoryModel.find(catCondition);
            if (catList && catList.length) {
                var arr: any = [];
                for (var i = 0; i < catList.length; i++) {
                    arr.push(new mongoose.Types.ObjectId(catList[i]._id));
                }
                condition = {
                    'isDelete': false,
                    'isActive': true,
                    'online_status': true,
                    'store_openClosing_time': true,
                    'hightItemAmount': { $gte: 1 },
                    'storeTypeId': new mongoose.Types.ObjectId(storeTypeId),
                    'categoryId': { $in: arr }
                }
            }
            const itemList = await vendor_menueItemsModel.find(itemCondition);
            if (itemList && itemList.length) {
                var arr: any = [];
                for (var i = 0; i < itemList.length; i++) {
                    arr.push(new mongoose.Types.ObjectId(itemList[i].storeId));
                }
                condition = {
                    'isDelete': false,
                    'isActive': true,
                    'online_status': true,
                    'hightItemAmount': { $gte: 1 },
                    'store_openClosing_time': true,
                    'storeTypeId': new mongoose.Types.ObjectId(storeTypeId),
                    '_id': { $in: arr }
                }
            }
            if (lat && lng) {
                condition = {
                    ...condition,
                    location: {
                        $geoWithin:
                        {
                            $centerSphere: [[Number(lng), Number(lat)], Number(nearby) / 3963.2]
                        }
                    }
                }
            }
            const shoplist = await vendorStoreModel.aggregate([
                {
                    $addFields: {
                        storeId: { $toObjectId: "$_id" },
                        location: ["$lng", "$lat"]
                    }
                },
                { $match: condition },
            ]);
            const total = await vendorStoreModel.aggregate([
                {
                    $addFields: {
                        storeId: { $toObjectId: "$_id" },
                        location: ["$lng", "$lat"]
                    }
                },
                { $match: condition },
                { $group: { _id: null, n: { $sum: 1 } } }
            ]);
            if (shoplist && shoplist.length) {
                var arr: any = [];
                var point1 = { lat: lat, lng: lng };
                // for (var i = 0; i < shoplist.length; i++) {
                shoplist.map((list) => {
                    var point2 = { lat: list.lat, lng: list.lng };
                    var haversine_m = haversine(point1, point2);
                    var haversine_km = haversine_m / 1000;
                    var obj = {
                        "_id": list._id,
                        "userId": list.userId,
                        "storeTypeId": list.storeTypeId,
                        "streetAddress": list.streetAddress,
                        "notes": list.notes,
                        "branchId": list.branchId,
                        "image": list.image,
                        "main_branchName": list.main_branchName,
                        "phoneNoCountryCode": list.phoneNoCountryCode,
                        "phoneNumber": list.phoneNumber,
                        "branchName": list.branchName,
                        "fullAddress": list.fullAddress,
                        "addressLine1": list.addressLine1,
                        "addressLine2": list.addressLine2,
                        "city": list.city,
                        "state": list.state,
                        "countryCode": list.countryCode,
                        "zipCode": list.zipCode,
                        "googlePlaceId": "",
                        "rating": list.rating,
                        "online_status": list.online_status,
                        "cuisineeId": list.cuisineeId,
                        "hightItemAmount": list.hightItemAmount,
                        "categoryId": list.categoryId,
                        "vegType": list.vegType,
                        "lat": list.lat,
                        "lng": list.lng,
                        "items_count": list.items_count,
                        "isActive": list.isActive,
                        "isDelete": list.isDelete,
                        "createdAt": list.createdAt,
                        "updatedAt": list.updatedAt,
                        "ar_branchName": list.ar_branchName,
                        "ar_main_branchName": list.ar_main_branchName,
                        "country": list.country,
                        "distance": haversine_km
                    };
                    arr.push(obj);
                })

                // }
                var Total: any = total[0].n;
                resolve({ shoplist: arr, total: Total });
            } else {
                resolve({ shoplist, total: 0 });
            }
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
}

export default {
    globalSearchList,
    trending_search,
    vendorShopList
}

// for (var i = 0; i < shoplist.length; i++) {
//     var point2 = { lat: shoplist[i].lat, lng: shoplist[i].lng };
//     var haversine_m = haversine(point1, point2);
//     var haversine_km = haversine_m / 1000;
//     var obj = {
//         "_id": shoplist[i]._id,
//         "userId": shoplist[i].userId,
//         "storeTypeId": shoplist[i].storeTypeId,
//         "streetAddress": shoplist[i].streetAddress,
//         "notes": shoplist[i].notes,
//         "branchId": shoplist[i].branchId,
//         "image": shoplist[i].image,
//         "main_branchName": shoplist[i].main_branchName,
//         "phoneNoCountryCode": shoplist[i].phoneNoCountryCode,
//         "phoneNumber": shoplist[i].phoneNumber,
//         "branchName": shoplist[i].branchName,
//         "fullAddress": shoplist[i].fullAddress,
//         "addressLine1": shoplist[i].addressLine1,
//         "addressLine2": shoplist[i].addressLine2,
//         "city": shoplist[i].city,
//         "state": shoplist[i].state,
//         "countryCode": shoplist[i].countryCode,
//         "zipCode": shoplist[i].zipCode,
//         "googlePlaceId": "",
//         "rating": shoplist[i].rating,
//         "online_status": shoplist[i].online_status,
//         "cuisineeId": shoplist[i].cuisineeId,
//         "hightItemAmount": shoplist[i].hightItemAmount,
//         "categoryId": shoplist[i].categoryId,
//         "vegType": shoplist[i].vegType,
//         "lat": shoplist[i].lat,
//         "lng": shoplist[i].lng,
//         "items_count": shoplist[i].items_count,
//         "isActive": shoplist[i].isActive,
//         "isDelete": shoplist[i].isDelete,
//         "createdAt": shoplist[i].createdAt,
//         "updatedAt": shoplist[i].updatedAt,
//         "ar_branchName": shoplist[i].ar_branchName,
//         "ar_main_branchName": shoplist[i].ar_main_branchName,
//         "country": shoplist[i].country,
//         "distance": haversine_km
//     };
//     arr.push(obj);
// }