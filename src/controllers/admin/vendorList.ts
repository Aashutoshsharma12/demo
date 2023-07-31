import { StatusCodes } from "http-status-codes";
import { CustomError } from "@utils/errors";
import { errors, fcm } from "@constants";
import { reject } from "promise";
import faq from "@controllers/common/faq";
import { resolve } from "path";
import { array } from "joi";
import { vendorStoreTypeModel, vendorStoreModel, vendorModel, timingModel, customerOrderModel, userSessionModel, ratingModel } from "@models/index";
import moment from "moment-timezone";
import { sendPushNotification } from "@utils/helpers";
import { token } from "morgan";
import bcrypt from 'bcrypt';


//Vendor list
function vendor_list(query: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { page = 1, perPage = 10, search, isActive, status, storeTypeId } = query;
            var array: any = [];
            var array1: any = [];
            let condition: any = {
                isDelete: false
            }
            if (query.sort && query.sort != '') {
                var sort: any = query.sort
            } else {
                var sort: any = -1
            }
            if (search && search != null && isActive && isActive != null && status && status != null) {
                condition = {
                    ...condition,
                    $or: [
                        { ownerName: { $regex: search, $options: 'i' } },
                        { phoneNumber: { $regex: search, $options: 'i' } },
                        { businessName: { $regex: search, $options: 'i' } },
                        { ar_businessName: { $regex: search, $options: 'i' } }
                    ],
                    isActive: isActive,
                    status: status
                }
            } else if (search && search != null && isActive && isActive != null && status && status != null) {
                condition = {
                    ...condition,
                    $or: [
                        { ownerName: { $regex: search, $options: 'i' } },
                        { phoneNumber: { $regex: search, $options: 'i' } },
                        { businessName: { $regex: search, $options: 'i' } },
                        { ar_businessName: { $regex: search, $options: 'i' } }
                    ],
                    isActive: isActive,
                    status: status
                }
            } else if (search && search != null && isActive && isActive != null) {
                condition = {
                    ...condition,
                    $or: [
                        { ownerName: { $regex: search, $options: 'i' } },
                        { phoneNumber: { $regex: search, $options: 'i' } },
                        { businessName: { $regex: search, $options: 'i' } },
                        { ar_businessName: { $regex: search, $options: 'i' } }

                    ],
                    isActive: isActive
                }
            } else if (search && search != null && status && status != null) {
                condition = {
                    ...condition,
                    $or: [
                        { ownerName: { $regex: search, $options: 'i' } },
                        { phoneNumber: { $regex: search, $options: 'i' } },
                        { businessName: { $regex: search, $options: 'i' } },
                        { ar_businessName: { $regex: search, $options: 'i' } }

                    ],
                    status: status
                }
            } else if (search && search != null) {
                condition = {
                    ...condition,
                    $or: [
                        { ownerName: { $regex: search, $options: 'i' } },
                        { phoneNumber: { $regex: search, $options: 'i' } },
                        { businessName: { $regex: search, $options: 'i' } },
                        { ar_businessName: { $regex: search, $options: 'i' } }
                    ]
                }
            } else if (isActive && isActive != null && status && status != null) {
                condition = {
                    ...condition,
                    isActive: isActive,
                    status: status
                }
            } else if (isActive && isActive != null) {
                condition = {
                    ...condition,
                    isActive: isActive
                }
            } else if (status && status != null) {
                condition = {
                    ...condition,
                    status: status
                }
            } else {
                condition = {
                    ...condition
                }
            }

            const vendorList = await vendorModel.find(condition);
            if (vendorList && vendorList.length) {
                for (let i = 0; i < vendorList.length; i++) {
                    array.push(vendorList[i].businessName);
                    array1.push(vendorList[i]._id);
                }
                if (storeTypeId && storeTypeId != '') {
                    var obj: any = {
                        main_branchName: array,
                        userId: array1,
                        storeTypeId: storeTypeId
                    }
                } else {
                    var obj: any = {
                        main_branchName: array,
                        userId: array1
                    }
                }
                const count = await vendorStoreModel.countDocuments(obj);
                const list = await vendorStoreModel.find(obj, { userId: 1, storeTypeId: 1, branchId: 1, main_branchName: 1, }).populate({ path: "userId storeTypeId", select: "ownerName phoneNumber isActive isDelete status storeType" }).sort({ branchId: sort }).skip((page * perPage) - perPage).limit(perPage);
                resolve({ list, totalCount: count });
            } else {
                resolve({ list: [], totalCount: 0 });
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
            const { vendorId, status } = query;
            if (!vendorId) {
                reject(new CustomError('vendorId required', StatusCodes.BAD_REQUEST));
            } else {
                const user = await vendorModel.findOne({ _id: vendorId });
                if (user) {
                    await vendorModel.updateOne({ _id: vendorId }, { isActive: status });
                    await vendorStoreModel.updateMany({ userId: vendorId }, { isActive: status })
                    const session: any = await userSessionModel.findOne({ userId: vendorId, status: true }, { deviceToken: 1 })
                    const tokens = session ? session.deviceToken || '' : ''
                    if (status == 'true') {
                        var sta_: any = "Activate"
                    }
                    if (status == 'false') {
                        var sta_: any = "Deactivate"
                    }
                    var data = {
                        navigateTo: "Update status",
                        id: vendorId,
                        deviceToken: tokens,
                        title: fcm.statusUpdate.title,
                        body: fcm.statusUpdate.body.replace('{{name}}', user.ownerName).replace('{{status}}', sta_)
                    }
                    sendPushNotification(data);
                    resolve({ success: true });
                } else {
                    reject(new CustomError(errors.en.noSuchAccountExist, StatusCodes.BAD_REQUEST));
                }
            }
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}

// Update status (Approved Rejected)
function update(query: any, headers: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { vendorId, status } = query;
            const { timezone } = headers
            if (!vendorId) {
                reject(new CustomError('vendorId required', StatusCodes.BAD_REQUEST));
            } else {
                const user = await vendorModel.findOne({ _id: vendorId });
                const time = moment().tz(timezone).format('HH:mm');
                const date = moment().tz(timezone).format('DD/MM/YYYY')
                const date_time = moment().tz(timezone).format('DD/MM/YYYY,h:mm a')
                if (status == "Approved") {
                    var isActive: any = true
                } else {
                    var isActive: any = false
                }
                if (user) {
                    await vendorModel.updateOne({ _id: vendorId }, { status: status, acceptRejectTime: time, acceptRejectDate: date, acceptRejectDate_Time: date_time });
                    await vendorStoreModel.updateMany({ userId: vendorId }, { isActive: isActive });
                    const session: any = await userSessionModel.findOne({ userId: vendorId, status: true }, { deviceToken: 1 })
                    const tokens = session ? session.deviceToken || '' : ''
                    var data = {
                        navigateTo: "Permision for Accept and Reject",
                        id: vendorId,
                        deviceToken: tokens,
                        title: fcm.accept_rejectStatus.title.replace('{{status}}', status),
                        body: fcm.accept_rejectStatus.body.replace('{{name}}', user.ownerName).replace('{{status}}', status)
                    }
                    sendPushNotification(data);
                    resolve({ success: true });
                } else {
                    reject(new CustomError(errors.en.noSuchAccountExist, StatusCodes.BAD_REQUEST));
                }
            }
        } catch (err) {
            console.log(err);
            reject(err)
        }
    });
}

function addVendorStoreType(userId: any, storeTypeId: any) {
    vendorStoreTypeModel.create({ userId, storeTypeId: storeTypeId });
}

// Vendor Timing
var vendorTiming = async (openTime: any, closeTime: any, vendorId: any, status: any) => {
    try {
        var time = {
            Monday: {
                openingTime: openTime,
                closingTime: closeTime
            },
            Tuesday: {
                openingTime: openTime,
                closingTime: closeTime
            },
            Wednesday: {
                openingTime: openTime,
                closingTime: closeTime
            },
            Thursday: {
                openingTime: openTime,
                closingTime: closeTime
            },
            Friday: {
                openingTime: openTime,
                closingTime: closeTime
            },
            Saturday: {
                openingTime: openTime,
                closingTime: closeTime
            },
            Sunday: {
                openingTime: openTime,
                closingTime: closeTime
            }
        }
        var obj = {
            ...time,
            userId: vendorId
        }
        if (status == "add") {
            await timingModel.create(obj);
        } else {
            const check: any = await timingModel.findOne({ userId: vendorId });
            if (check) {
                await timingModel.updateOne({ userId: vendorId }, time);
            } else {
                await timingModel.create(obj);
            }
        }
    } catch (err) {
        console.log(err);
    }

}

// Add Vendor
function addVendor(data: any, image: any, headers: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { timezone } = headers
            const { countryCode, phoneNumber } = data;
            const time = moment().tz(timezone).format('HH:mm');
            const date = moment().tz(timezone).format('DD/MM/YYYY')
            const date_time = moment().tz(timezone).format('DD/MM/YYYY,h:mm a')

            const obj = {
                ownerName: data.ownerName,
                businessName: data.businessName,
                ar_businessName: data.ar_businessName,
                phoneNumber: data.phoneNumber,
                role: "Vendor",
                status: "Approved",
                countryCode: data.countryCode,
                acceptRejectTime: time,
                acceptRejectDate: date,
                acceptRejectDate_Time: date_time,
                password: bcrypt.hashSync(data.password, 10)
            }

            const user = await vendorModel.findOne({ countryCode, phoneNumber });
            if (!user) {
                const add = await vendorModel.create(obj);
                const count = await vendorStoreModel.countDocuments();
                var c = count + 1;
                var str = "" + c;
                var pad = "00000";
                var ans = pad.substring(0, pad.length - str.length) + str;
                var branchId = "JR" + ans;
                const obj1 = {
                    image: image ? image[0].path : '',
                    userId: add._id,
                    branchId: branchId,
                    storeTypeId: data.storeTypeId,
                    phoneNumber: data.phoneNumber,
                    phoneNoCountryCode: data.countryCode,
                    main_branchName: data.businessName,
                    ar_main_branchName: data.ar_businessName,
                    branchName: data.businessName,
                    ar_branchName: data.ar_businessName,
                    fullAddress: data.fullAddress,
                    addressLine1: data.addressLine1,
                    countryCode: data.countryCodes, //IN AUS
                    state: data.state,
                    zipCode: data.zipCode,
                    city: data.city,
                    country: data.country,
                    googlePlaceId: data.googlePlaceId,
                    lat: data.lat,
                    lng: data.lng,
                    store_openClosing_time:true
                }
                const vendorStore = await vendorStoreModel.create(obj1);
                addVendorStoreType(add._id, data.storeTypeId);
                vendorTiming(data.openTime, data.closeTime, add._id, "add");
                resolve({ item: add, data: vendorStore });
            } else {
                reject(new CustomError(errors.en.accountAlreadyExist, StatusCodes.BAD_REQUEST));
            }
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}

// Edit Vendor
function editVendor(data: any, image: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { vendorId } = data;
            const obj = {
                ownerName: data.ownerName,
                businessName: data.businessName,
                ar_businessName: data.ar_businessName,
                phoneNumber: data.phoneNumber,
                countryCode: data.countryCode
            }
            const user = await vendorModel.findOne({ _id: vendorId });
            if (user) {
                const userCheck = await vendorModel.findOne({ countryCode: data.countryCode, phoneNumber: data.phoneNumber });
                if (userCheck) {
                    if (userCheck._id == vendorId) {
                        await vendorModel.updateOne({ _id: vendorId }, obj);
                        const check = await vendorStoreModel.findOne({ userId: vendorId, main_branchName: user.businessName });
                        if (check) {
                            const obj1 = {
                                image: image ? image[0].path : check.image,
                                main_branchName: data.businessName,
                                ar_main_branchName: data.ar_businessName,
                                branchName: data.businessName,
                                ar_branchName: data.ar_businessName,
                                fullAddress: data.fullAddress,
                                addressLine1: data.addressLine1,
                                countryCode: data.countryCodes, //IN AUS
                                state: data.state,
                                zipCode: data.zipCode,
                                city: data.city,
                                country: data.country,
                                googlePlaceId: data.googlePlaceId,
                                lat: data.lat,
                                lng: data.lng
                            }
                            await vendorStoreModel.updateOne({ userId: vendorId, main_branchName: user.businessName }, obj1);
                            resolve({ success: true });
                            vendorTiming(data.openTime, data.closeTime, vendorId, "edit");
                        } else {
                            reject(new CustomError(errors.en.noDatafound, StatusCodes.BAD_REQUEST));
                        }
                    } else {
                        reject(new CustomError(errors.en.accountAlreadyExist, StatusCodes.BAD_REQUEST));
                    }
                } else {
                    await vendorModel.updateOne({ _id: vendorId }, obj);
                    const check = await vendorStoreModel.findOne({ userId: vendorId, main_branchName: user.businessName });
                    if (check) {
                        const obj1 = {
                            image: image ? image[0].path : check.image,
                            main_branchName: data.businessName,
                            ar_main_branchName: data.ar_businessName,
                            branchName: data.businessName,
                            ar_branchName: data.ar_businessName,
                            fullAddress: data.fullAddress,
                            phoneNumber: data.phoneNumber,
                            addressLine1: data.addressLine1,
                            countryCode: data.countryCodes, //IN AUS
                            state: data.state,
                            zipCode: data.zipCode,
                            city: data.city,
                            country: data.country,
                            googlePlaceId: data.googlePlaceId,
                            lat: data.lat,
                            lng: data.lng
                        }
                        await vendorStoreModel.updateOne({ userId: vendorId, main_branchName: user.businessName }, obj1);
                        resolve({ success: true });
                        vendorTiming(data.openTime, data.closeTime, vendorId, "edit");
                    } else {
                        reject(new CustomError(errors.en.noDatafound, StatusCodes.BAD_REQUEST));
                    }
                }
            } else {
                reject(new CustomError(errors.en.noSuchAccountExist, StatusCodes.BAD_REQUEST));
            }
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}

// VendorDetails
function details(Id: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            if (!Id) {
                reject(new CustomError('VendorId require', StatusCodes.BAD_REQUEST));
            } else {
                const check = await vendorModel.findOne({ _id: Id }, { ownerName: 1, businessName: 1, ar_businessName: 1, phoneNumber: 1, countryCode: 1 });
                console.log(check,"poioi")
                if (check) {
                    var store = await vendorStoreModel.findOne({ userId: Id, main_branchName: check.businessName }).populate({ path: "storeTypeId", select: "storeType" });
                    if (store) {
                        var storeTiming = await timingModel.findOne({ userId: Id });
                        resolve({ storeDetails: store, profileDetails: check, timing: storeTiming });
                    } else {
                        resolve({ profileDetails: check });
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

//vendor view
function vendorDetails(storeId: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const details = await vendorStoreModel.findOne({ _id: storeId }, { storeTypeId: 1, userId: 1, phoneNumber: 1, phoneNoCountryCode: 1, fullAddress: 1, city: 1, state: 1, country: 1, main_branchName: 1, branchName: 1, image: 1, rating: 1 }).populate({ path: "storeTypeId userId", select: "storeType ownerName" })
            const totalOrder = await customerOrderModel.count({ storeId: storeId, status: { $in: ['Pending', 'Completed', 'Cancelled'] } })
            const completeOrder = await customerOrderModel.count({ storeId: storeId, status: 'Completed' })
            const in_progressOrder = await customerOrderModel.count({ storeId: storeId, status: 'Pending' })
            const cancellOrder = await customerOrderModel.count({ storeId: storeId, status: 'Cancelled' })
            if (details) {
                resolve({ response: details, totalOrder: totalOrder, completeOrder: completeOrder, In_progressOrder: in_progressOrder, cancelledOrder: cancellOrder })
            } else {
                reject(new CustomError(errors.en.noDatafound, StatusCodes.BAD_REQUEST))
            }
        } catch (err) {
            reject(err)
        }
    })
}

//vendor store rating list
function rating_list(query: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { page = 1, perPage = 10, storeId } = query
            const count = await ratingModel.count({ storeId: storeId })
            const ratingList = await ratingModel.find({ storeId: storeId }).populate({path:'userId',select:'name'}).sort({ createdAt: -1 }).skip((page * perPage) - perPage).limit(perPage)
            resolve({ items: ratingList,totalCount:count })
        } catch (err) {
            reject(err)
        }
    })
}

export default {
    vendor_list,
    updateStatus,
    update,
    addVendor,
    editVendor,
    details,
    vendorDetails,
    rating_list
} as const;