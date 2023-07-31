import { storeTypeModel, vendor_menueItemsModel } from '../../models/index';
import { CustomError } from '../../utils/errors';
import StatusCodes from 'http-status-codes';
import { errors } from '../../constants/index';
import { contentSecurityPolicy } from 'helmet';
const _ = require('lodash');

// Add Category
function add_storeType(data: any, userId: any, image: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { storeType } = data;
            const lower_case = storeType.toLowerCase();
            data.lower_name = lower_case;
            if (!image) {
                reject(new CustomError("Image required", StatusCodes.BAD_REQUEST));
            } else {
                const obj = {
                    ...data,
                    image: image ? image[0].path : ''
                }
                const checkCategory = await storeTypeModel.findOne({ lower_name: lower_case,isDelete:false });
                if (checkCategory) {
                    reject(new CustomError(errors.en.categoryExists, StatusCodes.BAD_REQUEST));
                } else {
                    const add = await storeTypeModel.create(obj);
                    resolve(add);
                }
            }
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}

// Edit Category
function edit_storeType(data: any, userId: any, image: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { storeType, storeTypeId,ar_storeType } = data;
            const lower_case = storeType.toLowerCase();
            const check = await storeTypeModel.findOne({ _id: storeTypeId });
            if (check) {
                const obj = {
                    storeType: storeType,
                    ar_storeType: ar_storeType,
                    lower_name: lower_case,
                    image: image ? image[0].path : check.image
                };
                const checkCategory = await storeTypeModel.findOne({ lower_name: lower_case,isDelete:false });
                if (checkCategory) {
                    if (checkCategory._id == storeTypeId) {
                        await storeTypeModel.updateOne({ _id: storeTypeId }, obj);
                        resolve({ sucess: true });
                    } else {
                        reject(new CustomError(errors.en.categoryExists, StatusCodes.BAD_REQUEST));
                    }
                } else {
                    await storeTypeModel.updateOne({ _id: storeTypeId }, obj);
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
            const { page = 1, perPage = 10, search, status } = query;
            let condition: any = {
                isDelete: false,
            };
            if (search && search != '' && status) {
                condition = {
                    ...condition,
                    isActive: status,
                    $or: [
                        { storeType: { '$regex': search, "$options": 'i' } },
                        {ar_storeType: { '$regex': search, "$options": 'i' }}
                    ]
                };
            } else if (search && search != '') {
                condition = {
                    ...condition,
                    $or: [
                        { storeType: { '$regex': search, "$options": 'i' } },
                        {ar_storeType: { '$regex': search, "$options": 'i' }}
                    ]                };
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
            const list = await storeTypeModel.find(condition).sort({ createdAt: -1 }).skip((page * perPage) - perPage).limit(perPage);
            const count = await storeTypeModel.countDocuments(condition);
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
            const { storeTypeId } = query;
            if (!storeTypeId) {
                reject(new CustomError("StoreTypeId required", StatusCodes.BAD_REQUEST));
            } else {
                const get = await storeTypeModel.findOne({ _id: storeTypeId, isDelete: false });
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
            const { storeTypeId, status } = query;
            if (!storeTypeId) {
                reject(new CustomError("StoreTypeId required", StatusCodes.BAD_REQUEST));
            } else {
                const get = await storeTypeModel.findOne({ _id: storeTypeId, isDelete: false });
                if (get) {
                    await storeTypeModel.updateOne({ _id: storeTypeId }, { isActive: status });
                    var t = await vendor_menueItemsModel.updateMany({ storeTypeId: storeTypeId }, { storeType_status: status });
                    console.log(storeTypeId,';;;',status,"=============",t)

                    resolve({ success: true ,t});
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
function deleteStore(query: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { storeTypeId } = query;
            if (!storeTypeId) {
                reject(new CustomError("StoreTypeId required", StatusCodes.BAD_REQUEST));
            } else {
                await storeTypeModel.updateOne({ _id: storeTypeId }, { isDelete: true });
                resolve({ success: true });
            }
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}


export default {
    add_storeType,
    edit_storeType,
    list_Category,
    getDetails,
    updateStatus,
    deleteStore
} as const;