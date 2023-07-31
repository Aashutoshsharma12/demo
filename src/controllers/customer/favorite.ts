import { favoriteModel, vendor_menueItemsModel, offerModel } from "../../models/index";
import { CustomError } from "../../utils/errors";
import StatusCodes from "http-status-codes";
import { errors } from "../../constants/index";
import haversine from "haversine-distance";
import mongoose from "mongoose";
import moment from "moment-timezone";
const _ = require('lodash');

function addFavorite(query: any, userId: string, headers: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg: any = errors.en;
        if (headers.language == 'ar') {
            var err_msg: any = errors.ar;
        }
        try {
            const { vendorId, storeId } = query;
            var favData = await favoriteModel.findOne({ 'userId': userId, 'vendorId': vendorId, 'storeId': storeId });
            if (favData) {
                await favoriteModel.deleteOne({ '_id': favData._id });
                resolve({ message: 'success' });
            } else {
                const obj = {
                    userId: userId,
                    vendorId: vendorId,
                    storeId: storeId
                }
                await new favoriteModel(obj).save();
                resolve({ message: 'success' });
            }
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}

function GetFavoriteByVendor(query: any, userId: string, headers: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg: any = errors.en;
        if (headers.language == 'ar') {
            var err_msg: any = errors.ar;
        }
        try {
            const { page = 1, perPage = 10 } = query;
            var favorites = await favoriteModel.find({ 'vendorId': userId }).populate({ path: 'userId' }).skip(perPage * (page - 1)).limit(perPage);
            if (favorites && favorites.length) {
                resolve({ 'favorites': favorites });
            } else {
                resolve({ 'favorites': favorites });
            }
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}

function GetFavoriteByUser(query: any, userId: string, headers: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg: any = errors.en;
        if (headers.language == 'ar') {
            var err_msg: any = errors.ar;
        }
        try {
            const { page = 1, perPage = 10, lat, lng } = query;
            var nearby: any = process.env.approx_distance
            var categoryList = await favoriteModel.find({ 'userId': userId }).populate([{ path: 'storeId', populate: { path: 'cuisineeId', select: 'title ar_title lower_title isActive isDelete' } }]).skip(perPage * (page - 1)).limit(perPage);
            // resolve(categoryList)
            var count = await favoriteModel.countDocuments({ 'userId': userId });
            if (categoryList && categoryList.length) {
                var point1 = { lat: lat, lng: lng };
                const newArray: any = [];
                await Promise.all(categoryList.map(async (list: any) => {
                    var item = false
                    var date = moment().format();
                    // const items = await vendor_menueItemsModel.findOne({ 'storeId': new mongoose.Types.ObjectId(list.storeId._id), isDelete: false, status: true, cuisineCategory_status: true, isActive: true }, { 'itemName': 1 });
                    // var coupandata = await offerModel.findOne({ 'storeId': new mongoose.Types.ObjectId(list.storeId._id), offer_type: 'Percentage', 'isActive': true, 'isDelete': false, 'expiryDate': { $gte: date } }, { 'storeTypeId': 1, 'image': 1, 'couponCode': 1, 'title': 1, 'description': 1, 'offer_type': 1, 'offer_amount': 1, 'startDate': 1, 'upto_Amount': 1, 'expiryDate': 1, 'ar_description': 1, 'ar_title': 1 });
                    const [items, coupandata] = await Promise.all([vendor_menueItemsModel.findOne({ 'storeId': new mongoose.Types.ObjectId(list.storeId._id), isDelete: false, status: true, cuisineCategory_status: true, isActive: true }, { 'itemName': 1 }), offerModel.findOne({ 'storeId': new mongoose.Types.ObjectId(list.storeId._id), offer_type: 'Percentage', 'isActive': true, 'isDelete': false, 'expiryDate': { $gte: date },'startDate': { $lte: date } }, { 'storeTypeId': 1, 'image': 1, 'couponCode': 1, 'title': 1, 'description': 1, 'offer_type': 1, 'offer_amount': 1, 'startDate': 1, 'upto_Amount': 1, 'expiryDate': 1, 'ar_description': 1, 'ar_title': 1 })])
                    if (items) {
                        var item = true
                    }
                    var near_Restaurant = false
                    var point2 = { lat: list.storeId.lat, lng: list.storeId.lng };
                    var haversine_m = haversine(point1, point2);
                    var haversine_km = haversine_m / 1000;
                    if (haversine_km <= nearby) {
                        var near_Restaurant = true
                    }
                    var obj = {
                        _id: list.storeId._id,
                        vendorId: list.storeId.userId,
                        branchName: list.storeId.branchName ? list.storeId.branchName : '',
                        fullAddress: list.storeId.fullAddress ? list.storeId.fullAddress : '',
                        online_status: list.storeId.online_status,
                        image: list.storeId.image ? list.storeId.image : '',
                        rating: list.storeId.rating ? list.storeId.rating : 0,
                        favourite: true,
                        offer: coupandata,
                        cuisinee: list.storeId.cuisineeId,
                        lat: list.storeId.lat,
                        lng: list.storeId.lng,
                        dictance: haversine_km ? haversine_km : 0,
                        near_Restaurant: near_Restaurant,
                        isActive: list.storeId.isActive,
                        updatedAt: list.updatedAt,
                        item: item
                    }
                    newArray.push(obj);
                }))
                resolve({ categegoryItems: newArray.sort((firstItem: any, secondItem: any) => secondItem.updatedAt - firstItem.updatedAt), Total: count });
            } else {
                resolve({ 'categegoryItems': [], Total: 0 });
            }
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}

export default {
    addFavorite,
    GetFavoriteByVendor,
    GetFavoriteByUser
}