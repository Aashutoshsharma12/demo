import { customerModel, userSessionModel } from '@models/index';
import { CustomError } from '@utils/errors';
import StatusCodes from 'http-status-codes';
import { errors } from '@constants';
import bcrypt from 'bcrypt';
import { func } from 'joi';
const _ = require('lodash');

/** Get Details */
function getDetails(userId: any,headers:any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg:any = errors.en;
        if(headers.language == 'ar'){
            var err_msg:any = errors.ar;
        }
        try {
            const userData: any = await customerModel.findOne({
                _id: userId
            });
            if (!userData) {
                resolve({
                    isUser: false
                });
            } else {
                if (userData.isActive) {
                    resolve({
                        isUser: true, userData: userData
                    });
                } else {
                    reject(new CustomError(err_msg.accountBlocked, StatusCodes.UNAUTHORIZED));
                }
            }
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}

/** Profile Update */
function updateProfile(body: any, userId: any, image: any,headers:any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg:any = errors.en;
        if(headers.language == 'ar'){
            var err_msg:any = errors.ar;
        }
        try {
            const { phoneNumber, name, email,countryCode } = body;
            var str = email;
            var arr = str.split(',');
            const check = await customerModel.findOne({ _id: userId });
            if (check) {
                const checkPhoneNumber: any = await customerModel.findOne({countryCode:countryCode, phoneNumber: phoneNumber, isDelete: false });
                if (checkPhoneNumber) {
                    if (checkPhoneNumber._id == userId) {
                        const obj = {
                            ...body,
                            email: arr,
                            image: image ? image[0].path : check.image
                        };
                        const update = await customerModel.updateOne({ _id: userId }, obj);
                        resolve(update);
                    } else {
                        reject(new CustomError(err_msg.accountAlreadyExist, StatusCodes.BAD_REQUEST));
                    }
                } else {
                    const obj = {
                        name: name ? name : check.name,
                        countryCode:countryCode?countryCode:check.countryCode,
                        phoneNumber: phoneNumber ? phoneNumber : check.phoneNumber,
                        email: arr ? arr : check.email,
                        image: image ? image[0].path : ''
                    }
                    const update = await customerModel.updateOne({ _id: userId }, obj);
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


// Export default
export default {
    getDetails,
    updateProfile
} as const;
