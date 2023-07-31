import { addonsModel, vendor_menueItemsModel } from '../../models/index';
import { CustomError } from '../../utils/errors';
import StatusCodes from 'http-status-codes';
import { errors } from '../../constants/index';
import addons_type from './addons_type';
const _ = require('lodash');

// Add addons
function addAddons(data: any, userId: any, headers: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg: any = errors.en;
        if (headers.language == 'ar') {
            var err_msg: any = errors.ar;
        }
        try {
            const obj = {
                lower_title: (data.title).toLowerCase(),
                itemId: data.itemId,
                userId: userId,
                addons_typeId: data.addons_typeId,
                isDelete:false
            };
            const body = {
                ...data,
                lower_title: (data.title).toLowerCase(),
                userId
            };
            const check = await addonsModel.findOne(obj);
            if (check) {
                reject(new CustomError(err_msg.addonsExists, StatusCodes.BAD_REQUEST));
            } else {
                const addAddons = await addonsModel.create(body);
                await vendor_menueItemsModel.updateOne({ _id: data.itemId }, { addons: true })
                resolve(addAddons);
            }
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}

// Edit Addons
function editAddons(body: any, addonsId: any, userId: any, headers: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg: any = errors.en;
        if (headers.language == 'ar') {
            var err_msg: any = errors.ar;
        }
        try {
            const { title, itemId, ar_title, addons_typeId } = body;
            const { id } = addonsId;
            const obj = {
                ...body,
                lower_title: title.toLowerCase(),
            };
            const checkAddons = await addonsModel.findOne({ _id: id });
            if (checkAddons) {
                const checkAddons1: any = await addonsModel.findOne({ userId: userId, lower_title: title.toLowerCase(), itemId: itemId, addons_typeId: addons_typeId,isDelete:false });
                if (checkAddons1) {
                    if (checkAddons1._id == id) {
                        const update = await addonsModel.updateOne({ _id: id }, obj);
                        resolve(update);
                    } else {
                        reject(new CustomError(err_msg.addonsExists, StatusCodes.BAD_REQUEST));
                    }
                } else {
                    const update = await addonsModel.updateOne({ _id: id }, obj);
                    resolve(update);
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

// Get Addons
function getAddons(addonsId: any, userId: any, headers: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg: any = errors.en;
        if (headers.language == 'ar') {
            var err_msg: any = errors.ar;
        }
        try {
            const { id } = addonsId;
            const addonsDetails = await addonsModel.findOne({ _id: id, userId: userId });
            if (addonsDetails) {
                resolve(addonsDetails);
            } else {
                reject(new CustomError(err_msg.noDatafound, StatusCodes.BAD_REQUEST));
            }
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}

// List of Addons
function listOfAddons(query: any, userId: any, headers: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg: any = errors.en;
        if (headers.language == 'ar') {
            var err_msg: any = errors.ar;
        }
        try {
            const { itemId, page = 1, perPage = 10 } = query;
            if (!itemId) {
                reject(new CustomError(err_msg.requireditem, StatusCodes.BAD_REQUEST));
            }
            const list = await addonsModel.find({ userId: userId, isDelete: false, itemId: itemId }).sort({ createdAt: 1 }).populate([{ path: "itemId", select: "itemName" }, { path: "addons_typeId", select: "title" }]).skip((page * perPage) - perPage).limit(perPage);
            resolve({ items: list });
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}

// update status
function updateStatus(addonsId: any, query: any, userId: any, headers: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg: any = errors.en;
        if (headers.language == 'ar') {
            var err_msg: any = errors.ar;
        }
        try {
            const { id } = addonsId;
            const { isActive } = query;
            console.log(query,"pp",isActive)
            if (!isActive) {
                reject(new CustomError(err_msg.requireActive, StatusCodes.BAD_REQUEST));
            } else {
                const addonsDetails = await addonsModel.findOne({ _id: id, userId: userId });
                if (addonsDetails) {
                    const update = await addonsModel.updateOne({ _id: id }, { isActive: isActive });
                    var count = await addonsModel.count({ itemId: addonsDetails.itemId, isDelete: false, isActive: true });
                    if (count > 0) {
                        await vendor_menueItemsModel.updateOne({ _id: addonsDetails.itemId }, { addons: true })
                    } else {
                        await vendor_menueItemsModel.updateOne({ _id: addonsDetails.itemId }, { addons: false })
                    }
                    resolve(update);
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
// delete Addons
function delete_addons(addonsId: any, userId: any, headers: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg: any = errors.en;
        if (headers.language == 'ar') {
            var err_msg: any = errors.ar;
        }
        try {
            var check = await addonsModel.findOne({_id:addonsId});
            if(check){
                await addonsModel.updateOne({ _id: addonsId }, { isDelete: true })
                var count = await addonsModel.count({ itemId: check.itemId, isDelete: false, isActive: true });
                if (count > 0) {
                    await vendor_menueItemsModel.updateOne({ _id: check.itemId }, { addons: true })
                } else {
                    await vendor_menueItemsModel.updateOne({ _id: check.itemId }, { addons: false })
                }
                resolve({ success: true })
            }else{

            }
        } catch (err) {
            reject(err)
        }
    })
}

export default {
    addAddons,
    editAddons,
    getAddons,
    listOfAddons,
    updateStatus,
    delete_addons
} as const;