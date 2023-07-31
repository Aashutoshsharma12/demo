import { customerModel, userSessionModel } from '@models/index';
import { CustomError } from '@utils/errors';
import StatusCodes from 'http-status-codes';
const jwt = require('jsonwebtoken');
import { errors } from '@constants';
import { identityGenerator } from '@utils/helpers';
const config = require('../../config/stripe');
const stripe = require('stripe')(config.secretKey);
const _ = require('lodash');

// User SignUp
function signUp(user: any, headers: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg: any = errors.en;
        if (headers.language == 'ar') {
            var err_msg: any = errors.ar;
        }
        try {
            const { role, otp, phoneNumber, countryCode, name } = user;
            const { devicetoken, devicetype, timezone, language, currentversion } = headers;
            if (otp == 123456) {
                const check_customer = await customerModel.findOne({ "countryCode": countryCode, "phoneNumber": phoneNumber, isDelete: false });
                if (check_customer) {
                    reject(new CustomError(err_msg.accountAlreadyExist, StatusCodes.BAD_REQUEST));
                } else {
                    //create account on stripe
                    //let get_stripeData = await methods.createStripeAccountId(stripe_data);
                    const stripeId = await stripe.customers.create({
                        phone: phoneNumber
                    });
                    user.stripeId = stripeId.id
                    const userCount = await customerModel.count({ isDelete: false });
                    var Id = identityGenerator(userCount, "RC")
                    user.customerRCId = Id
                    const userData: any = await customerModel.create(user);
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
                    }
                    await userSessionModel.create(sessionObj);
                    console.log({ _id: userData._id,
                        countryCode: countryCode,
                        phoneNumber: phoneNumber,
                        isUser: true,
                        isVerified: true,
                        token,},";lp[[pp")
                    resolve({
                        _id: userData._id,
                        countryCode: countryCode,
                        phoneNumber: phoneNumber,
                        isUser: true,
                        isVerified: true,
                        token,
                    });
                }
            } else {
                reject(new CustomError(err_msg.invalidOtp, StatusCodes.BAD_REQUEST));
            }
        } catch (error) {
            console.log(error);
            if (error.code == 11000) {
                reject(new CustomError(err_msg.accountAlreadyExist, StatusCodes.BAD_REQUEST));
            }
        }
    });
}

// User Login
function login(body: any, headers: any, deviceip: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg: any = errors.en;
        if (headers.language == 'ar') {
            var err_msg: any = errors.ar;
        }
        try {
            const { phoneNumber, countryCode, role, otp } = body;
            const { devicetoken, devicetype, timezone, language, currentversion } = headers;
            if (otp == 123456) {
                const userData: any = await customerModel.findOne({
                    phoneNumber,
                    countryCode,
                    role
                });
                if (!userData) {
                    reject(new CustomError(err_msg.noSuchAccountExist, StatusCodes.BAD_REQUEST));
                }
                if (userData.isDelete == true) {
                    reject(new CustomError(err_msg.accountDelete, StatusCodes.UNAUTHORIZED));
                } else {
                    if (userData.isActive == false) {
                        reject(new CustomError(err_msg.accountBlocked, StatusCodes.UNAUTHORIZED));
                    }
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
                    }
                    await userSessionModel.updateMany({ "userId": userData.id }, { $set: { "status": false } });
                    await userSessionModel.create(sessionObj);
                    await userSessionModel.updateMany({ "userId": userData.id }, { $set: { "status": false } });
                    await userSessionModel.create(sessionObj);
                    resolve({
                        token,
                        phoneNumber: phoneNumber,
                        isUser: true,
                        isVerified: true,
                        _id: userData._id
                    });
                }

            } else {
                reject(new CustomError(err_msg.invalidOtp, StatusCodes.BAD_REQUEST));
            }
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
}

// User Account Verification
function checkAccount(user: any, headers: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg: any = errors.en;
        if (headers.language == 'ar') {
            var err_msg: any = errors.ar;
        }
        try {
            const { phoneNumber, countryCode, role } = user;
            const userData: any = await customerModel.findOne({
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

// user Logout
function logOut(headers: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg: any = errors.en;
        if (headers.language == 'ar') {
            var err_msg: any = errors.ar;
        }
        try {
            const token = headers.authorization;
            await userSessionModel.updateOne({ jwtToken: token }, { status: false });
            resolve({ success: true });
        } catch (error) {
            console.log(error);
            reject(error);
            const token = headers.authorization;
            await userSessionModel.updateOne({ jwtToken: token }, { status: false });
            resolve({ success: true });
        }
    });
}

// Export default
export default {
    login,
    signUp,
    checkAccount,
    logOut
} as const;
