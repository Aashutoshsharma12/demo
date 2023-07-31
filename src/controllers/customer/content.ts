import { vendor_menueItemsModel, cusineCategoryModel, foodCategoryModel } from "../../models/index";
import { CustomError } from "../../utils/errors";
import StatusCodes from "http-status-codes";
import { errors } from "../../constants/index";
const _ = require('lodash');

function cuisineeList(query: any,headers:any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg:any = errors.en;
        if(headers.language == 'ar'){
            var err_msg:any = errors.ar;
        }
        try {
            const { search ,storeTypeId} = query;
            let condition: any = {
                isActive:true,  
                isDelete: false,
                storeTypeId:storeTypeId
            }
            if (search && search != '') {
                condition = {
                    ...condition,
                    $or: [
                        { title: { $regex: search, $options: 'i' } }
                    ]
                }
            }
            const cuisineeList = await cusineCategoryModel.find(condition);
            const total = await cusineCategoryModel.countDocuments(condition);
            if (cuisineeList && cuisineeList.length) {
                resolve({ cuisineeList, total });
            } else {
                resolve({ cuisineeList, total });
            }
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
}

function foodCategoryList(query: any,headers:any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg:any = errors.en;
        if(headers.language == 'ar'){
            var err_msg:any = errors.ar;
        }
        try {
            const { page = 1, perPage = 10, search } = query;
            let condition: any = {
                isDelete: false
            }
            if (search && search != '') {
                condition = {
                    ...condition,
                    title: { $regex: search, $options: 'i' }
                }
            }
            const foodCategoryList = await foodCategoryModel.find(condition).skip((page * perPage) - perPage).limit(perPage);
            const total = await foodCategoryModel.countDocuments(condition);
            if (foodCategoryList) {
                resolve({ foodCategoryList, total });
            } else {
                resolve({ foodCategoryList, total });
            }
        } catch (error) {
            console.log(error);
            reject(error);
        }
    })
}

function searchFilter(query: any,headers:any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg:any = errors.en;
        if(headers.language == 'ar'){
            var err_msg:any = errors.ar;
        }
        try {
            const { page = 1, perPage = 10, sort = 1, search } = query;
            let condition: any = {
                isDelete: false
            }
            if (search && search != '') {
                condition = {
                    ...condition,
                    $or: [{
                        itemName: { $regex: search, $options: 'i' }
                    }]
                }
            }
            const searchFilter = await vendor_menueItemsModel.find(condition).sort({ "amount": sort }).skip((page * perPage) - perPage).limit(perPage);
            const total = await vendor_menueItemsModel.countDocuments(condition);
            if (searchFilter && searchFilter.length) {
                resolve({ searchFilter, total });
            } else {
                resolve({ searchFilter, total });
            }
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
}

export default {
    cuisineeList,
    foodCategoryList,
    searchFilter
}