import { vendorModel, doorKeeperModel, userSessionModel } from '@models/index';
import { CustomError } from '@utils/errors';
import StatusCodes from 'http-status-codes';
const jwt = require('jsonwebtoken');
import { errors } from '@constants';
import bcrypt from 'bcrypt';
import { func } from 'joi';
const _ = require('lodash');

// Get Details
function getDetails(door_KeeperId: any,headers:any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg:any = errors.en;
        if(headers.language == 'ar'){
            var err_msg:any = errors.ar;
        }
        try {
            const userData: any = await doorKeeperModel.findOne({
                _id: door_KeeperId
            },{name:1,image:1,phoneNumber:1,countryCode:1,isActive:1});
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
 
// Profile Update
function updateProfile(body: any, userId: any, image: any,headers:any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg:any = errors.en;
        if(headers.language == 'ar'){
            var err_msg:any = errors.ar;
        }
        try {
            // const { phoneNumber, name } = body;
            const check = await doorKeeperModel.findOne({ _id: userId },{image:1});
            if (check) {
                // const checkPhoneNumber: any = await doorKeeperModel.findOne({ phoneNumber });
                // if (checkPhoneNumber) {
                //     if (checkPhoneNumber._id == userId) {
                //         const obj = {
                //             name: name ? name : check.name,
                //             phoneNumber: phoneNumber ? phoneNumber : check.phoneNumber,
                //             image: image ? image[0].path : check.image
                //         };
                //         const update = await doorKeeperModel.updateOne({ _id: userId }, obj);
                //         resolve(update);
                //     } else {
                //         reject(new CustomError(err_msg.accountAlreadyExist, StatusCodes.BAD_REQUEST));
                //     }
                // } else {
                    const obj = {
                        image: image ? image[0].path : check.image
                    }
                    await doorKeeperModel.updateOne({ _id: userId }, obj);
                    const details = await doorKeeperModel.findOne({ _id: userId },{image:1,name:1,phoneNumber:1,countryCode:1});
                    resolve(details);
                }
            // } else {
            //     reject(new CustomError(err_msg.noDatafound, StatusCodes.BAD_REQUEST));
            // }
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
