import { foodCategoryModel, itemCategoryModel, storeTypeModel, vendorStoreModel, vendor_itemSizeModel, vendor_menueItemsModel } from '../../models/index';
import { CustomError } from '../../utils/errors';
import StatusCodes from 'http-status-codes';
import { errors } from '../../constants/index';
import storeType from './storeType';
const _ = require('lodash');
//update vendor stores Details
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

// Add sub_Category
function add_itemCategory(data: any, userId: any, image: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { title, storeTypeId } = data;
            const lower_case = title.toLowerCase();
            data.lower_title = lower_case;
            if (!image) {
                reject(new CustomError("Image is required", StatusCodes.BAD_REQUEST));
            } else {
                var obj = {
                    ...data,
                    image: image ? image[0].path : ''
                }
                const check_itemCategory = await itemCategoryModel.findOne({ storeTypeId: storeTypeId, lower_title: lower_case, isDelete: false });
                if (check_itemCategory) {
                    reject(new CustomError(errors.en.categoryExists, StatusCodes.BAD_REQUEST));
                } else {
                    const add_itemCategory = await itemCategoryModel.create(obj);
                    resolve(add_itemCategory);
                }
            }
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}

// Edit sub_Category
function edit_itemCategory(data: any, userId: any, image: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { title, sub_CategoryId, storeTypeId, ar_title } = data;
            const lower_case = title.toLowerCase();
            const check = await itemCategoryModel.findOne({ _id: sub_CategoryId });
            if (check) {
                const obj = {
                    title: title,
                    ar_title: ar_title,
                    storeTypeId: storeTypeId,
                    lower_title: lower_case,
                    image: image ? image[0].path : check.image
                }
                const checkCategory = await itemCategoryModel.findOne({ storeTypeId: storeTypeId, lower_title: lower_case, isDelete: false });
                if (checkCategory) {
                    if (checkCategory._id == sub_CategoryId) {
                        await itemCategoryModel.updateOne({ _id: sub_CategoryId }, obj);
                        resolve({ sucess: true });
                    } else {
                        reject(new CustomError(errors.en.categoryExists, StatusCodes.BAD_REQUEST));
                    }
                } else {
                    await itemCategoryModel.updateOne({ _id: sub_CategoryId }, obj);
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
function list_Sub_Category(query: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { page = 1, perPage = 10, search, status, storeTypeId, sort, sorting = -1 } = query;
            if (sort && sort != '' && sort != undefined) {
                if (sort && sort == "categoryName") {
                    var obj: any = {
                        lower_title: sorting
                    }
                }
                else if (sort && sort == "sNo") {
                    var obj: any = {
                        lower_title: sorting
                    }
                } else {
                    var obj: any = {
                        createdAt: sorting
                    }
                }
            } else {
                var obj: any = {
                    createdAt: sorting
                }
            }

            let condition: any = {
                isDelete: false
            }
            if (search && search != '' && status && storeTypeId) {
                condition = {
                    ...condition,
                    isActive: status,
                    $or: [
                        { title: { '$regex': search, "$options": 'i' } },
                        { ar_title: { '$regex': search, "$options": 'i' } }
                    ],
                    storeTypeId: storeTypeId
                }
            } else if (search && search != '' && storeTypeId) {
                condition = {
                    ...condition,
                    $or: [
                        { title: { '$regex': search, "$options": 'i' } },
                        { ar_title: { '$regex': search, "$options": 'i' } }
                    ], storeTypeId: storeTypeId
                }
            } else if (status && status != '' && search && search != '') {
                condition = {
                    ...condition,
                    isActive: status,
                    $or: [
                        { title: { '$regex': search, "$options": 'i' } },
                        { ar_title: { '$regex': search, "$options": 'i' } }
                    ],
                }
            }
            else if (status && status != '' && storeTypeId) {
                condition = {
                    ...condition,
                    isActive: status,
                    $or: [
                        { title: { '$regex': search, "$options": 'i' } },
                        { ar_title: { '$regex': search, "$options": 'i' } }
                    ], storeTypeId: storeTypeId
                }
            } else if (status && status != '') {
                condition = {
                    ...condition,
                    isActive: status
                }
            } else if (storeTypeId) {
                condition = {
                    ...condition,
                    storeTypeId: storeTypeId
                }
            } else if (search && search != '') {
                condition = {
                    ...condition,
                    $or: [
                        { title: { '$regex': search, "$options": 'i' } },
                        { ar_title: { '$regex': search, "$options": 'i' } }
                    ],
                }
            }
            else {
                condition = {
                    ...condition
                }
            }
            const list = await itemCategoryModel.find(condition).sort(obj).skip((page * perPage) - perPage).limit(perPage);
            const count = await itemCategoryModel.countDocuments(condition);
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
            const { sub_CategoryId } = query;
            if (!sub_CategoryId) {
                reject(new CustomError("sub_CategoryId required", StatusCodes.BAD_REQUEST));
            } else {
                const get = await itemCategoryModel.findOne({ _id: sub_CategoryId, isDelete: false }).populate({ path: "storeTypeId", select: "storeType" });
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
            var array: any = []
            const { sub_CategoryId, status } = query;
            if (!sub_CategoryId) {
                reject(new CustomError("sub_CategoryId required", StatusCodes.BAD_REQUEST));
            } else {
                const get = await itemCategoryModel.findOne({ _id: sub_CategoryId, isDelete: false });
                if (get) {
                    await itemCategoryModel.updateOne({ _id: sub_CategoryId }, { isActive: status });
                    await vendor_menueItemsModel.updateMany({ itemCategoryId: sub_CategoryId }, { status: status });
                    var stores: any = await vendor_menueItemsModel.find({ itemCategoryId: sub_CategoryId })
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
function delete_subCategory(query: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { sub_CategoryId } = query;
            var array: any = []
            if (!sub_CategoryId) {
                reject(new CustomError("sub_CategoryId required", StatusCodes.BAD_REQUEST));
            } else {
                await itemCategoryModel.updateOne({ _id: sub_CategoryId }, { isDelete: true });
                await vendor_menueItemsModel.updateMany({ itemCategoryId: sub_CategoryId }, { isDelete: true });
                var stores: any = await vendor_menueItemsModel.find({ itemCategoryId: sub_CategoryId })
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

//vendor Category list
function vendor_item_Categories(query: any, headers: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg: any = errors.en;
        if (headers.language == 'ar') {
            var err_msg: any = errors.ar;
        }
        try {
            const { page = 1, perPage = 10, status, search, vendorId } = query;
            if (!vendorId) {
                reject(new CustomError(err_msg.requiredId, StatusCodes.BAD_REQUEST))
            } else {
                let condition: any = {
                    vendorId,
                    addBy: "Vendor",
                    isDelete: false
                }
                if (search && search != '' && status && status != '') {
                    condition = {
                        ...condition,
                        $or: [
                            { title: { '$regex': search, "$options": 'i' } },
                            { ar_title: { '$regex': search, "$options": 'i' } }
                        ],
                        isActive: status
                    }
                } else if (search && search != '') {
                    condition = {
                        ...condition,
                        $or: [
                            { title: { '$regex': search, "$options": 'i' } },
                            { ar_title: { '$regex': search, "$options": 'i' } }
                        ],
                    }
                } else if (status && status != '') {
                    condition = {
                        ...condition,
                        isActive: status
                    }
                }
                else {
                    condition = {
                        ...condition
                    }
                }
                const list = await itemCategoryModel.find(condition).sort({ createdAt: -1 }).skip((page * perPage) - perPage).limit(perPage);
                const count = await itemCategoryModel.countDocuments(condition);
                resolve({ items: list, totalCount: count });
            }

        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}

export default {
    add_itemCategory,
    edit_itemCategory,
    list_Sub_Category,
    getDetails,
    updateStatus,
    delete_subCategory,
    vendor_item_Categories
} as const;