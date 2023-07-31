import { cusineCategoryModel, vendorStoreModel, vendor_itemSizeModel, vendor_menueItemsModel } from '../../models/index';
import { CustomError } from '../../utils/errors';
import StatusCodes from 'http-status-codes';
import { errors } from '../../constants/index';
import storeType from './storeType';
const _ = require('lodash');

var updateVendorStore = async (data1: any) => {
    var vegType: any = []
    var categoryId: any = []
    var cuisineeId: any = []
    var storeId1: any = data1.storeId
    function removeDuplicatesId(storeId1: any) {
        return storeId1.filter((item: any,
            index: any) => storeId1.indexOf(item) === index);
    }
    var storeId = removeDuplicatesId(storeId1)
    for (let i1 = 0; i1 < storeId.length; i1++) {
        const list: any = await vendor_menueItemsModel.find({ storeId: storeId[i1], isDelete: false,status:true,cuisineCategory_status:true, isActive: true }, { storeId: 1, itemCategoryId: 1, cuisineCategoryId: 1, foodCategoryId: 1 })
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

        await vendorStoreModel.updateOne({ _id: storeId[i1] }, { vegType: vegType, cuisineeId: cuisineeId1, categoryId: categoryId1 })
    }
}
//update high Amount
var high_amount = async (data1: any) => {
    var storeId = data1.storeId
    for (let i1 = 0; i1 < storeId.length; i1++) {
        var itemData: any = await vendor_menueItemsModel.find({ 'storeId': storeId[i1], isDelete: false,status:true,cuisineCategory_status:true, isActive: true }).sort({ 'amount': 1 });
        if (itemData && itemData.length) {
            var arr = [];
            for (var i = 0; i < itemData.length; i++) {
                arr.push(itemData[i]._id);
            }
            var size1 = await vendor_itemSizeModel.find({ 'itemId': arr, isDelete: false, isActive: true }).sort({ 'amount': 1 });
            if (size1 && size1.length) {
                await vendorStoreModel.updateOne({ _id: storeId[i1] }, { 'hightItemAmount': size1[size1.length - 1].amount, 'lowItemAmount': size1[0].amount });
            } else {
                await vendorStoreModel.updateOne({ '_id': storeId[i1] }, { $set: { 'hightItemAmount': itemData[itemData.length - 1].amount, 'lowItemAmount': itemData[0].amount } });
            }
        } else {
            await vendorStoreModel.updateOne({ '_id': storeId[i1] }, { $set: { 'hightItemAmount': 0, 'lowItemAmount': 0 } });
        }
    }
}
// Add Category
function add_cusineCategory(data: any, userId: any, image: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { title, storeTypeId } = data;
            if (!image) {
                reject(new CustomError('Image is required', StatusCodes.BAD_REQUEST))
            } else {
                const lower_case = title.toLowerCase();
                const checkCategory = await cusineCategoryModel.findOne({ storeTypeId: storeTypeId, lower_title: lower_case, isDelete: false });
                if (checkCategory) {
                    reject(new CustomError(errors.en.categoryExists, StatusCodes.BAD_REQUEST));
                } else {
                    data.lower_title = lower_case;
                    data.image = image ? image[0].path : ''
                    const add_cusineCategory = await cusineCategoryModel.create(data);
                    resolve(add_cusineCategory);
                }
            }
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}
// Edit Category
function edit_cusineCategory(data: any, userId: any, image: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { ObjectId } = require('mongodb')
            const { title, cuisineId, ar_title, storeTypeId } = data;
            const lower_case = title.toLowerCase();
            const check = await cusineCategoryModel.findOne({ _id: cuisineId, isDelete: false });
            if (check) {
                const obj = {
                    title: title,
                    storeTypeId: storeTypeId,
                    ar_title: ar_title,
                    lower_title: lower_case,
                    image: image ? image[0].path : check.image
                };
                const checkCategory = await cusineCategoryModel.findOne({ lower_title: lower_case, storeTypeId: storeTypeId });
                if (checkCategory) {
                    if (checkCategory._id == cuisineId) {
                        await cusineCategoryModel.updateOne({ _id: cuisineId }, obj);
                        resolve({ sucess: true });
                    } else {
                        reject(new CustomError(errors.en.categoryExists, StatusCodes.BAD_REQUEST));
                    }
                } else {
                    await cusineCategoryModel.updateOne({ _id: cuisineId }, obj);
                    resolve({ sucess: true });
                }
            } else {
                reject(new CustomError(errors.en.noDatafound, StatusCodes.BAD_REQUEST));
            }
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}

// list
function list_Category(query: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { page = 1, perPage = 10, search, status, storeTypeId } = query;
            let condition: any = {
                isDelete: false,
            };
            if (search && search != '' && status) {
                condition = {
                    ...condition,
                    isActive: status,
                    $or: [
                        { title: { '$regex': search, "$options": 'i' } },
                        { ar_title: { '$regex': search, "$options": 'i' } }
                    ]
                };
            } else if (search && search != '') {
                condition = {
                    ...condition,
                    $or: [
                        { title: { '$regex': search, "$options": 'i' } },
                        { ar_title: { '$regex': search, "$options": 'i' } }
                    ]
                };
            } else if (status && status != '') {
                condition = {
                    ...condition,
                    isActive: status
                };
            } else {
                condition = {
                    ...condition
                };
            }
            if (storeTypeId && storeTypeId != '') {
                condition = {
                    ...condition,
                    storeTypeId
                }
            }
            const list = await cusineCategoryModel.find(condition).populate({ path: 'storeTypeId', select: 'storeType' }).sort({ createdAt: -1 }).skip((page * perPage) - perPage).limit(perPage);
            const count = await cusineCategoryModel.countDocuments(condition);
            resolve({ items: list, totalCount: count });
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}

// Get Details
function getDetails(query: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { cuisineId } = query;
            if (!cuisineId) {
                reject(new CustomError("cuisineId required", StatusCodes.BAD_REQUEST));
            } else {
                const get = await cusineCategoryModel.findOne({ _id: cuisineId, isDelete: false }).populate({ path: 'storeTypeId', select: 'storeType' });
                if (get) {
                    resolve(get);
                } else {
                    reject(new CustomError(errors.en.noDatafound, StatusCodes.BAD_REQUEST));
                }
            }
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}

// Active Deactive status
function updateStatus(query: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { cuisineId, status } = query;
            var array: any = []
            if (!cuisineId) {
                reject(new CustomError("cuisineId required", StatusCodes.BAD_REQUEST));
            } else {
                const get = await cusineCategoryModel.findOne({ _id: cuisineId, isDelete: false });
                if (get) {
                    await cusineCategoryModel.updateOne({ _id: cuisineId }, { isActive: status });
                    await vendor_menueItemsModel.updateMany({ cuisineCategoryId: cuisineId }, { cuisineCategory_status: status });
                    var stores: any = await vendor_menueItemsModel.find({ cuisineCategoryId: cuisineId })
                    if (stores.length) {
                        stores.map((list: any) => {
                            array.push((list.storeId.toString()))
                        })
                        var data1 = {
                            storeId: array
                        }
                        updateVendorStore(data1)
                        high_amount(data1)
                    }
                    resolve({ success: true });
                } else {
                    reject(new CustomError(errors.en.noDatafound, StatusCodes.BAD_REQUEST));
                }
            }
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}

// Delete
function deleteCategory(query: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { cuisineId } = query;
            if (!cuisineId) {
                reject(new CustomError("cuisineId required", StatusCodes.BAD_REQUEST));
            } else {
                var array: any = []
                await cusineCategoryModel.updateOne({ _id: cuisineId }, { isDelete: true });
                await vendor_menueItemsModel.updateMany({ cuisineCategoryId: cuisineId }, { isDelete: true });
                var stores: any = await vendor_menueItemsModel.find({ cuisineCategoryId: cuisineId })
                if (stores.length) {
                    stores.map((list: any) => {
                        array.push((list.storeId.toString()))
                    })
                    var data1 = {
                        storeId: array
                    }
                    updateVendorStore(data1)
                    high_amount(data1)
                }
                resolve({ success: true });
            }
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}

export default {
    add_cusineCategory,
    edit_cusineCategory,
    list_Category,
    getDetails,
    updateStatus,
    deleteCategory
} as const;