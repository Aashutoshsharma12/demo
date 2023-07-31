import { vendor_menueItemsModel, addonsModel, vendor_itemSizeModel, offerModel } from "@models/index";
import { CustomError } from "@utils/errors";
import { StatusCodes } from "http-status-codes";
import { errors } from "@constants";
import moment from "moment-timezone";
import mongoose from "mongoose";
const _ = require('lodash');
const { ObjectId } = require('mongodb');

function catList(query: any, headers: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg: any = errors.en;
        if (headers.language == 'ar') {
            var err_msg: any = errors.ar;
        }
        try {
            const { page = 1, pageSize = 10, search } = query;
            let condition: any = {
                isDelete: false
            }
            if (search && search != '') {
                condition = {
                    ...condition,
                    itemName: { $regex: search, $options: 'i' }
                }
            }
            const categoryList = await vendor_menueItemsModel.find(condition).skip((page * pageSize) - pageSize).limit(pageSize);
            const total = await vendor_menueItemsModel.countDocuments(condition);
            if (categoryList && categoryList.length) {
                resolve({ categoryList, total });
            } else {
                resolve({ categoryList, total });
            }
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
}

// function storeCatItemList(body: any, headers: any): Promise<any> {
//     return new Promise(async (resolve, reject) => {
//         var err_msg: any = errors.en;
//         if (headers.language == 'ar') {
//             var err_msg: any = errors.ar;
//         }
//         try {
//             const { page = 1, perPage = 10, search, storeId, foodCategoryId } = body;
//             let condition: any = {
//                 isDelete: false,
//                 cuisineCategory_status: true,
//                 status: true,
//                 isActive: true,
//                 storeId: ObjectId(storeId)
//             }
//             if (search && search != '') {
//                 condition = {
//                     ...condition,
//                     itemName: { $regex: search, $options: 'i' }
//                 }
//             }

//             if (foodCategoryId && foodCategoryId != '') {
//                 condition = {
//                     ...condition,
//                     foodCategoryId: ObjectId(foodCategoryId)
//                 }
//             }

//             var array = [];
//             var array1 = []
//             var store: any = await vendor_menueItemsModel.aggregate([
//                 {
//                     $addFields: {
//                         foodCatId: "$foodCategoryId",
//                     }
//                 },
//                 {
//                     $lookup: {
//                         localField: "foodCatId",
//                         from: "foodcategories",
//                         foreignField: "_id",
//                         as: "foodcategories",
//                     }
//                 },
//                 { $match: condition },
//                 {
//                     $group: {
//                         _id: "$itemCategoryId",
//                         menu_data: { $push: '$$ROOT' }
//                     }
//                 },
//                 { $sort: { "_id": 1 } },
//                 {
//                     $lookup: {
//                         from: "itemcategories",
//                         localField: "_id",
//                         foreignField: "_id",
//                         as: "category"
//                     }
//                 }
//             ]);
//             console.log(store,"store")
//             //const recommended_store = await vendor_menueItemsModel.find({'isDelete':false,'isActive':true,'storeId':storeId,'recommended':true}).populate({path:'itemCategoryId foodCategoryId',select:'title'}).limit(5);
//             condition = {
//                 ...condition,
//                 recommended: true
//             }
//             const recommended_store = await vendor_menueItemsModel.aggregate([
//                 {
//                     $addFields: {
//                         foodCatId: "$foodCategoryId",
//                     }
//                 },
//                 {
//                     $lookup: {
//                         localField: "foodCatId",
//                         from: "foodcategories",
//                         foreignField: "_id",
//                         as: "foodcategories",
//                     }
//                 },
//                 { $match: condition },
//                 {
//                     $lookup: {
//                         from: "itemcategories",
//                         localField: "itemCategoryId",
//                         foreignField: "_id",
//                         as: "category"
//                     }
//                 },
//                 { $limit: 5 }
//             ]);
//             if (recommended_store && recommended_store.length) {
//                 for (let i1 = 0; i1 < recommended_store.length; i1++) {
//                     // for (let i1 = 0; i1 < store[i].menu_data.length; i1++) {
//                     if (recommended_store[i1].addons == true) {
//                         var condition12: any = {
//                             itemId: recommended_store[i1]._id, isActive: true, isDelete: false
//                         }
//                         const menuItem = await addonsModel.aggregate([
//                             { $match: condition12 },
//                             {
//                                 $group: {
//                                     _id: "$addons_typeId",
//                                     menu_data: { $push: '$$ROOT' }
//                                 }
//                             },
//                             { $sort: { "_id": 1 } },
//                             {
//                                 $lookup: {
//                                     from: "addons_types",
//                                     localField: "_id",
//                                     foreignField: "_id",
//                                     as: "addonsTypes"
//                                 },

//                             },
//                             { $skip: Number((page * perPage) - perPage) },
//                             { $limit: Number(perPage) }
//                         ]);
//                         recommended_store[i1].addons_list = menuItem
//                     }
//                     if (recommended_store[i1].item_size == true) {
//                         var itemSizeList = await vendor_itemSizeModel.find({ itemId: recommended_store[i1]._id, isActive: true, isDelete: false })
//                         recommended_store[i1].vendor_itemsizes = itemSizeList
//                     }

//                     var obj = new Object();
//                     obj = recommended_store[i1];
//                     array1.push(obj);
//                 }
//             }
//             const count = await vendor_menueItemsModel.countDocuments(condition);
//             if (store && store.length) {
//                 for (let i = 0; i < store.length; i++) {
//                     for (let i1 = 0; i1 < store[i].menu_data.length; i1++) {
//                         if (store[i].menu_data[i1].addons == true) {
//                             var condition12: any = {
//                                 itemId: store[i].menu_data[i1]._id, isActive: true, isDelete: false
//                             }
//                             const menuItem = await addonsModel.aggregate([
//                                 { $match: condition12 },
//                                 {
//                                     $group: {
//                                         _id: "$addons_typeId",
//                                         menu_data: { $push: '$$ROOT' }
//                                     }
//                                 },
//                                 { $sort: { "_id": 1 } },
//                                 {
//                                     $lookup: {
//                                         from: "addons_types",
//                                         localField: "_id",
//                                         foreignField: "_id",
//                                         as: "addonsTypes"
//                                     },

//                                 },
//                                 { $skip: Number((page * perPage) - perPage) },
//                                 { $limit: Number(perPage) }
//                             ]);
//                             store[i].menu_data[i1].addons_list = menuItem
//                         }
//                         if (store[i].menu_data[i1].item_size == true) {
//                             var itemSizeList = await vendor_itemSizeModel.find({ itemId: store[i].menu_data[i1]._id, isActive: true, isDelete: false })
//                             store[i].menu_data[i1].vendor_itemsizes = itemSizeList
//                         }
//                     }
//                     var obj = new Object();
//                     obj = store[i];
//                     array.push(obj);
//                 }
//                 resolve({ array, count, recommended: array1 });
//             } else {
//                 resolve({ array: [], count, recommended: array1 });
//             }
//         } catch (error) {
//             console.log(error);
//             reject(error);
//         }
//     });
// }
function storeCatItemList(body: any, headers: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg: any = errors.en;
        if (headers.language == 'ar') {
            var err_msg: any = errors.ar;
        }
        try {
            const { search, storeId, foodCategoryId } = body;
            let condition: any = {
                isDelete: false,
                cuisineCategory_status: true,
                status: true,
                isActive: true,
                storeId: ObjectId(storeId)
            }
            if (search && search != '') {
                condition = {
                    ...condition,
                    itemName: { $regex: search, $options: 'i' }
                }
            }

            if (foodCategoryId && foodCategoryId != '') {
                condition = {
                    ...condition,
                    foodCategoryId: ObjectId(foodCategoryId)
                }
            }
            var array: any = await vendor_menueItemsModel.aggregate([
                {
                    $addFields: {
                        foodCatId: "$foodCategoryId",
                    }
                },
                {
                    $lookup: {
                        localField: "foodCatId",
                        from: "foodcategories",
                        foreignField: "_id",
                        as: "foodcategories",
                    }
                },
                {
                    $lookup: {
                        localField: "_id",
                        from: "addons",
                        foreignField: "itemId",
                        as: "addons_list",
                        pipeline: [
                            {
                                $match: {
                                    isActive: true, isDelete: false
                                }
                            },
                            // {$project:{'title':1,'lower_title':1,'amount':1,'amountIn':1,'addons_typeId':1}},
                            {
                                $group: {
                                    _id: "$addons_typeId",
                                    menu_data: { $push: '$$ROOT' }
                                }
                            },
                            // { $sort: { "_id": 1 } },
                            {
                                $lookup: {
                                    from: "addons_types",
                                    localField: "_id",
                                    foreignField: "_id",
                                    as: "addonsTypes"
                                }

                            },
                        ]
                    }
                },
                {
                    $lookup: {
                        localField: "_id",
                        pipeline: [
                            {
                                $match: {
                                    isActive: true, isDelete: false
                                }
                            },
                            { $project: { 'item_size': 1, 'lower_item_Size': 1, 'amount': 1, 'amountIn': 1 } },
                            { $sort: { amount: 1 } }
                        ],
                        from: "vendor_itemsizes",
                        foreignField: "itemId",
                        as: "vendor_itemsizes",
                    }
                },
                { $match: condition },
                {
                    $group: {
                        _id: "$itemCategoryId",
                        menu_data: { $push: '$$ROOT' }
                    }
                },
                { $sort: { "_id": 1 } },
                {
                    $lookup: {
                        from: "itemcategories",
                        localField: "_id",
                        foreignField: "_id",
                        as: "category"
                    }
                }
            ]);
            const count = await vendor_menueItemsModel.countDocuments(condition);
            condition = {
                ...condition,
                recommended: true
            }
            const recommended_store = await vendor_menueItemsModel.aggregate([
                {
                    $addFields: {
                        foodCatId: "$foodCategoryId",
                    }
                },
                {
                    $lookup: {
                        localField: "foodCatId",
                        from: "foodcategories",
                        foreignField: "_id",
                        as: "foodcategories",
                    }
                },
                {
                    $lookup: {
                        localField: "_id",
                        from: "addons",
                        foreignField: "itemId",
                        as: "addons_list",
                        pipeline: [
                            {
                                $match: {
                                    isActive: true, isDelete: false
                                }
                            },
                            // {$project:{'title':1,'lower_title':1,'amount':1,'amountIn':1,'addons_typeId':1}},
                            {
                                $group: {
                                    _id: "$addons_typeId",
                                    menu_data: { $push: '$$ROOT' }
                                }
                            },
                            // { $sort: { "_id": 1 } },
                            {
                                $lookup: {
                                    from: "addons_types",
                                    localField: "_id",
                                    foreignField: "_id",
                                    as: "addonsTypes"
                                }
                            },
                        ]
                    }
                },
                {
                    $lookup: {
                        localField: "_id",
                        pipeline: [
                            {
                                $match: {
                                    isActive: true, isDelete: false
                                }
                            },
                            { $project: { 'item_size': 1, 'lower_item_Size': 1, 'amount': 1, 'amountIn': 1 } },
                            { $sort: { amount: 1 } }
                        ],
                        from: "vendor_itemsizes",
                        foreignField: "itemId",
                        as: "vendor_itemsizes",
                    }
                },
                { $match: condition },
                {
                    $lookup: {
                        from: "itemcategories",
                        localField: "itemCategoryId",
                        foreignField: "_id",
                        as: "category"
                    }
                },
                { $limit: 5 }
            ]);
            resolve({ array, count, recommended: recommended_store });
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
}

function menuItemList(query: any, headers: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg: any = errors.en;
        if (headers.language == 'ar') {
            var err_msg: any = errors.ar;
        }
        try {
            const { page = 1, perPage = 10, search, itemId } = query;
            let condition: any = {
                isDelete: false,
                isActive: true,
                itemId: ObjectId(itemId),
                // addons_typeId: addons_typeId
            }
            if (search && search != '') {
                condition = {
                    ...condition,
                    title: { $regex: search, $options: 'i' }
                }
            }
            // const menuItem = await addonsModel.find(condition).skip((page * perPage) - perPage).limit(perPage);
            const menuItem = await addonsModel.aggregate([
                { $match: condition },
                {
                    $group: {
                        _id: "$addons_typeId",
                        menu_data: { $push: '$$ROOT' }
                    }
                },
                { $sort: { "_id": 1 } },
                {
                    $lookup: {
                        from: "addons_types",
                        localField: "_id",
                        foreignField: "_id",
                        as: "addonsTypes"
                    },

                },
                { $skip: Number((page * perPage) - perPage) },
                { $limit: Number(perPage) }
            ]);
            const count = await addonsModel.countDocuments(condition);
            if (menuItem && menuItem.length) {
                resolve({ menuItem, count });
            } else {
                resolve({ menuItem, count });
            }
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
}

function menuItemSize(query: any, headers: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg: any = errors.en;
        if (headers.language == 'ar') {
            var err_msg: any = errors.ar;
        }
        try {
            const { page = 1, perPage = 10, search, itemId } = query;
            let condition: any = {
                isDelete: false,
                isActive: true,
                itemId: itemId
            }
            if (search && search != '') {
                condition = {
                    ...condition,
                    item_size: { $regex: search, $options: 'i' },
                }
            }
            const itemSize = await vendor_itemSizeModel.find(condition).sort({ 'amount': 1 }).skip((page * perPage) - perPage).limit(perPage);
            const total = await vendor_itemSizeModel.countDocuments(condition);
            if (itemSize && itemSize.length) {
                resolve({ itemSize, total });
            } else {
                resolve({ itemSize, total });
            }
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
}

function offerlist_forRestaurant(query: any, headers: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { page = 1, perPage = 10, storeId } = query
            var date = moment().tz(headers.timezone);
            let condition: any = {
                "isDelete": false,
                // "startDate": { $lte: new Date(date.year(), date.month(), date.date()+1) },
                // "expiryDate": { $gte: new Date(date.year(), date.month(), date.date()+1) },
                startDate: { $lte: new Date(date.format('YYYY-MM-DD[T00:00:00.000Z]')) },
                expiryDate: { $gte: new Date(date.format('YYYY-MM-DD[T00:00:00.000Z]')) },
                "storeId": { $in: [new mongoose.Types.ObjectId(storeId)] }
            }
            console.log(condition,"popooii")
            const list = await offerModel.aggregate([
                { $match: condition },
                { $project: { "offer_type": 1,"minimum_amount":1, "couponCode": 1, "expiryDate": 1, "offer_amount": 1, "image": 1, "upto_Amount": 1 } },
                { $sort: { createdAt: -1 } },
                { $skip: Number(page - 1) * Number(perPage) },
                { $limit: Number(perPage) }
            ])
            resolve(list)
        } catch (err) {
            reject(err)
        }
    })
}


export default {
    catList,
    storeCatItemList,
    menuItemList,
    menuItemSize,
    offerlist_forRestaurant
}