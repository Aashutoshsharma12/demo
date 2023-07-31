import { offerModel, vendorStoreModel } from '../../models/index';
import { CustomError } from '../../utils/errors';
import StatusCodes from 'http-status-codes';
import { errors } from '../../constants/index';
import moment from 'moment-timezone';
const _ = require('lodash');

// add offers
function add_Offer(data: any, userId: any, image: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { storeIds, storeTypeId } = data
            if ((storeTypeId && storeTypeId != '') || (storeIds && storeIds.length != 0)) {
                if (storeIds && storeIds != '') {
                    var str = storeIds;
                    var arr: any = str.split(',');
                } else {
                    var arr: any = []
                }
                const checkCoupon_code = await offerModel.findOne({ couponCode: data.couponCode });
                if (checkCoupon_code) {
                    reject(new CustomError(errors.en.already_used, StatusCodes.BAD_REQUEST))
                } else {
                    const body = {
                        ...data,
                        storeId: arr,
                        addBy: "Admin",
                        image: image ? image[0].path : ''
                    };
                    const addOffer = await offerModel.create(body);
                    resolve(addOffer);
                }


            } else {
                reject(new CustomError("Please select store Type Or Store", StatusCodes.BAD_REQUEST))
            }

        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}

// edit Offer
function edit_Offer(offerId: any, data: any, userId: any, image: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { id } = offerId;
            const { storeIds, storeTypeId } = data;
            if ((storeTypeId && storeTypeId != '') || (storeIds && storeIds.length != 0)) {
                const check: any = await offerModel.findOne({ _id: id });
                if (check) {
                    if (check.couponCode == data.couponCode) {
                        if (storeIds && storeIds != '') {
                            var str = storeIds;
                            var arr: any = str.split(',');
                        } else {
                            var arr: any = []
                        }
                        const body = {
                            ...data,
                            storeId: arr,
                            image: image ? image[0].path : check.image

                        };
                        const editOffer = await offerModel.updateOne({ _id: id }, body);
                        resolve(editOffer);
                    } else {
                        const checkId: any = await offerModel.findOne({ couponCode: data.couponCode });
                        if (checkId) {
                            if (checkId._id == check._id) {
                                if (storeIds && storeIds != '') {
                                    var str = storeIds;
                                    var arr: any = str.split(',');
                                } else {
                                    var arr: any = []
                                }
                                const body = {
                                    ...data,
                                    storeId: arr,
                                    image: image ? image[0].path : check.image
                                };
                                const editOffer = await offerModel.updateOne({ _id: id }, body);
                                resolve(editOffer);
                            } else {
                                reject(new CustomError(errors.en.already_used, StatusCodes.BAD_REQUEST))
                            }
                        } else {
                            if (storeIds && storeIds != '') {
                                var str = storeIds;
                                var arr: any = str.split(',');
                            } else {
                                var arr: any = []
                            }
                            const body = {
                                ...data,
                                storeId: arr,
                                image: image ? image[0].path : check.image

                            };
                            const editOffer = await offerModel.updateOne({ _id: id }, body);
                            resolve(editOffer);
                        }

                    }

                } else {
                    reject(new CustomError(errors.en.noDatafound, StatusCodes.BAD_REQUEST));
                }
            } else {
                reject(new CustomError("Please select store Type Or Store", StatusCodes.BAD_REQUEST))
            }
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}

// Offer details
function offer_Details(offerId: any, userId: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { id } = offerId;
            const offerDetails = await offerModel.findOne({ _id: id }).populate({ path: "storeTypeId storeId", select: "storeType branchName" });
            if (offerDetails) {
                resolve(offerDetails);
            } else {
                reject(new CustomError(errors.en.noDatafound, StatusCodes.BAD_REQUEST));
            }
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}

// list Of Offers
function offersList(query: any, userId: any,headers:any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const {timezone} = headers
            const { ObjectId } = require('mongodb');
            const { page = 1, perPage = 10, sortName, sort = -1, addBy = "Admin", search } = query;
            var array:any = [];
            let condition: any = {
                addBy: addBy,
                isDelete: false
            };
            if (sortName && sortName != '') {
                if (sortName == 'offerName') {
                    var obj: any = {
                        'title': sort
                    }
                } else if (sortName == "offer_amount") {
                    var obj: any = {
                        'offer_amount': sort
                    }
                } else if (sortName == "startDate") {
                    var obj: any = {
                        'startDate': sort
                    }
                } else if (sortName == "expiryDate") {
                    var obj: any = {
                        'expiryDate': sort
                    }
                } else {
                    var obj: any = {
                        'createdAt': sort
                    }
                }
            } else {
                var obj: any = {
                    'createdAt': sort
                }
            }
            if (search && search != '') {
                condition = {
                    ...condition,
                    $or: [
                        { title: { $regex: search, $options: 'i' } },
                        { offer_type: { $regex: search, $options: 'i' } }
                    ]
                }
            }
            const count = await offerModel.count(condition)
            // var offers_list = await offerModel.aggregate( [
            //     {$match:condition},
            //     {
            //       $project:
            //         {
            //           "offer_status" :
            //           {
            //             $switch:
            //               {
            //                 branches: [
            //                   {
            //                     case: { $gte : [ "$startDate",new Date() ] },
            //                     then: "upcoming"
            //                   },
            //                   {
            //                     case:  { $lt :  [ "$expiryDate",new Date() ] },
            //                     then: "Expired"
            //                   }
            //                 ],
            //                 default: "Runing"
            //               }
            //            }
            //         }
            //      }
            //   ] )
            //   if(offers_list.length){

            const offers_list: any = await offerModel.find(condition).sort(obj).skip((page * perPage) - perPage).limit(perPage);
            if (offers_list && offers_list.length) {
                var offer_status1:any;
                for (let i = 0; i < offers_list.length; i++) {
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
                resolve({ items: array, Total: count });
            } else {
                resolve({ items: array, Total: count })
            }
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}

// Change Status(Active Deactive)
function updateStatus(query: any, userId: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { offerId, isActive } = query;
            if (!offerId) {
                reject(new CustomError("offerId required", StatusCodes.BAD_REQUEST));
            } else if (!isActive) {
                reject(new CustomError("isActive  required", StatusCodes.BAD_REQUEST));
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
                    reject(new CustomError(errors.en.noDatafound, StatusCodes.BAD_REQUEST));
                }
            }
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}

// Delete Offers
function delete_Offer(offerId: any, userId: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { id } = offerId;
            const checkOffer = await offerModel.findOne({ _id: id });
            if (checkOffer) {

                await offerModel.updateOne({ _id: id }, { isDelete: true });
                resolve({ success: true });

            } else {
                reject(new CustomError(errors.en.noDatafound, StatusCodes.BAD_REQUEST));
            }
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}

//store list
function storeList(query: any, adminId: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const count = await vendorStoreModel.count({ storeTypeId: query.storeTypeId, isDelete: false })
            const list = await vendorStoreModel.find({ storeTypeId: query.storeTypeId, isDelete: false }, { _id: 1, branchName: 1 });
            resolve({ items: list, totalCount: count })
            console.log(resolve, "query", query)

        } catch (err) {
            reject(err)
        }
    })
}


export default {
    add_Offer,
    edit_Offer,
    offer_Details,
    offersList,
    updateStatus,
    delete_Offer,
    storeList
} as const;