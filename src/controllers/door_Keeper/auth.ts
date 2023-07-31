import { vendorModel, doorKeeperModel, userSessionModel } from '@models/index';
import { CustomError } from '@utils/errors';
import StatusCodes from 'http-status-codes';
const jwt = require('jsonwebtoken');
import { errors } from '@constants';
import bcrypt from 'bcrypt';
import { func } from 'joi';
const _ = require('lodash');

// User signIn
function login(body: any, headers: any, deviceip: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg: any = errors.en;
        if (headers.language == 'ar') {
            var err_msg: any = errors.ar;
        }
        try {
            const { phoneNumber, countryCode, role, password } = body;
            const { devicetoken, devicetype, timezone, language, currentversion } = headers;
            const userData: any = await doorKeeperModel.findOne({
                phoneNumber,
                countryCode,
                role
            });
            if (!userData) {
                reject(new CustomError(errors.en.noSuchAccountExist, StatusCodes.BAD_REQUEST));
            } else if (userData.isActive == false) {
                reject(new CustomError(errors.en.accountBlocked, StatusCodes.UNAUTHORIZED));
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
                    resolve({
                        token,
                        isUser: true,
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

// user Account verification
function checkAccount(user: any, headers: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg: any = errors.en;
        if (headers.language == 'ar') {
            var err_msg: any = errors.ar;
        }
        try {
            const { phoneNumber, countryCode, role } = user;
            const userData: any = await doorKeeperModel.findOne({
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

// Change Password
function changePassword(body: any, userId: any, headers: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg: any = errors.en;
        if (headers.language == 'ar') {
            var err_msg: any = errors.ar;
        }
        try {
            const { oldPassword, newPassword, confirmPassword } = body;
            const checkDoorKeeper = await doorKeeperModel.findOne({ _id: userId });
            if (checkDoorKeeper) {
                if (bcrypt.compareSync(oldPassword, checkDoorKeeper.password) == true) {
                    if (newPassword == confirmPassword) {
                        const pass = bcrypt.hashSync(newPassword, 10);
                        const upadte = await doorKeeperModel.updateOne({ _id: userId }, { password: pass });
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
//// Forgot Password
function forgotPassword(body: any, headers: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg: any = errors.en;
        if (headers.language == 'ar') {
            var err_msg: any = errors.ar;
        }
        try {
            const { newPassword, confirmPassword, phoneNumber, countryCode } = body;
            if (newPassword == confirmPassword) {
                const pass = bcrypt.hashSync(newPassword, 10);
                const upadte = await doorKeeperModel.updateOne({ phoneNumber: phoneNumber, countryCode: countryCode }, { password: pass });
                resolve({ success: true });
            } else {
                reject(new CustomError(err_msg.notSamePassword, StatusCodes.BAD_REQUEST))
            }
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}

// Logout
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
    checkAccount,
    changePassword,
    forgotPassword,
    logOut
} as const;
