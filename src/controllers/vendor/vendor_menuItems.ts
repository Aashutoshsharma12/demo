import { cusineCategoryModel, foodCategoryModel, itemCategoryModel, vendor_itemSizeModel, vendorStoreModel, vendorStoreTypeModel, vendor_menueItemsModel, addonsModel } from '../../models/index';
import { CustomError } from '../../utils/errors';
import StatusCodes from 'http-status-codes';
import { errors } from '../../constants/index';
import { string } from 'joi';
const _ = require('lodash');


//update vendor store category and cuisine
var updateVendorStore = async (data1: any) => {
    var itemData: any = await vendor_menueItemsModel.find({ 'storeId': data1.storeId, isDelete: false, status:true,cuisineCategory_status:true, isActive: true }).sort({ 'amount': 1 });
    if (itemData && itemData.length) {
        var arr = [];
        for (var i = 0; i < itemData.length; i++) {
            arr.push(itemData[i]._id);
        }
        var size1 = await vendor_itemSizeModel.find({ 'itemId': arr, isDelete: false, 'isActive': true }).sort({ 'amount': 1 });
        if (size1 && size1.length) {
            await vendorStoreModel.updateOne({ _id: data1.storeId }, { 'hightItemAmount': size1[size1.length - 1].amount, 'lowItemAmount': size1[0].amount });
        } else {
            await vendorStoreModel.updateOne({ '_id': data1.storeId }, { $set: { 'hightItemAmount': itemData[itemData.length - 1].amount, 'lowItemAmount': itemData[0].amount } });
        }
    }
    var vegType = []
    var categoryId = []
    var cuisineeId = []
    const list: any = await vendor_menueItemsModel.find({ storeId: data1.storeId, isDelete: false }, { itemCategoryId: 1, cuisineCategoryId: 1, foodCategoryId: 1 })
    if (list && list.length) {
        for (let i = 0; i < list.length; i++) {
            vegType.push(list[i].foodCategoryId)
            cuisineeId.push((list[i].cuisineCategoryId).toString())
            categoryId.push((list[i].itemCategoryId).toString())
        }
    } else {
        var vegType = [data1.foodCategoryId]
        var categoryId = [data1.itemCategoryId]
        var cuisineeId = [data1.cuisineCategoryId]
    }
    function removeDuplicates(cuisineeId: any) {
        return cuisineeId.filter((item: any,
            index: any) => cuisineeId.indexOf(item) === index);
    }
    function removeDuplicate(categoryId: any) {
        return categoryId.filter((item: any,
            index: any) => categoryId.indexOf(item) === index);
    }
    var cuisineeId1 = removeDuplicates(cuisineeId)
    var categoryId1 = removeDuplicate(categoryId)
    await vendorStoreModel.updateOne({ _id: data1.storeId }, { vegType: vegType, cuisineeId: cuisineeId1, categoryId: categoryId1 })
}
var updateVendorStore12 = async (data1: any) => {
    var vegType: any = []
    var categoryId: any = []
    var cuisineeId: any = []
    var itemId: any = data1.itemId
    const list1: any = await vendor_menueItemsModel.findOne({ _id: itemId }, { storeId: 1 })
    const list: any = await vendor_menueItemsModel.find({ storeId: list1.storeId, isDelete: false,status:true,cuisineCategory_status:true, isActive: true  }, { storeId: 1, itemCategoryId: 1, cuisineCategoryId: 1, foodCategoryId: 1 })
    if (list && list.length) {
        for (let i = 0; i < list.length; i++) {
            vegType.push(list[i].foodCategoryId)
            cuisineeId.push((list[i].cuisineCategoryId).toString())
            categoryId.push((list[i].itemCategoryId).toString())
        }
        function removeDuplicates(cuisineeId: any) {
            return cuisineeId.filter((item: any,
                index: any) => cuisineeId.indexOf(item) === index);
        }
        function removeDuplicate(categoryId: any) {
            return categoryId.filter((item: any,
                index: any) => categoryId.indexOf(item) === index);
        }
        var cuisineeId1 = removeDuplicates(cuisineeId)
        var categoryId1 = removeDuplicate(categoryId)
    } else {
        var cuisineeId1: any = []
        var categoryId1: any = []
        var vegType: any = []
    }
    await vendorStoreModel.updateOne({ _id: list1.storeId }, { vegType: vegType, cuisineeId: cuisineeId1, categoryId: categoryId1 })
}
var high_amount = async (data1: any) => {
    const list1: any = await vendor_menueItemsModel.findOne({ _id: data1.itemId }, { storeId: 1 })
    var itemData: any = await vendor_menueItemsModel.find({ 'storeId': list1.storeId, isDelete: false,isActive:true,status:true,cuisineCategory_status:true }).sort({ 'amount': 1 });
    if (itemData && itemData.length) {
        var arr = [];
        for (var i = 0; i < itemData.length; i++) {
            arr.push(itemData[i]._id);
        }
        var size1 = await vendor_itemSizeModel.find({ 'itemId': arr,isActive:true,isDelete:false }).sort({ 'amount': 1 });
        if (size1 && size1.length) {
            await vendorStoreModel.updateOne({ _id: list1.storeId }, { 'hightItemAmount': size1[size1.length - 1].amount, 'lowItemAmount': size1[0].amount });
        } else {
            await vendorStoreModel.updateOne({ '_id': list1.storeId }, { $set: { 'hightItemAmount': itemData[itemData.length - 1].amount, 'lowItemAmount': itemData[0].amount } });
        }
    } else {
        await vendorStoreModel.updateOne({ '_id': list1.storeId }, { $set: { 'hightItemAmount': 0, 'lowItemAmount': 0 } });
    }
}

// Add Menu_Items
function addItems(data: any, userId: any, image: any, headers: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg: any = errors.en;
        if (headers.language == 'ar') {
            var err_msg: any = errors.ar;
        }
        try {
            const obj = {
                "userId": userId,
                "storeId": data.storeId,
                "foodCategoryId": data.foodCategoryId,
                "itemCategoryId": data.itemCategoryId,
                "cuisineCategoryId": data.cuisineCategoryId,
                "lower_itemName": (data.itemName).toLowerCase(),
                "recommended": data.recommended,
                "isDelete": false
            };
            const check = await vendor_menueItemsModel.findOne(obj);
            if (check) {
                reject(new CustomError(err_msg.menuItemExists, StatusCodes.BAD_REQUEST));
            } else {
                const body = {
                    ...data,
                    image: image,
                    lower_itemName: (data.itemName).toLowerCase(),
                    userId
                };
                const addItems = await vendor_menueItemsModel.create(body);
                var data1: any = {
                    'storeId': data.storeId,
                    "foodCategoryId": data.foodCategoryId,
                    "itemCategoryId": data.itemCategoryId,
                    "cuisineCategoryId": data.cuisineCategoryId
                }
                updateVendorStore(data1);
                resolve(addItems);
            }
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}

// Edit Menu_Items
function edit(query: any, data: any, userId: any, image: any, headers: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg: any = errors.en;
        if (headers.language == 'ar') {
            var err_msg: any = errors.ar;
        }
        try {
            const { itemId } = query;
            if (!itemId) {
                reject(new CustomError(err_msg.requireditem, StatusCodes.BAD_REQUEST));
            } else {
                const obj = {
                    "stoteId": data.storeId,
                    "foodCategoryId": data.foodCategoryId,
                    "itemCategoryId": data.itemCategoryId,
                    "cuisineCategoryId": data.cuisineCategoryId,
                    "lower_itemName": (data.itemName).toLowerCase(),
                    "userId": userId,
                    "isDelete": false
                };
                const checkItem = await vendor_menueItemsModel.findOne({ _id: itemId });
                if (checkItem) {
                    const body = {
                        ...data,
                        itemId,
                        lower_itemName: (data.itemName).toLowerCase(),
                        image: image ? image[0].path : checkItem.image,
                        recommended: data.recommended ? data.recommended : checkItem.recommended,
                        status: true
                    };
                    var data1: any = {
                        'storeId': data.storeId,
                        "foodCategoryId": data.foodCategoryId,
                        "itemCategoryId": data.itemCategoryId,
                        "cuisineCategoryId": data.cuisineCategoryId,
                    }
                    const checkItem1: any = await vendor_menueItemsModel.findOne(obj);
                    if (checkItem1) {
                        if (checkItem1._id == itemId) {
                            const edit = await vendor_menueItemsModel.updateOne({ _id: itemId }, { $set: body });
                            updateVendorStore(data1)
                            resolve(edit);
                        } else {
                            reject(new CustomError(err_msg.menuItemExists, StatusCodes.BAD_REQUEST));
                        }
                    } else {
                        const edit = await vendor_menueItemsModel.updateOne({ _id: itemId }, { $set: body });
                        updateVendorStore(data1);
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

// get Menu Items
function getMenuItems(query: any, headers: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg: any = errors.en;
        if (headers.language == 'ar') {
            var err_msg: any = errors.ar;
        }
        try {
            if (!query.itemId) {
                reject(new CustomError("ItemId required.", StatusCodes.BAD_REQUEST));
            }
            const itemDetails = await vendor_menueItemsModel.findOne({ _id: query.itemId, isDelete: false }).populate([{ path: 'foodCategoryId' }, { path: 'itemCategoryId' }, { path: 'cuisineCategoryId' }, { path: 'storeTypeId' }]);
            if (itemDetails) {
                resolve(itemDetails);
            } else {
                reject(new CustomError(err_msg.noDatafound, StatusCodes.BAD_REQUEST));
            }
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}

// Active Deactive
function updateStatus(query: any, headers: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg: any = errors.en;
        if (headers.language == 'ar') {
            var err_msg: any = errors.ar;
        }
        try {
            if (!query.itemId) {
                reject(new CustomError(err_msg.requireditem, StatusCodes.BAD_REQUEST));
            } else if (!query.isActive) {
                reject(new CustomError(err_msg.requireActive, StatusCodes.BAD_REQUEST));
            } else {
                const itemDetails = await vendor_menueItemsModel.findOne({ _id: query.itemId, isDelete: false });
                if (itemDetails) {
                    if (itemDetails.status == false || itemDetails.cuisineCategory_status == false) {
                        reject(new CustomError(err_msg.deactiveateByAdmin, StatusCodes.BAD_REQUEST));
                    } else {
                        const update_status = await vendor_menueItemsModel.updateOne({ _id: query.itemId }, { isActive: query.isActive });
                        var data1 = {
                            itemId: query.itemId 
                        }
                        updateVendorStore12(data1)
                        high_amount(data1)
                        resolve(update_status);
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

//Menu Items LIST
function itemsList(query: any, userId: any, headers: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg: any = errors.en;
        if (headers.language == 'ar') {
            var err_msg: any = errors.ar;
        }
        try {
            const { ObjectId } = require('mongodb');
            const { search, page = 1, perPage = 10, storeId } = query;
            if (!storeId) {
                reject(new CustomError(err_msg.requiredStore, StatusCodes.BAD_REQUEST));
            }
            let condition: any = { userId: ObjectId(userId), storeId: ObjectId(storeId), isDelete: false };
            if (search) {
                condition = {
                    ...condition,
                    itemName: { $regex: search, $options: 'i' }
                };
            }
            const list = await vendor_menueItemsModel.aggregate([
                {
                    $addFields: {
                        foodCatId: "$foodCategoryId",
                        itemCatId: "$itemCategoryId",
                        storetypeId: "$storeTypeId",
                        cuisineCatId: "$cuisineCategoryId"
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
                        localField: "itemCatId",
                        from: "itemcategories",
                        foreignField: "_id",
                        as: "itemcategories",
                    }
                },
                {
                    $lookup: {
                        localField: "storetypeId",
                        from: "storetypes",
                        foreignField: "_id",
                        as: "storetypes",
                    }
                },
                {
                    $lookup: {
                        localField: "cuisineCatId",
                        from: "cusinecategories",
                        foreignField: "_id",
                        as: "cusinecategories",
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

// get cusinecategoriesList
function cusinecategoriesList(query: any, headers: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg: any = errors.en;
        if (headers.language == 'ar') {
            var err_msg: any = errors.ar;
        }
        try {
            const list = await cusineCategoryModel.find({ storeTypeId: query.storeTypeId, isDelete: false, isActive: true }).sort({ createdAt: -1 });
            if (list) {
                resolve(list);
            } else {
                resolve(list);
            }
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}

// get Menu Items
function foodCategoryList(query: any, headers: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg: any = errors.en;
        if (headers.language == 'ar') {
            var err_msg: any = errors.ar;
        }
        try {
            // const { page = 1, perPage = 10 } = query;
            const list = await foodCategoryModel.find({ isDelete: false, isActive: true }).sort({ createdAt: -1 });
            if (list) {
                resolve(list);
            } else {
                resolve(list);
            }
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}

// get Menu Items
function itemcategoriesList(query: any, vendorId: any, headers: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg: any = errors.en;
        if (headers.language == 'ar') {
            var err_msg: any = errors.ar;
        }
        try {
            const vendorStore = await vendorStoreTypeModel.findOne({ userId: vendorId });
            if (vendorStore) {
                const list = await itemCategoryModel.find({ storeTypeId: vendorStore.storeTypeId, addBy: "Admin", isDelete: false, isActive: true }, { title: 1, ar_title: 1, image: 1 }).sort({ createdAt: -1 });
                const vendor_categoryList = await itemCategoryModel.find({ storeTypeId: vendorStore.storeTypeId, vendorId: vendorId, isDelete: false, isActive: true }, { title: 1, ar_title: 1, image: 1 }).sort({ createdAt: 1 });
                var merge: any = [...list, ...vendor_categoryList]
                resolve(merge);
            } else {
                resolve([]);
            }
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}

// delete menu_items
function delete_menuItems(itemId: any, userId: any, headers: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg: any = errors.en;
        if (headers.language == 'ar') {
            var err_msg: any = errors.ar;
        }
        try {
            await vendor_menueItemsModel.updateOne({ _id: itemId }, { isDelete: true })
            await vendor_itemSizeModel.updateMany({ itemId: itemId }, { isDelete: true })
            await addonsModel.updateMany({ itemId: itemId }, { isDelete: true })
            var data1 = {
                itemId: itemId
            }
            updateVendorStore12(data1)
            high_amount(data1)
            resolve({ success: true })
        } catch (err) {
            reject(err)
        }
    })
}

export default {
    addItems,
    edit,
    getMenuItems,
    updateStatus,
    itemsList,
    cusinecategoriesList,
    foodCategoryList,
    itemcategoriesList,
    delete_menuItems
} as const;