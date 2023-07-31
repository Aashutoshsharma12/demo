import { vendorModel, userSessionModel, vendorStoreTypeModel, storeTypeModel, vendorStoreModel } from '@models/index';
import { CustomError } from '@utils/errors';
import StatusCodes from 'http-status-codes';
const jwt = require('jsonwebtoken');
import { errors } from '@constants';
import bcrypt from 'bcrypt';
import { func } from 'joi';
const _ = require('lodash');

// User SignUp
function signUp(user: any, headers: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg:any = errors.en;
        if(headers.language == 'ar'){
            var err_msg:any = errors.ar;
        }
        try {
            const { role, phoneNumber, ownerName, businessName, countryCode, password } = user;
            const { devicetoken, devicetype, timezone, language, currentversion } = headers;
            const check_vendor = await vendorModel.findOne({countryCode:countryCode, phoneNumber: phoneNumber });
            if (check_vendor) {
                reject(new CustomError(err_msg.accountAlreadyExist, StatusCodes.BAD_REQUEST));
            } else {
                var pass = bcrypt.hashSync(password, 10);
                user.password = pass;
                const userData: any = await vendorModel.create(user);
                const token: string = jwt.sign({
                    id: userData.id,
                    role,
                    userId: userData._id
                }, process.env.JWT_SECRET_TOKEN, { expiresIn: '30d' });
                const sessionObj = {
                    deviceToken: devicetoken,
                    deviceType: devicetype,
                    timezone: timezone,
                    language: language,
                    currentVersion: currentversion,
                    role: role,
                    jwtToken: token,
                    userId: userData.id
                };
                await userSessionModel.create(sessionObj);
                resolve({
                    token,
                    isUser: true,
                    storeType:false,
                    isVerified: true,
                    phoneNumber: phoneNumber,
                    countryCode: countryCode,
                    ownerName: ownerName,
                    businessName: businessName,
                    _id: userData._id
                });
            }
        } catch (err) {
            console.log(err);
            if (err.code == 11000) {
                reject(new CustomError(err_msg.accountAlreadyExist, StatusCodes.BAD_REQUEST));
            }
            reject(err);
        }
    });
}

// User signIn.
function login(body: any, headers: any, deviceip: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg:any = errors.en;
        if(headers.language == 'ar'){
            var err_msg:any = errors.ar;
        }
        try {
            const { phoneNumber, countryCode, role, password } = body;
            const { devicetoken, devicetype, timezone, language, currentversion } = headers;
            const userData: any = await vendorModel.findOne({
                phoneNumber,
                countryCode,
                role
            });
            if (!userData) {
                reject(new CustomError(errors.en.noSuchAccountExist, StatusCodes.BAD_REQUEST));
            } else if (userData.isActive == false) {
                reject(new CustomError(err_msg.accountBlocked, StatusCodes.UNAUTHORIZED));
            } else {
                var pass: any = bcrypt.compareSync(password, userData.password);
                if (pass == true) {
                    const token: string = jwt.sign({
                        id: userData.id,
                        role
                    }, process.env.JWT_SECRET_TOKEN, { expiresIn: '30d' });
                    const sessionObj = {
                        deviceType: devicetype,
                        deviceIp: deviceip,
                        timezone: timezone,
                        language: language,
                        currentVersion: currentversion,
                        deviceToken: devicetoken,
                        role: role,
                        jwtToken: token,
                        userId: userData.id
                    };
                    await userSessionModel.updateMany({ "userId": userData.id }, { $set: { "status": false } });
                    await userSessionModel.create(sessionObj);
                    const checkstoreType = await vendorStoreTypeModel.findOne({ userId: userData._id, isDelete: false });
                    if (checkstoreType) {
                        var storeType:any = true;
                        var storeTypeId:any = checkstoreType.storeTypeId;
                        var store:any = await vendorStoreModel.findOne({ userId: userData._id, isDelete: false });
                        var storeId = store._id;
                    } else {
                        var storeType:any = false;
                        var storeId:any = "";
                        var storeTypeId:any = "";
                    }
                    resolve({
                        token,
                        token12:"update",
                        Number:"123",
                        isUser: true,
                        storeType:storeType,
                        storeTypeId:storeTypeId,
                        storeId:storeId,
                        isVerified: true,
                        _id: userData._id
                    });
                } else {
                    reject(new CustomError(err_msg.WrongPassword, StatusCodes.BAD_REQUEST));
                }
            }
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}

// User Account verification
function checkAccount(user: any,headers:any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg:any = errors.en;
        if(headers.language == 'ar'){
            var err_msg:any = errors.ar;
        }
        try {
            const { phoneNumber, countryCode, role } = user;
            const userData: any = await vendorModel.findOne({
                phoneNumber,
                countryCode,
                role
            });
            if (!userData) {
                resolve({
                    isUser: false
                });
            } else {
                if (userData.isActive) {
                    resolve({
                        isUser: true,
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
 
// OTP Verification
function otp_verification(user: any,headers:any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg:any = errors.en;
        if(headers.language == 'ar'){
            var err_msg:any = errors.ar;
        }
        try {
            const { otp } = user;
            if (otp == 123456) {
                resolve({ isVerifyOtp: true });
            } else {
                reject(new CustomError(err_msg.invalidOtp, StatusCodes.BAD_REQUEST));
            }
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}

// Reset password
function resetPassword(body: any,headers:any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg:any = errors.en;
        if(headers.language == 'ar'){
            var err_msg:any = errors.ar;
        }
        try {
            const { newPassword, confirmPassword, phoneNumber,countryCode } = body;
            if (newPassword == confirmPassword) {
                const pass = bcrypt.hashSync(newPassword, 10);
                const update = await vendorModel.updateOne({ phoneNumber,countryCode }, { password: pass });
                resolve(update);
            } else {
                reject(new CustomError(err_msg.notSamePassword, StatusCodes.BAD_REQUEST));
            }
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}
 
// Change Password
function changePassword(body: any, userId: any,headers:any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg:any = errors.en;
        if(headers.language == 'ar'){
            var err_msg:any = errors.ar;
        }
        try {
            const { oldPassword, newPassword, confirmPassword } = body;
            const checkVendor = await vendorModel.findOne({ _id: userId });
            if (checkVendor) {
                if (bcrypt.compareSync(oldPassword, checkVendor.password) == true) {
                    if (newPassword == confirmPassword) {
                        const pass = bcrypt.hashSync(newPassword, 10);
                        const upadte = await vendorModel.updateOne({ _id: userId }, { password: pass });
                        resolve(upadte);
                    } else {
                        reject(new CustomError(err_msg.notSamePassword, StatusCodes.BAD_REQUEST));
                    }
                } else {
                    reject(new CustomError(err_msg.WrongOldPassword, StatusCodes.BAD_REQUEST));
                }
            } else {
                reject(new CustomError(err_msg.noSuchAccount, StatusCodes.BAD_REQUEST));
            }
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}

function logOut(headers: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const token = headers.authorization;
            await userSessionModel.updateOne({ jwtToken: token }, { status: false });
            resolve({ success: true });
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}


// Export default
export default {
    login,
    signUp,
    checkAccount,
    otp_verification,
    resetPassword,
    changePassword,
    logOut
} as const;
