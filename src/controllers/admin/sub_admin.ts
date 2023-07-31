import { adminModel, userSessionModel } from '@models/index';
import { CustomError } from '@utils/errors';
import StatusCodes from 'http-status-codes';
import bcrypt from 'bcrypt';
import { errors, fcm } from '@constants';
const jwt = require('jsonwebtoken');
import moment from 'moment-timezone';
import { identityGenerator } from '@utils/helpers';

// Add sub_Admin
function add_subAdmin(data: any, adminId: any): Promise<void> {
    return new Promise(async (resolve, reject) => {
        try {
            const { password, confirmPassword, email, permission } = data;
            if (!permission) {
                reject(new CustomError("Permission required", StatusCodes.BAD_REQUEST));
            } else if (permission.length == 0) {
                reject(new CustomError("Please select permission", StatusCodes.BAD_REQUEST));
            } else {
                const check = await adminModel.findOne({ email: email, isDelete: false });
                if (check) {
                    reject(new CustomError(errors.en.emailAlreadyExist, StatusCodes.BAD_REQUEST));  
                } else {
                    if (password != confirmPassword) {
                        reject(new CustomError(errors.en.notSamePassword, StatusCodes.BAD_REQUEST));
                    } else {
                        const count: any = await adminModel.countDocuments({ role: "Sub_Admin" });
                        var c = count + 1;
                        var str = "" + c;
                        var pad = "0000";
                        var ans = pad.substring(0, pad.length - str.length) + str;
                        var m = new Date();
                        var mm = m.getMonth() + 1;
                        var yy = m.getFullYear();
                        var dd = m.getDate();
                        if(mm >=10){
                            var mm1:any = mm
                        }else{
                            var mm1:any = 0 + "" + mm
                        }
                        if(dd >=10){
                            var dd1:any = dd
                        }else{
                            var dd1:any = 0 + "" + dd
                        }
                        var ID:any = (yy + "" + mm1 + "" + dd1 + "" + ans);
                        const pass = bcrypt.hashSync(data.password, 10);
                        data.password = pass;
                        data.confirmPassword = pass;
                        data.role = "Sub_Admin";
                        data.ID = ID;
                        const response: any = await adminModel.create(data);
                        resolve(response);
                    }
                }
            }
        } catch (err) {
            console.log(err);
            if (err.code == 11000) {
                reject(new CustomError(errors.en.alreadyExist, StatusCodes.BAD_REQUEST));
            }
            reject(err);
        }
    });
}

// Edit Sub_Admin
function edit_subAdmin(data: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { subAdminId, email, password, confirmPassword, permission } = data;
            const checkSubAdmin = await adminModel.findOne({ _id: subAdminId, isDelete: false });
            if (checkSubAdmin) {
                if (!permission) {
                    reject(new CustomError("Permission required", StatusCodes.BAD_REQUEST));
                } else if (permission.length == 0) {
                    reject(new CustomError("Please select permission", StatusCodes.BAD_REQUEST));
                } else {
                    if (password != confirmPassword) {
                        reject(new CustomError(errors.en.notSamePassword, StatusCodes.BAD_REQUEST));
                    } else {
                        if (data.password && data.password != "") {
                            var password1 = bcrypt.hashSync(data.password, 10);
                        }else{
                            var password1 = checkSubAdmin.password;
                        }
                        var obj = {
                            name: data.name ? data.name : checkSubAdmin.name,
                            email: data.email ? data.email : checkSubAdmin.email,
                            phoneNumber: data.phoneNumber ? data.phoneNumber : checkSubAdmin.phoneNumber,
                            countryCode: data.countryCode ? data.countryCode : checkSubAdmin.countryCode,
                            isActive: data.isActive,
                            password: password1,
                            confirmPassword: password1,
                            permission: data.permission ? data.permission : checkSubAdmin.permission
                        }

                        const checkEmail = await adminModel.findOne({ email: email, isDelete: false });
                        if (checkEmail) {
                            if (checkEmail._id == subAdminId) {
                                await adminModel.updateOne({ _id: subAdminId }, obj);
                                resolve({ success: true });
                            } else {
                                reject(new CustomError(errors.en.emailAlreadyExist, StatusCodes.BAD_REQUEST));
                            }
                        } else {
                            await adminModel.updateOne({ _id: subAdminId }, obj);
                            resolve({ success: true });
                        }
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

// Details
function details(subAdminId: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const details: any = await adminModel.findOne({ _id: subAdminId, isDelete: false }, { password: 0, confirmPassword: 0 });
            if (details) {
                resolve(details);
            } else {
                reject(new CustomError(errors.en.noDatafound, StatusCodes.BAD_REQUEST));
            }
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}

// Active Deactive
function updateStatus(subAdminId: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const details = await adminModel.findOne({ _id: subAdminId, isDelete: false });
            if (details) {
                if (details.isActive == true) {
                    var status = false;
                } else {
                    var status = true;
                }
                await adminModel.updateOne({ _id: subAdminId }, { isActive: status });
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

// List
function list(query: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { page = 1, perPage = 10, search, status } = query;
            let condition: any = { isDelete: false, role: "Sub_Admin" };
            if(query.sort && query.sort !='' ){
                var sort:any = query.sort
            }else{
                var sort:any = -1
            }
            if (search && search != '' && status && status != '') {
                condition = {
                    ...condition,
                    isActive: status,
                    $or: [
                        { name: { $regex: search, $options: 'i' } },
                        { email: { $regex: search, $options: 'i' } },
                        { phoneNumber: { $regex: search, $options: 'i' } },
                        { ID: { $regex: search, $options: 'i' } }
                    ]
                }
            } else if (search && search != '') {
                condition = {
                    ...condition,
                    $or: [
                        { name: { $regex: search, $options: 'i' } },
                        { email: { $regex: search, $options: 'i' } },
                        { phoneNumber: { $regex: search, $options: 'i' } },
                        { ID: { $regex: search, $options: 'i' } }
                    ]
                }
            } else if (status && status != '') {
                condition = {
                    ...condition,
                    isActive: status
                }
            } else {
                condition = {
                    ...condition
                }
            }
            const list = await adminModel.find(condition, { password: 0, confirmPassword: 0 }).sort({ ID: sort }).skip((page * perPage) - perPage).limit(perPage);
            const count = await adminModel.countDocuments(condition);
            resolve({ items: list ,totalCount:count});
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}

export default {
    add_subAdmin,
    edit_subAdmin,
    details,
    updateStatus,
    list

} as const;