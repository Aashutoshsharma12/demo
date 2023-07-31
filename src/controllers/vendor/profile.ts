import { vendorModel, userSessionModel,vendorStoreModel } from '@models/index';
import { CustomError } from '@utils/errors';
import StatusCodes from 'http-status-codes';
import { errors } from '@constants';
import { any, func } from 'joi';
import { ConnectionCheckOutFailedEvent } from 'mongodb';
const _ = require('lodash');

// Get Details
function details(userId: any,headers:any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg:any = errors.en;
        if(headers.language == 'ar'){
            var err_msg:any = errors.ar;
        }
        try {
            const vendorDetails = await vendorModel.findOne({ _id: userId }, { phoneNumber: 1, countryCode: 1, ownerName: 1, role: 1 });
            if (vendorDetails) {
                resolve(vendorDetails);
            } else {
                reject(new CustomError(err_msg.noSuchAccount, StatusCodes.BAD_REQUEST));
            }
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}

// Edit Profile
function updateProfile(data: any, userId: any,headers:any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg:any = errors.en;
        if(headers.language == 'ar'){
            var err_msg:any = errors.ar;
        }
        try {
            const { name, phoneNumber, countryCode } = data;
            const checkVendor: any = await vendorModel.findOne({countryCode:countryCode, phoneNumber: phoneNumber });
            if (checkVendor) {
                if (checkVendor._id == userId) {
                    const body = {
                        ownerName: name,
                        phoneNumber: phoneNumber,
                        countryCode: countryCode
                    }
                    await vendorModel.updateOne({ _id: userId }, body);
                    resolve({ success: true });
                } else {
                    reject(new CustomError(err_msg.phoneAlreadyExist, StatusCodes.BAD_GATEWAY));
                }
            } else {
                const body = {
                    ownerName: name,
                    phoneNumber: phoneNumber
                }
                await vendorModel.updateOne({ _id: userId }, body);
                resolve({ success: true });
            }
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}

// Upadte Notification Push notification
function pushNotification(body: any, userId: any,headers:any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg:any = errors.en;
        if(headers.language == 'ar'){
            var err_msg:any = errors.ar;
        }
        try {
            const { status } = body;
            const checkVendor = await vendorModel.findOne({ _id: userId });
            if (checkVendor) {
                await vendorModel.updateOne({ _id: userId }, { isAllowNotification: status });
                resolve({ success: true });
            } else {
                reject(new CustomError(err_msg.noSuchAccount, StatusCodes.BAD_REQUEST));
            }
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}

// Export default
export default {
    details,
    updateProfile,
    pushNotification
} as const;
