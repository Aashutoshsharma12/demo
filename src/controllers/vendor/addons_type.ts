import { addons_typeModel } from '../../models/index';
import { CustomError } from '../../utils/errors';
import StatusCodes from 'http-status-codes';
import { errors } from '../../constants/index';
const _ = require('lodash');

// add addons_type
function addAddons_type(data: any, userId: any,headers:any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg:any = errors.en;
        if(headers.language == 'ar'){
            var err_msg:any = errors.ar;
        }
        try {
            if (!data.title) {
                reject(new CustomError(err_msg.requiredTitle, StatusCodes.BAD_REQUEST));
            }
            else if (!data.storeId) {
                reject(new CustomError(err_msg.requiredStore, StatusCodes.BAD_REQUEST));
            }else{
                const body = {
                    ...data,
                    lower_title: (data.title).toLowerCase(),
                    userId
                };
                const check = await addons_typeModel.findOne({ lower_title: (data.title).toLowerCase(),storeId:data.storeId, userId: userId ,isDelete:false});
                if (check) {
                    reject(new CustomError(err_msg.alreadyExist, StatusCodes.BAD_REQUEST));
                } else {
                    const addAddons_type = await addons_typeModel.create(body);
                    resolve(addAddons_type);
                }
            }            
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}

// Edit Addons_Type
function editAddons_Type(query: any, addons_typeId: any, userId: any,headers:any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg:any = errors.en;
        if(headers.language == 'ar'){
            var err_msg:any = errors.ar;
        }
        try {
            const { title,ar_title,storeId } = query;
            const { id } = addons_typeId;
            if (!title) {
                reject(new CustomError(err_msg.requiredTitle, StatusCodes.BAD_REQUEST));
            }else if (!storeId) {
                reject(new CustomError(err_msg.requiredStore, StatusCodes.BAD_REQUEST));
            }else{
                const checkType = await addons_typeModel.findOne({ _id: id });
                if (checkType) {
                    const checkType1:any = await addons_typeModel.findOne({userId:userId,storeId:storeId,lower_title:title.toLowerCase(),isDelete:false});
                    if(checkType1){
                        if (checkType1._id == id) {
                            const update = await addons_typeModel.updateOne({ _id: id }, { title: title, lower_title: title.toLowerCase() });
                            resolve(update);
                        } else {
                            reject(new CustomError(err_msg.addons_Type, StatusCodes.BAD_REQUEST));
                        }
                    }else{
                        const update = await addons_typeModel.updateOne({ _id: id }, { title: title, lower_title: title.toLowerCase(),ar_title:ar_title });
                        resolve(update);
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

// get Addons_Type
function getAddons_Type(addons_typeId: any, userId: any,headers:any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg:any = errors.en;
        if(headers.language == 'ar'){
            var err_msg:any = errors.ar;
        }
        try {
            const { id } = addons_typeId;
            const typeDetails = await addons_typeModel.findOne({ _id: id,userId:userId });
            if (typeDetails) {
                resolve(typeDetails);
            } else {
                reject(new CustomError(err_msg.noDatafound, StatusCodes.BAD_REQUEST));
            }
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}

// List of Addons_Type
 function listOfAddons_Type(query: any, userId: any,headers:any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg:any = errors.en;
        if(headers.language == 'ar'){
            var err_msg:any = errors.ar;
        }
        try {
            const { isActive = true,storeId } = query;
            if (!storeId) {
                reject(new CustomError(err_msg.requiredStore, StatusCodes.BAD_REQUEST));
            }
            const list = await addons_typeModel.find({userId:userId,storeId:storeId,isDelte:false,isActive:isActive }).sort({createdAt:-1});
            resolve({items:list});           
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}

export default {
    addAddons_type,
    editAddons_Type,
    getAddons_Type,
    listOfAddons_Type
} as const;