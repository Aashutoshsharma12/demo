import { vendor_menueItemsModel, offerModel, addonsModel, itemCategoryModel, vendorStoreModel, addressModel, storeTypeModel, searchModel, favoriteModel } from "../../models/index";
import { CustomError } from "../../utils/errors";
import StatusCodes from "http-status-codes";
import { errors } from "../../constants/index";
import haversine from "haversine-distance";
import mongoose from "mongoose";
import moment from "moment-timezone";
import { json } from "stream/consumers";
import { ObjectIdLike } from "bson";
import { ObjectId } from "mongodb";
import { all } from "promise";
import { updateOne } from "@models/customer";
import { array } from "joi";
//const ObjectId = require('mongodb').ObjectID;
const _ = require('lodash');
const merge = (first: any[], second: string | any[]) => {
    for (let i = 0; i < second.length; i++) {
        first.push(second[i]);
    }
    return first;
}

function storeType_list(query: any, headers: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg: any = errors.en;
        if (headers.language == 'ar') {
            var err_msg: any = errors.ar;
        }
        try {
            const { page = 1, perPage = 10, search, status } = query;
            let condition: any = {
                isDelete: false,
                isActive: true
            }
            if (search && search != '' && status) {
                condition = {
                    ...condition,
                    isActive: status,
                    storeType: { $regex: search, $options: 'i' }
                }
            } else if (search && search != '') {
                condition = {
                    ...condition,
                    storeType: { $regex: search, $options: 'i' }
                }
            }
            var list: any = await storeTypeModel.find(condition).sort({ createdAt: -1 }).skip((page * perPage) - perPage).limit(perPage);
            if (search && search != '') {
                var list: any = await storeTypeModel.find(condition).sort({ createdAt: -1 });
            }
            if (list && list.length) {
                var listing = list;
                if (search && search != '') {
                    condition = {
                        ...condition,
                        storeType: { $not: { $regex: search, $options: 'i' } }
                    }
                    var list1: any = await storeTypeModel.find(condition).sort({ createdAt: -1 });
                    listing = merge(list, list1);
                }
                resolve({ items: listing });
            } else {
                resolve({ items: list });
            }
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}

function shopList(query: any, headers: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg: any = errors.en;
        if (headers.language == 'ar') {
            var err_msg: any = errors.ar;
        }
        try {
            const { page = 1, perPage = 10, search } = query;
            let condition: any = {
                isDelete: false
            }
            if (search && search != '') {
                condition = {
                    ...condition,
                    storeType: { $regex: search, $options: 'i' }
                }
            }
            const shopList = await storeTypeModel.find(condition).skip((page * perPage) - perPage).limit(perPage);
            const total = await storeTypeModel.countDocuments(condition);
            if (shopList) {
                resolve({ shopList, total });
            } else {
                resolve({ shopList, total });
            }
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
}

function categoryList(query: any, headers: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg: any = errors.en;
        if (headers.language == 'ar') {
            var err_msg: any = errors.ar;
        }
        try {
            const { page = 1, perPage = 10, lat, lng, search, storetypeId } = query;
            const near: any = process.env.approx_distance
            var nearby: any = near * 0.621371
            let condition: any = {
                isDelete: false,
                storeTypeId: new mongoose.Types.ObjectId(storetypeId),
                isActive: true
            }
            if (search && search != '') {
                condition = {
                    ...condition,
                    title: { $regex: search, $options: 'i' }
                }
            }
            let condition1: any = {
                'isDelete': false,
                'isActive': true,
                'online_status': true,
                'store_openClosing_time':true
            }

            if (lat && lng) {
                condition1 = {
                    ...condition1,
                    location: {
                        $geoWithin:
                        {
                            $centerSphere: [[Number(lng), Number(lat)], Number(nearby) / 3963.2]
                        }
                    }
                }
            }

            const categoryList = await itemCategoryModel.aggregate([
                { $match: condition },
                { $sort: { createdAt: -1 } },
                // { $skip: Number(page - 1) * Number(perPage) },
                // { $limit: Number(perPage) }
            ]);
            const Total = await itemCategoryModel.countDocuments(condition);
            if (categoryList && categoryList.length) {
                var arrData: any = [];
                await Promise.all(categoryList.map(async (list: any) => {
                    const obj = {
                        _id: list._id,
                        storeTypeId: list.storeTypeId,
                        title: list.title,
                        lower_title: list.lower_title,
                        addBy: list.addBy,
                        ar_title: list.ar_title,
                        image: list.image,
                        isActive: list.isActive,
                        isDelete: list.isDelete,
                        createdAt: list.createdAt,
                        updatedAt: list.updatedAt,
                        resturantCount: 1
                    }
                    condition1 = {
                        ...condition1,
                        categoryId: { $in: [(list._id)] },
                        hightItemAmount: { $gt: 0 },
                        storeTypeId: new mongoose.Types.ObjectId(storetypeId)
                    }
                    const TotalResturant: any = await vendorStoreModel.aggregate([
                        {
                            $addFields: {
                                storeId: { $toObjectId: "$_id" },
                                location: ["$lng", "$lat"]
                            }
                        },
                        { $match: condition1 },
                        { $group: { _id: null, n: { $sum: 1 } } }
                    ]);
                    if (TotalResturant && TotalResturant.length) {
                        arrData.push(obj);
                    }
                }));
                resolve({ categegoryItems: arrData, Total: Total });
            } else {
                resolve({ categegoryItems: [], Total: Total });
            }

        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
}

function itemList(query: any, headers: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg: any = errors.en;
        if (headers.language == 'ar') {
            var err_msg: any = errors.ar;
        }
        try {
            const { page = 1, perPage = 10, search, itemId } = query;
            let condition: any = {
                isDelete: false,
                itemId: itemId,
                isActive: true
            }
            if (search && search != '') {
                condition = {
                    ...condition,
                    $or: [{
                        title: { $regex: search, $options: 'i' }
                    }]
                }
            }
            const itemList = await addonsModel.find(condition).skip((page * perPage) - perPage).limit(perPage);
            const total = await addonsModel.countDocuments(condition);
            if (itemList && itemList.length) {
                resolve({ itemList, total });
            } else {
                resolve({ itemList, total });
            }
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
}

function nearestRestaurant(body: any, userId: string, headers: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg: any = errors.en;
        if (headers.language == 'ar') {
            var err_msg: any = errors.ar;
        }
        try {
            const { lat, lng } = body;
            const address = {
                ...body,
                userId
            }
            const availableAddress = await vendorStoreModel.find({ isDelete: false, isActive: true });
            if (availableAddress && availableAddress.length) {
                let i;
                const unit: any = "K";
                const array: any = [];
                const lat1 = lat;
                const lon1 = lng;
                for (i = 0; i < availableAddress.length; i++) {
                    var lat2: any = availableAddress[i].lat;
                    var lon2: any = availableAddress[i].lng;
                    var lat2: any = availableAddress[i].lat;
                    var lon2: any = availableAddress[i].lng;
                    var radlat1 = Math.PI * lat1 / 180;
                    var radlat2 = Math.PI * lat2 / 180;
                    var theta = lon1 - lon2;
                    var radtheta = Math.PI * theta / 180;
                    var dist:any = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
                    if (dist > 1) {
                        dist = 1;
                    }
                    dist = Math.acos(dist);
                    dist = dist * 180 / Math.PI;
                    dist = dist * 60 * 1.1515;
                    if (unit == "K") { dist = dist * 1.609344 }
                    if (unit == "N") { dist = dist * 0.8684 }
                    if (dist <= 8 || dist == 'NaN') {
                        array.push(availableAddress[i]);
                    }
                }
                if (array && array.length && array.length != 0) {
                    const checkAddress = await addressModel.find({ userId: userId, isDelete: false });
                    if (checkAddress && checkAddress.length) {
                        await addressModel.updateMany({ userId: userId, isDelete: false }, { isDelete: true });
                    }
                    await addressModel.create(address);
                    resolve({ vendor: true });
                } else {
                    resolve({ vendor: false });
                }
            } else {
                reject(new CustomError(err_msg.invalidAddress, StatusCodes.BAD_REQUEST));
            }
        } catch (error) {
            console.log(error);
            if (error.code == 11000) {
                reject(new CustomError(err_msg.addressExist, StatusCodes.BAD_REQUEST));
            }
            reject(error);
        }
    });
}

function getRestaurant(query: any, userId: string, headers: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg: any = errors.en;
        if (headers.language == 'ar') {
            var err_msg: any = errors.ar;
        }
        try {
            const { page = 1, perPage = 10, search, lat, lng, sorting, storeTypeId, cuisineeId, categoryId, veg_type, filterRating } = query;
            var shortingData: any = { 'createdAt': -1 };
            const near: any = process.env.approx_distance
            var nearby: any = near * 0.621371
            if (sorting == 'lth') {
                var shortingData: any = { 'lowItemAmount': 1 };
            }
            if (sorting == 'htl') {
                var shortingData: any = { 'hightItemAmount': -1 };
            }
            if (sorting == 'rating') {
                var shortingData: any = { 'rating': -1 };
            }
            let condition: any = {
                'isDelete': false,
                'isActive': true,
                'online_status': true,
                'hightItemAmount': { $gte: 1 },
                'store_openClosing_time':true
            }

            if (categoryId) {
                condition = {
                    ...condition,
                    categoryId: { $in: [new mongoose.Types.ObjectId(categoryId)] }
                    // categoryId: { $in: [(categoryId)] }
                }
            }
            if (cuisineeId) {
                var cu: any = JSON.parse(cuisineeId);
                if (cu && cu.length) {
                    let objectIdArray: any = cu.map((s: any) => new mongoose.Types.ObjectId(s));
                    condition = {
                        ...condition,
                        cuisineeId: { $in: objectIdArray }
                    }
                }
            }

            if (veg_type) {
                condition = {
                    ...condition,
                    vegType: { $in: [new mongoose.Types.ObjectId(veg_type)] }
                }
            }

            if (filterRating) {
                condition = {
                    ...condition,
                    rating: { $gte: Number(filterRating) }
                }
            }

            if (search && search != '') {
                condition = {
                    ...condition,
                    branchName: { $regex: search, $options: 'i' }
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

            if (storeTypeId) {
                condition = {
                    ...condition,
                    storeTypeId: new mongoose.Types.ObjectId(storeTypeId)
                }
            }
            const categoryList: any = await vendorStoreModel.aggregate([
                {
                    $addFields: {
                        storeId: { $toObjectId: "$_id" },
                        location: ["$lng", "$lat"]
                    }
                },
                {
                    $lookup: {
                        localField: "storeId",
                        from: "vendor_menueitems",
                        foreignField: "storeId",
                        as: "vendorMenu",
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
                { $match: condition },
                { $project: { '_id': 1, 'storeTypeId': 1, 'branchName': 1, 'lowItemAmount': 1, 'hightItemAmount': 1, 'lat': 1, 'lng': 1, 'rating': 1, 'userId': 1, 'image': 1, "vendorMenu.itemName": 1, 'fullAddress': 1, 'cuisinee': 1, 'isActive': 1, 'online_status': 1, 'city': 1 } },
                { $sort: shortingData },
                { $skip: Number(page - 1) * Number(perPage) },
                { $limit: Number(perPage) }
            ]);
            const Total: any = await vendorStoreModel.aggregate([
                {
                    $addFields: {
                        storeId: { $toObjectId: "$_id" },
                        location: ["$lng", "$lat"]
                    }
                },
                { $match: condition },
                { $group: { _id: null, n: { $sum: 1 } } }
            ]);
            var newArray: any = [];
            if (categoryList && categoryList.length) {
                var point1 = { lat: lat, lng: lng };
                await Promise.all(categoryList.map(async (list: any) => {
                    var point2 = { lat: list.lat, lng: list.lng };
                    var haversine_m = haversine(point1, point2);
                    var haversine_km = haversine_m / 1000;
                    var favourite = false;
                    var date = moment().tz(headers.timezone).format('YYYY-MM-DD');
                    // var coupandata = await offerModel.findOne({ 'storeId': new mongoose.Types.ObjectId(list._id), 'isActive': true, 'isDelete': false, "offer_type": "Percentage", 'expiryDate': { $gte: date }, 'startDate': { $lte: date } }, { expiryDate: 1, offer_type: 1, offer_amount: 1 });
                    // var favData = await favoriteModel.findOne({ 'userId': new mongoose.Types.ObjectId(userId), 'storeId': list._id }, { _id: 1 });

                    const [coupandata, favData] = await Promise.all([offerModel.findOne({ 'storeId': new mongoose.Types.ObjectId(list._id), 'isActive': true, 'isDelete': false, "offer_type": "Percentage", 'expiryDate': { $gte: date }, 'startDate': { $lte: date } }, { expiryDate: 1, offer_type: 1, offer_amount: 1 }),
                    favoriteModel.findOne({ 'userId': new mongoose.Types.ObjectId(userId), 'storeId': list._id }, { _id: 1 })])
                    if (favData) {
                        var favourite = true;
                    }
                    // if (haversine_km > near) {
                    //     var obj: any = {
                    //         near_restaurantAvailable: false,
                    //         isActive: list.isActive,
                    //         online_status: list.online_status,
                    //         hightItemAmount: list.hightItemAmount,
                    //     }
                    // } else {
                        var obj: any = {
                            _id: list._id,
                            vendorId: list.userId,
                            branchName: list.branchName ? list.branchName : '',
                            fullAddress: list.fullAddress ? list.fullAddress : '',
                            city: list.city ? list.city : '',
                            image: list.image ? list.image : '',
                            rating: list.rating ? list.rating : 0,
                            favourite: favourite,
                            near_restaurantAvailable: true,
                            isActive: list.isActive,
                            online_status: list.online_status,
                            hightItemAmount: list.hightItemAmount,
                            offer: coupandata,
                            cuisinee: list.cuisinee,
                            lat: list.lat,
                            lng: list.lng,
                            dictance: haversine_km ? haversine_km : 0,
                            // itemName1: items
                        }
                    // }
                    newArray.push(obj)
                }))
                resolve({ categegoryItems: newArray, Total: Total[0].n });
            } else {
                resolve({ categegoryItems: [], Total: 0 });
            }
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
}

function searchSave(query: any, userId: string, headers: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg: any = errors.en;
        if (headers.language == 'ar') {
            var err_msg: any = errors.ar;
        }
        try {
            const { title, storeTypeId } = query;
            var obj = {
                'userId': userId,
                'title': title,
                'storeTypeId': storeTypeId,
                'lower_title': title.toLowerCase()
            }
            trendingupdate(obj)
            var searchData = await searchModel.findOne({ 'storeTypeId': storeTypeId, 'userId': userId, 'lower_title': title.toLowerCase() });
            if (searchData) {
                await searchModel.updateOne({ _id: searchData._id }, obj)
                resolve({ 'message': 'Success' });
            } else {
                await new searchModel(obj).save();
                resolve({ 'message': 'Success' });
            }
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
}

var trendingupdate = async (data: any) => {
    var searchData = await searchModel.count({ 'storeTypeId': data.storeTypeId, 'lower_title': data.lower_title });
    await searchModel.updateMany({ 'storeTypeId': data.storeTypeId, 'lower_title': data.lower_title }, { count: searchData });
}

function getSearchData(query: any, userId: string, headers: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg: any = errors.en;
        if (headers.language == 'ar') {
            var err_msg: any = errors.ar;
        }
        try {
            var ResearchData = await searchModel.find({ 'storeTypeId': query.storeTypeId, 'userId': userId }).sort({ 'updatedAt': -1 }).limit(10);
            var trandingData = await searchModel.find({ 'storeTypeId': query.storeTypeId }).sort({ 'count': -1 }).limit(10);
            var uniq: any = {};
            var arrFiltered = trandingData.filter(obj => !uniq[obj.lower_title] && (uniq[obj.lower_title] = true));
            resolve({ 'RecentSearch': ResearchData, 'trandingData': arrFiltered });
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
}

function coupanList(userId: string, headers: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg: any = errors.en;
        if (headers.language == 'ar') {
            var err_msg: any = errors.ar;
        }
        try {
            var enddate = moment().format();
            var coupan = await offerModel.find({ 'isDelete': false, 'isActive': true, 'expireDate': { $gte: enddate }, 'addBy': true }).limit(20);
            resolve(coupan);
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
}

function restaurant_details(query: any, userId: any, headers: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg: any = errors.en;
        if (headers.language == 'ar') {
            var err_msg: any = errors.ar;
        }
        try {
            const { lat, lng, storeId } = query
            var obj: any = {}
            var details = await vendorStoreModel.aggregate([

                {
                    $lookup: {
                        localField: "cuisineeId",
                        from: "cusinecategories",
                        foreignField: "_id",
                        as: "cuisinee",
                    }
                },
                { $match: { _id: new mongoose.Types.ObjectId(storeId) } }
            ])
            if (details.length) {
                var favourite: any = false
                var point1 = { lat: lat, lng: lng }
                var point2 = { lat: details[0].lat, lng: details[0].lng }
                var haversine_m = haversine(point1, point2);
                var haversine_km = haversine_m / 1000;
                var favData = await favoriteModel.findOne({ 'userId': new mongoose.Types.ObjectId(userId), 'storeId': storeId });
                if (favData) {
                    var favourite: any = true;
                }
                obj = {
                    _id: details[0]._id,
                    vendorId: details[0].userId,
                    branchName: details[0].branchName ? details[0].branchName : '',
                    fullAddress: details[0].fullAddress ? details[0].fullAddress : '',
                    image: details[0].image ? details[0].image : '',
                    rating: details[0].rating ? details[0].rating : 0,
                    // online_status: details[0].online_status,
                    // hightItemAmount: details[0].hightItemAmount,
                    // isActive: details[0].isActive,
                    // near_restaurantAvailable: true,
                    favourite: favourite,
                    cuisinee: details[0].cuisinee,
                    lat: details[0].lat,
                    lng: details[0].lng,
                    dictance: haversine_km ? haversine_km : 0
                }
            }
            resolve(obj)
        } catch (err) {
            reject(err)
        }
    })
}

function restaurant_listAccordingto_offer(data: any, userId: any, headers: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { storeId, lat, lng } = data
            var storeId1 = storeId.split(',')
            const near: any = process.env.approx_distance
            var nearby: any = near * 0.621371
            var array: any = []
            if (storeId1 && storeId1.length && lat && lng) {
                await Promise.all(storeId1.map(async (list: any) => {
                    const restaurant_list = await vendorStoreModel.aggregate([
                        {
                            $addFields: {
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
                        {
                            $match: {
                                _id: new mongoose.Types.ObjectId(list), isActive: true,
                                online_status: true,
                                hightItemAmount: { $gt: 0 },
                                location: {
                                    $geoWithin:
                                    {
                                        $centerSphere: [[Number(lng), Number(lat)], Number(nearby) / 3963.2]
                                    }
                                }
                            }
                        }
                    ])
                    if (restaurant_list.length) {
                        var point1 = { lat: lat, lng: lng }
                        var point2 = { lat: restaurant_list[0].lat, lng: restaurant_list[0].lng };
                        var haversine_m = haversine(point1, point2);
                        var haversine_km = haversine_m / 1000;
                        var favourite = false;
                        var date = moment().tz(headers.timezone).format('YYYY-MM-DD');
                        var coupandata = await offerModel.findOne({ 'storeId': new mongoose.Types.ObjectId(list), 'isActive': true, 'isDelete': false, "offer_type": "Percentage", 'expiryDate': { $gte: date } });
                        var favData = await favoriteModel.findOne({ 'userId': new mongoose.Types.ObjectId(userId), 'storeId': list });
                        if (favData) {
                            var favourite = true;
                        }
                        var obj: any = {
                            _id: restaurant_list[0]._id,
                            vendorId: restaurant_list[0].userId,
                            branchName: restaurant_list[0].branchName ? restaurant_list[0].branchName : '',
                            fullAddress: restaurant_list[0].fullAddress ? restaurant_list[0].fullAddress : '',
                            image: restaurant_list[0].image ? restaurant_list[0].image : '',
                            rating: restaurant_list[0].rating ? restaurant_list[0].rating : 0,
                            favourite: favourite,
                            near_restaurantAvailable: true,
                            isActive: restaurant_list[0].isActive,
                            online_status: restaurant_list[0].online_status,
                            hightItemAmount: restaurant_list[0].hightItemAmount,
                            offer: coupandata,
                            cuisinee: restaurant_list[0].cuisinee,
                            lat: restaurant_list[0].lat,
                            lng: restaurant_list[0].lng,
                            dictance: haversine_km ? haversine_km : 0,
                            // itemName1: items
                        }
                        array.push(obj)
                    }
                }))
                resolve({ categegoryItems: array })
            }
            resolve({ categegoryItems: array })
        } catch (err) {
            reject(err)
        }
    })
}

export default {
    storeType_list,
    shopList,
    categoryList,
    itemList,
    nearestRestaurant,
    getRestaurant,
    searchSave,
    getSearchData,
    coupanList,
    restaurant_details,
    restaurant_listAccordingto_offer
}

 // for (var i = 0; i < categoryList.length; i++) {
                //     // const items = await vendor_menueItemsModel.find({ 'storeId': new mongoose.Types.ObjectId(categoryList[i]._id), 'isActive': true }, { 'itemName': 1 });
                //     var point2 = { lat: categoryList[i].lat, lng: categoryList[i].lng };
                //     var haversine_m = haversine(point1, point2);
                //     var haversine_km = haversine_m / 1000;
                //     var favourite = false;
                //     var date = moment().tz(headers.timezone).format('YYYY-MM-DD');
                //     var coupandata = await offerModel.findOne({ 'storeId': new mongoose.Types.ObjectId(categoryList[i]._id), 'isActive': true, 'isDelete': false, 'expiryDate': { $gte: date } });
                //     var favData = await favoriteModel.findOne({ 'userId': new mongoose.Types.ObjectId(userId), 'storeId': categoryList[i]._id });
                //     if (favData) {
                //         var favourite = true;
                //     }
                //     var obj = {
                //         _id: categoryList[i]._id,
                //         vendorId: categoryList[i].userId,
                //         branchName: categoryList[i].branchName ? categoryList[i].branchName : '',
                //         fullAddress: categoryList[i].fullAddress ? categoryList[i].fullAddress : '',
                //         image: categoryList[i].image ? categoryList[i].image : '',
                //         rating: categoryList[i].rating ? categoryList[i].rating : 0,
                //         favourite: favourite,
                //         offer: coupandata,
                //         cuisinee: categoryList[i].cuisinee,
                //         lat: categoryList[i].lat,
                //         lng: categoryList[i].lng,
                //         dictance: haversine_km ? haversine_km : 0,
                //         // itemName1: items
                //     }
                //     newArray.push(obj);
                // }

                // for (var i = 0; i < categoryList.length; i++) {
                //     const obj = {
                //         _id: categoryList[i]._id,
                //         storeTypeId: categoryList[i].storeTypeId,
                //         title: categoryList[i].title,
                //         lower_title: categoryList[i].lower_title,
                //         addBy: categoryList[i].addBy,
                //         ar_title: categoryList[i].ar_title,
                //         image: categoryList[i].image,
                //         isActive: categoryList[i].isActive,
                //         isDelete: categoryList[i].isDelete,
                //         createdAt: categoryList[i].createdAt,
                //         updatedAt: categoryList[i].updatedAt,
                //         resturantCount: 1
                //     }
                //     condition1 = {
                //         ...condition1,
                //         categoryId: { $in: [(categoryList[i]._id)] },
                //         hightItemAmount: { $gt: 0 },
                //         storeTypeId: new mongoose.Types.ObjectId(storetypeId)
                //     }
                //     console.log(categoryList[0], "category", condition1)
                //     const TotalResturant: any = await vendorStoreModel.aggregate([
                //         {
                //             $addFields: {
                //                 storeId: { $toObjectId: "$_id" },
                //                 location: ["$lng", "$lat"]
                //             }
                //         },
                //         { $match: condition1 },
                //         { $group: { _id: null, n: { $sum: 1 } } }
                //     ]);
                //     if (TotalResturant && TotalResturant.length) {
                //         arrData.push(obj);
                //     }
                // }

