import { vendorStoreModel, vendorModel, userSessionModel, storeTypeModel, vendorStoreTypeModel } from '../../models/index';
import { CustomError } from '../../utils/errors';
import StatusCodes from 'http-status-codes';
const jwt = require('jsonwebtoken');
import { errors } from '../../constants/index';
import bcrypt from 'bcrypt';
import { func } from 'joi';
import { STATUS_CODES } from 'http';
const _ = require('lodash');

// List of Store Type for Added Branch
function listOf_storeType(query: any, userId: any,headers:any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg:any = errors.en;
        if(headers.language == 'ar'){
            var err_msg:any = errors.ar;
        }
        try {
            const { page = 1, perPage = 10 } = query;
            const list = await storeTypeModel.find({ isDelete: false })
                .skip((page * perPage) - perPage)
                .limit(perPage);
            if (list && list.length) {
                resolve(list);
            } else {
                resolve(list);
            }
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}


function addVendorStoreType (userId:any, storeTypeId:any){
    vendorStoreTypeModel.create({ userId, storeTypeId: storeTypeId });
}

// Add store  WITH MAIN BRANCH
function addStore(body: any, userId: any,headers:any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg:any = errors.en;
        if(headers.language == 'ar'){
            var err_msg:any = errors.ar;
        }
        try {
            const count = await vendorStoreModel.countDocuments();
            var c = count + 1;
            var str = "" + c;
            var pad = "00000";
            var ans = pad.substring(0, pad.length - str.length) + str;
            var branchId = "JR" + ans;
            const checkVendor_store = await vendorStoreTypeModel.findOne({ userId: userId });
            if(checkVendor_store){
                reject(new CustomError(err_msg.alreadyStore, StatusCodes.BAD_REQUEST));
            }else{
                const vendorDetails = await vendorModel.findOne({ _id: userId });
                if (vendorDetails) {
                    var details = {
                        ...body,
                        userId,
                        phoneNumber:vendorDetails.phoneNumber,
                        phoneNoCountryCode:vendorDetails.countryCode,
                        branchId: branchId,
                        main_branchName: vendorDetails.businessName,
                        branchName: vendorDetails.businessName,
                        ar_main_branchName:vendorDetails.ar_businessName,
                        ar_branchName:vendorDetails.ar_businessName,
                        isActive:false
                    };
                }
                addVendorStoreType(userId, body.storeTypeId);
                const add = await vendorStoreModel.create(details);
                resolve(add);
            }
            
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}


// add New Branch
function add_branch(body: any, userId: any,headers:any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg:any = errors.en;
        if(headers.language == 'ar'){
            var err_msg:any = errors.ar;
        }
        try {
            const count = await vendorStoreModel.countDocuments();
            var c = count + 1;
            var str = "" + c;
            var pad = "00000";
            var ans = pad.substring(0, pad.length - str.length) + str;
            var branchId = "JR" + ans;
            const vendorStoreType: any = await vendorStoreTypeModel.findOne({ userId: userId, isActive: true, isDelete: false });
            if (vendorStoreType) {
                var storeTypeId = vendorStoreType.storeTypeId;
            } else {
                reject(new CustomError(err_msg.selectStore, StatusCodes.BAD_REQUEST));
            }
            const data = {
                ...body,
                branchId,
                storeTypeId,
                userId
            }
            const addBranch = await vendorStoreModel.create(data);
            resolve(addBranch);
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}

// Edit Branch
function editBranch(query: any, body: any, userId: any,headers:any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg:any = errors.en;
        if(headers.language == 'ar'){
            var err_msg:any = errors.ar;
        }
        try {
            const { branch_Id } = query;
            if (!branch_Id) {
                reject(new CustomError(err_msg.requireBranch, StatusCodes.BAD_REQUEST));
            } else {
                const checkBranch = await vendorStoreModel.findOne({ _id: branch_Id, isDelete: false });
                if (checkBranch) {
                    if (checkBranch.main_branchName && checkBranch.main_branchName != null) {
                        const obj = {
                            ...body,
                            main_branchName: body.branchName,
                            ar_main_branchName: body.ar_branchName
                        };
                        await vendorModel.updateOne({ _id: userId }, { businessName: body.branchName,ar_businessName: body.ar_businessName});
                        const update = await vendorStoreModel.updateOne({ _id: branch_Id }, obj);
                        resolve({ success: true });
                    } else {
                        const update = await vendorStoreModel.updateOne({ _id: branch_Id }, body);
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

// get Vendor Store Branch Details
function branchDetails(branchId: any, userId: any,headers:any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg:any = errors.en;
        if(headers.language == 'ar'){
            var err_msg:any = errors.ar;
        }
        try {
            const { id } = branchId;
            const getBranchDetails = await vendorStoreModel.findOne({ _id: id });
            if (getBranchDetails) {
                resolve(getBranchDetails);
            } else {
                reject(new CustomError(err_msg.noDatafound, StatusCodes.BAD_REQUEST));
            }
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}

// List of Vendor Branches
function listOf_branch(query: any, userId: any,headers:any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { page = 1, perPage = 10 } = query;
            const list = await vendorStoreModel.find({ userId: userId, isDelete: false }).sort({createdAt:1}).skip((page * perPage) - perPage).limit(perPage);
            resolve({ branchs: list });
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}

// status Update
function update_status(query: any, userId: any,headers:any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg:any = errors.en;
        if(headers.language == 'ar'){
            var err_msg:any = errors.ar;
        }
        try {
            const { branch_id, isActive } = query;
            if (!branch_id) {
                reject(new CustomError(err_msg.requireBranch, StatusCodes.BAD_REQUEST));
            }else if (!isActive) {
                reject(new CustomError(err_msg.requireActive, StatusCodes.BAD_REQUEST));
            } else {
                const checkBranch = await vendorStoreModel.findOne({ _id: branch_id, isDelete: false });
                if (checkBranch) {
                    await vendorStoreModel.updateOne({ _id: branch_id }, { isActive: isActive });
                    resolve({ success: true });
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

// Delete Branch
function delete_branch(branchId: any, userId: any,headers:any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg:any = errors.en;
        if(headers.language == 'ar'){
            var err_msg:any = errors.ar;
        }
        try {
            const { id } = branchId;
            const checkBranch = await vendorStoreModel.findOne({ _id: id });
            if (checkBranch) {
                if (checkBranch.isDelete == true) {
                    reject(new CustomError(err_msg.alreadyBranch, StatusCodes.BAD_REQUEST));
                } else {
                    await vendorStoreModel.updateOne({ _id: id }, { isDelete: true });
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
    listOf_storeType,
    addStore,
    branchDetails,
    add_branch,
    editBranch,
    listOf_branch,
    update_status,
    delete_branch
} as const;