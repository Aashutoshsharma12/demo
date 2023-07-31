import { itemCategoryModel, storeTypeModel, vendor_menueItemsModel } from '../../models/index';
import { CustomError } from '../../utils/errors';
import StatusCodes from 'http-status-codes';
import { errors } from '../../constants/index';
const _ = require('lodash');

// Add sub_Category Item category
function add_itemCategory(data: any, userId: any, file: any, headers: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg: any = errors.en;
        if (headers.language == 'ar') {
            var err_msg: any = errors.ar;
        }
        try {
            const { title, storeTypeId } = data;
            const lower_case = title.toLowerCase();
            data.lower_title = lower_case;
            if (!file) {
                reject(new CustomError("Image is required", StatusCodes.BAD_REQUEST));
            } else {
                var obj = {
                    ...data,
                    vendorId: userId,
                    addBy: "Vendor",
                }
                const check_itemCategory = await itemCategoryModel.findOne({ storeTypeId: storeTypeId, lower_title: lower_case,isDelete:false });
                if (check_itemCategory) {
                    if (check_itemCategory.addBy == "Admin") {
                        reject(new CustomError(err_msg.categoryExists, StatusCodes.BAD_REQUEST));
                    } else if (check_itemCategory.addBy == "Vendor") {
                        if (check_itemCategory.vendorId == userId) {
                            reject(new CustomError(err_msg.categoryExists, StatusCodes.BAD_REQUEST));
                        } else {
                            obj.image = file.path
                            const add_itemCategory = await itemCategoryModel.create(obj);
                            resolve(add_itemCategory);
                        }
                    }
                } else {
                    obj.image = file.path
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
function edit_itemCategory(data: any, userId: any, image: any, headers: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg: any = errors.en;
        if (headers.language == 'ar') {
            var err_msg: any = errors.ar;
        }
        try {
            const { title, sub_CategoryId, ar_title } = data;
            const lower_case = title.toLowerCase();
            const check = await itemCategoryModel.findOne({ _id: sub_CategoryId });
            if (check) {
                const obj = {
                    title: title,
                    ar_title: ar_title,
                    lower_title: lower_case,
                    image: image ? image[0].path : check.image
                }
                const checkCategory = await itemCategoryModel.findOne({ vendorId: userId, lower_title: lower_case,isDelete:false });
                if (checkCategory) {
                    if (checkCategory._id == sub_CategoryId) {
                        await itemCategoryModel.updateOne({ _id: sub_CategoryId }, obj);
                        resolve({ sucess: true });
                    } else {
                        reject(new CustomError(err_msg.categoryExists, StatusCodes.BAD_REQUEST));
                    }
                } else {
                    await itemCategoryModel.updateOne({ _id: sub_CategoryId }, obj);
                    resolve({ sucess: true });
                }
            } else {
                reject(new CustomError(err_msg.noDatafound, StatusCodes.BAD_REQUEST));
            }
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}

// list for Vendor side
function list_item_Category(query: any, vendorId: any, headers: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg: any = errors.en;
        if (headers.language == 'ar') {
            var err_msg: any = errors.ar;
        }
        try {
            const { page = 1, perPage = 10, search } = query;
            let condition: any = {
                vendorId,
                addBy: "Vendor",
                isDelete: false
            }
            if (search && search != '') {
                condition = {
                    ...condition,
                    $or: [
                        { title: { '$regex': search, "$options": 'i' } },
                        { ar_title: { '$regex': search, "$options": 'i' } }
                    ]
                }
            } else {
                condition = {
                    ...condition
                }
            }
            const list = await itemCategoryModel.find(condition).sort({ createdAt: -1 }).skip((page * perPage) - perPage).limit(perPage);
            const count = await itemCategoryModel.countDocuments(condition);
            resolve({ items: list, totalCount: count });
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}

// Get Details
function getDetails(query: any, vendorId: any, headers: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg: any = errors.en;
        if (headers.language == 'ar') {
            var err_msg: any = errors.ar;
        }
        try {
            const { sub_CategoryId } = query;
            if (!sub_CategoryId) {
                reject(new CustomError("sub_CategoryId required", StatusCodes.BAD_REQUEST));
            } else {
                const get = await itemCategoryModel.findOne({ _id: sub_CategoryId, isDelete: false }).populate({ path: "storeTypeId", select: "storeType" });
                if (get) {
                    resolve(get);
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

// Active Deactive status
function updateStatus(query: any, headers: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg: any = errors.en;
        if (headers.language == 'ar') {
            var err_msg: any = errors.ar;
        }
        try {
            const { sub_CategoryId, status } = query;
            if (!sub_CategoryId) {
                reject(new CustomError("sub_CategoryId required", StatusCodes.BAD_REQUEST));
            } else {
                const get = await itemCategoryModel.findOne({ _id: sub_CategoryId, isDelete: false });
                if (get) {
                    await itemCategoryModel.updateOne({ _id: sub_CategoryId }, { isActive: status });
                    await vendor_menueItemsModel.updateMany({ itemCategoryId: sub_CategoryId }, { status: status });
                    resolve({ success: true });
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

// Delete
function delete_category(query: any, headers: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg: any = errors.en;
        if (headers.language == 'ar') {
            var err_msg: any = errors.ar;
        }
        try {
            const { sub_CategoryId } = query;
            if (!sub_CategoryId) {
                reject(new CustomError("sub_CategoryId required", StatusCodes.BAD_REQUEST));
            } else {
                await itemCategoryModel.updateOne({ _id: sub_CategoryId }, { isDelete: true });
                await vendor_menueItemsModel.updateMany({ itemCategoryId: sub_CategoryId }, { isDelete: true });
                resolve({ success: true });
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
    list_item_Category,
    getDetails,
    updateStatus,
    delete_category
} as const;