import { vendor_menueItemsModel, vendorStoreModel, vendor_itemSizeModel } from '../../models/index';
import { CustomError } from '../../utils/errors';
import StatusCodes from 'http-status-codes';
import { errors } from '../../constants/index';
const _ = require('lodash');

//Add Menu Item Size
function addItem_size(data: any, userId: any, headers: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg: any = errors.en;
        if (headers.language == 'ar') {
            var err_msg: any = errors.ar;
        }
        try {
            const obj = {
                "itemId": data.itemId,
                "lower_item_Size": (data.item_size).toLowerCase(),
                "isDelete": false
            };
            const body = {
                ...data,
                lower_item_Size: (data.item_size).toLowerCase(),
                userId
            };
            const check = await vendor_itemSizeModel.findOne(obj);
            if (check) {
                reject(new CustomError(err_msg.alreadyItemSize, StatusCodes.BAD_REQUEST));
            } else {
                const addItem_size = await vendor_itemSizeModel.create(body);
                var size = await vendor_itemSizeModel.find({ 'itemId': data.itemId, isDelete: false, isActive: true }).sort({ 'amount': 1 });
                await vendor_menueItemsModel.updateOne({ _id: data.itemId }, { item_size: true, size_amount: size[0].amount });
                var store: any = await vendor_menueItemsModel.findOne({ '_id': data.itemId }, { 'storeId': 1 });
                var items = await vendor_menueItemsModel.find({ 'storeId': store.storeId, 'isActive': true, 'isDelete': false });
                if (items && items.length) {
                    var arr = [];
                    for (var i = 0; i < items.length; i++) {
                        arr.push(items[i]._id);
                    }
                    var size1 = await vendor_itemSizeModel.find({ 'itemId': arr }).sort({ 'amount': 1 });
                    await vendorStoreModel.updateOne({ _id: store.storeId }, { 'hightItemAmount': size1[size1.length - 1].amount, 'lowItemAmount': size1[0].amount });
                }
                resolve(addItem_size);
            }
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}

//Edit Menu Item Size
function edit(query: any, data: any, userId: any, headers: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg: any = errors.en;
        if (headers.language == 'ar') {
            var err_msg: any = errors.ar;
        }
        try {
            const { itemSizeId } = query;
            if (!itemSizeId) {
                reject(new CustomError(err_msg.requiredsizeId, StatusCodes.BAD_REQUEST));
            } else {
                const obj = {
                    "itemId": data.itemId,
                    "lower_item_Size": (data.item_size).toLowerCase()
                };
                const checkItem_size = await vendor_itemSizeModel.findOne({ _id: itemSizeId, isDelete: false });
                if (checkItem_size) {
                    const body = {
                        ...data,
                        "lower_item_Size": (data.item_size).toLowerCase(),
                        "isDelete": false
                    };
                    const checkItem1: any = await vendor_itemSizeModel.findOne(obj);
                    if (checkItem1) {
                        if (checkItem1._id == itemSizeId) {
                            const edit = await vendor_itemSizeModel.updateOne({ _id: itemSizeId }, { $set: body });
                            var size = await vendor_itemSizeModel.find({ 'itemId': data.itemId, isDelete: false, isActive: true }).sort({ 'amount': 1 });
                            await vendor_menueItemsModel.updateOne({ '_id': data.itemId }, { 'item_size': true, 'size_amount': size[0].amount });
                            var store: any = await vendor_menueItemsModel.findOne({ '_id': data.itemId }, { 'storeId': 1 });
                            var items = await vendor_menueItemsModel.find({ 'storeId': store.storeId, 'isActive': true, 'isDelete': false });
                            if (items && items.length) {
                                var arr = [];
                                for (var i = 0; i < items.length; i++) {
                                    arr.push(items[i]._id);
                                }
                                var size1 = await vendor_itemSizeModel.find({ 'itemId': arr }).sort({ 'amount': 1 });
                                await vendorStoreModel.updateOne({ _id: store.storeId }, { 'hightItemAmount': size1[size1.length - 1].amount, 'lowItemAmount': size1[0].amount });
                            }
                            resolve(edit);
                        } else {
                            reject(new CustomError(err_msg.alreadyItemSize, StatusCodes.BAD_REQUEST));
                        }
                    } else {
                        const edit = await vendor_itemSizeModel.updateOne({ _id: itemSizeId }, { $set: body });
                        var size = await vendor_itemSizeModel.find({ 'itemId': data.itemId, isDelete: false, isActive: true }).sort({ 'amount': 1 });
                        await vendor_menueItemsModel.updateOne({ '_id': data.itemId }, { 'item_size': true, 'size_amount': size[0].amount });
                        var store: any = await vendor_menueItemsModel.findOne({ '_id': data.itemId }, { 'storeId': 1 });
                        var items = await vendor_menueItemsModel.find({ 'storeId': store.storeId, 'isActive': true, 'isDelete': false });
                        if (items && items.length) {
                            var arr = [];
                            for (var i = 0; i < items.length; i++) {
                                arr.push(items[i]._id);
                            }
                            var size1 = await vendor_itemSizeModel.find({ 'itemId': arr }).sort({ 'amount': 1 });
                            await vendorStoreModel.updateOne({ _id: store.storeId }, { 'hightItemAmount': size1[size1.length - 1].amount, 'lowItemAmount': size1[0].amount });
                        }
                        resolve(edit);
                    }
                } else {
                    reject(new CustomError(err_msg.noDatafound, StatusCodes.BAD_REQUEST));
                }
            }
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}

//Get Menu Item Size
function getItemSize(query: any, headers: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg: any = errors.en;
        if (headers.language == 'ar') {
            var err_msg: any = errors.ar;
        }
        try {
            if (!query.itemSizeId) {
                reject(new CustomError(err_msg.requiredsizeId, StatusCodes.BAD_REQUEST));
            }
            const itemSizeDetails = await vendor_itemSizeModel.findOne({ _id: query.itemSizeId }).populate({ path: 'itemId', select: "itemName" });
            if (itemSizeDetails) {
                resolve(itemSizeDetails);
            } else {
                reject(new CustomError(err_msg.noDatafound, StatusCodes.BAD_REQUEST));
            }
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}

//Active Deactive
function updateStatus(query: any, headers: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg: any = errors.en;
        if (headers.language == 'ar') {
            var err_msg: any = errors.ar;
        }
        try {
            if (!query.itemSizeId) {
                reject(new CustomError(err_msg.requiredsizeId, StatusCodes.BAD_REQUEST));
            } else if (!query.isActive) {
                reject(new CustomError(err_msg.requireActive, StatusCodes.BAD_REQUEST));
            } else {
                const itemDetails = await vendor_itemSizeModel.findOne({ _id: query.itemSizeId });
                if (itemDetails) {
                    const update_status = await vendor_itemSizeModel.updateOne({ _id: query.itemSizeId }, { isActive: query.isActive });
                    var count = await vendor_itemSizeModel.count({ itemId: itemDetails.itemId, isDelete: false, isActive: true });
                    if (count > 0) {
                        await vendor_menueItemsModel.updateOne({ _id: itemDetails.itemId }, { item_size: true })
                    } else {
                        await vendor_menueItemsModel.updateOne({ _id: itemDetails.itemId }, { item_size: false })
                    }
                    resolve(update_status);
                } else {
                    reject(new CustomError(err_msg.noDatafound, StatusCodes.BAD_REQUEST));
                }
            }
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}


//Get Menu Item Size
function item_sizeList(query: any, userId: any, headers: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg: any = errors.en;
        if (headers.language == 'ar') {
            var err_msg: any = errors.ar;
        }
        try {
            const { ObjectId } = require('mongodb');
            const { search, page = 1, perPage = 10, itemId } = query;
            if (!itemId) {
                reject(new CustomError(err_msg.requireditem, StatusCodes.BAD_REQUEST));
            }
            let condition: any = { userId: ObjectId(userId), itemId: ObjectId(itemId), isDelete: false };
            if (search) {
                condition = {
                    ...condition,
                    item_size: { $regex: search, $options: 'i' }
                };
            }
            const list = await vendor_itemSizeModel.aggregate([
                {
                    $addFields: {
                        itemId: "$itemId",
                    }
                },
                {
                    $lookup: {
                        localField: "itemId",
                        from: "vendor_menueitems",
                        foreignField: "_id",
                        as: "items"
                    }
                },
                { $match: condition },
                { $sort: { createdAt: -1 } },
                { $skip: Number(page - 1) * Number(perPage) },
                { $limit: Number(perPage) }
            ]);
            resolve({ items: list });
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}

// delete Addons
function delete_itemSize(itemSizeId: any, userId: any, headers: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg: any = errors.en;
        if (headers.language == 'ar') {
            var err_msg: any = errors.ar;
        }
        try {
            var check = await vendor_itemSizeModel.findOne({ _id: itemSizeId });
            if (check) {
                await vendor_itemSizeModel.updateOne({ _id: itemSizeId }, { isDelete: true })
                var count = await vendor_itemSizeModel.count({ itemId: check.itemId, isDelete: false, isActive: true });
                if (count > 0) {
                    await vendor_menueItemsModel.updateOne({ _id: check.itemId }, { item_size: true })
                } else {
                    await vendor_menueItemsModel.updateOne({ _id: check.itemId }, { item_size: false })
                }
                resolve({ success: true })
            }

        } catch (err) {
            reject(err)
        }
    })
}

export default {
    addItem_size,
    edit,
    getItemSize,
    updateStatus,
    item_sizeList,
    delete_itemSize
} as const;