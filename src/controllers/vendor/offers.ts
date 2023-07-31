import { offerModel, vendorStoreTypeModel } from '../../models/index';
import { CustomError } from '../../utils/errors';
import StatusCodes from 'http-status-codes';
import { errors } from '../../constants/index';
import { resolve } from 'path';
import { reject } from 'promise';
import { ObjectID } from 'bson';
import { any, array } from 'joi';
import moment from 'moment-timezone';
const _ = require('lodash');

// add offers
function addOffer(data: any, userId: any, headers: any, image: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg: any = errors.en;
        if (headers.language == 'ar') {
            var err_msg: any = errors.ar;
        }
        try {
            var checkCoupon_code = await offerModel.findOne({ couponCode: data.couponCode,isDelete:false });
            if (checkCoupon_code) {
                reject(new CustomError(err_msg.already_used, StatusCodes.BAD_REQUEST))
            } else {
                var array: any = (data.storeId).split()
                var checkStoreType: any = await vendorStoreTypeModel.findOne({ userId: userId })
                const body = {
                    ...data,
                    storeId: array,
                    storeTypeId: checkStoreType.storeTypeId,
                    userId,
                    image: image ? image[0].path : '',
                };
                const addOffer = await offerModel.create(body);
                resolve(addOffer);
            }
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}

// edit Offer
function editOffer(offerId: any, data: any, userId: any, headers: any, image: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg: any = errors.en;
        if (headers.language == 'ar') {
            var err_msg: any = errors.ar;
        }
        try {
            const { id } = offerId;
            const body = {
                ...data,
                userId
            };
            var check: any = await offerModel.findOne({ _id: id, couponCode: data.couponCode,isDelete:false });
            if (check) {
                body.image = image ? image[0].path : check.image
                const editOffer = await offerModel.updateOne({ _id: id }, body);
                resolve(editOffer);
            } else {
                var check_couponCode:any = await offerModel.findOne({ couponCode: data.couponCode,isDelete:false });
                if (check_couponCode) {
                    reject(new CustomError(err_msg.already_used, StatusCodes.BAD_REQUEST));
                } else {
                    var check1: any = await offerModel.findOne({ _id: id})
                    body.image = image ? image[0].path : check1.image
                    const editOffer = await offerModel.updateOne({ _id: id }, body);
                    resolve(editOffer);
                }
            }
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}

// Offer details
function offerDetails(offerId: any, userId: any, headers: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg: any = errors.en;
        if (headers.language == 'ar') {
            var err_msg: any = errors.ar;
        }
        try {
            const { id } = offerId;
            const offerDetails = await offerModel.findOne({ _id: id }).populate({ path: "storeId", select: "main_branchName" });
            if (offerDetails) {
                resolve(offerDetails);
            } else {
                reject(new CustomError(err_msg.noDatafound, StatusCodes.BAD_REQUEST));
            }
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}

// list Of Offers
function offers_list(query: any, userId: any, headers: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg: any = errors.en;
        if (headers.language == 'ar') {
            var err_msg: any = errors.ar;
        }
        try {
            const { ObjectId } = require('mongodb');
            const{timezone} = headers
            const { storeId, page = 1, perPage = 10 } = query;
            if (!storeId) {
                reject(new CustomError(err_msg.requiredStore, StatusCodes.BAD_REQUEST));
            }
            let condition: any = {
                // userId: userId,
                storeId: storeId,
                isDelete: false
            };
            const offers_list: any = await offerModel.find(condition).sort({createdAt:-1}).populate({ path: "storeId", select: "main_branchName branchName" }).skip((page * perPage) - perPage).limit(perPage);
            if (offers_list && offers_list.length) {
                var offer_status1:any
                var array = [];
                for (let i = 0; i < offers_list.length; i++) {
                    console.log(moment(offers_list[i].startDate).tz(timezone).format('YYYY-MM-DD'),";;l",moment(offers_list[i].startDate,'DD-MM-YYYY').tz(timezone).format('YYYY-MM-DD'))
                    if (moment(offers_list[i].startDate).tz(timezone).format('YYYY-MM-DD') > moment().tz(timezone).format('YYYY-MM-DD')) {
                        offer_status1 = "Upcoming";
                    } else if (moment(offers_list[i].expiryDate).tz(timezone).format('YYYY-MM-DD') >= moment().tz(timezone).format('YYYY-MM-DD')) {
                        offer_status1 = "Running";
                    }else{
                        offer_status1 = "Expired";
                    }
                    var a: any = new Object();
                    a = offers_list[i].toObject();
                    a.offer_status = offer_status1;
                    array.push(a);
                }
                resolve(array);
            } else {
                resolve([]);
            }
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}

// Change Status(Active Deactive)
function update_status(query: any, userId: any, headers: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg: any = errors.en;
        if (headers.language == 'ar') {
            var err_msg: any = errors.ar;
        }
        try {
            const { offerId, isActive } = query;

            if (!offerId) {
                reject(new CustomError(err_msg.requiredOffer, StatusCodes.BAD_REQUEST));
            } else if (!isActive) {
                reject(new CustomError(err_msg.requireActive, StatusCodes.BAD_REQUEST));
            } else {
                const checkOffer = await offerModel.findOne({ _id: offerId });
                if (checkOffer) {
                    if (checkOffer.addBy == "Admin") {
                        reject(new CustomError(errors.en.addbyAdmin, StatusCodes.BAD_REQUEST))
                    } else {
                        await offerModel.updateOne({ _id: offerId }, { isActive: isActive });
                        resolve({ success: true });
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

// Delete Offers

function deleteOffer(offerId: any, userId: any, headers: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg: any = errors.en;
        if (headers.language == 'ar') {
            var err_msg: any = errors.ar;
        }
        try {
            const { id } = offerId;
            const checkOffer = await offerModel.findOne({ _id: id });
            if (checkOffer) {
                if (checkOffer.addBy == "Admin") {
                    reject(new CustomError(errors.en.addbyAdmin, StatusCodes.BAD_REQUEST))
                } else {
                    await offerModel.updateOne({ _id: id }, { isDelete: true });
                    resolve({ success: true });
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

export default {
    addOffer,
    editOffer,
    offerDetails,
    offers_list,
    update_status,
    deleteOffer
} as const;