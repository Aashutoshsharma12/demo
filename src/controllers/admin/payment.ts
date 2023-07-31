import { cusineCategoryModel, customerModel, customerOrderModel, itemCategoryModel, storeTypeModel, vendorModel, vendorStoreModel } from "@models/index";
import { any, array } from "joi";
import moment from "moment-timezone";
const { ObjectId } = require('mongodb')
const _ = require('lodash')
import { getDaysArray, getMonthsArray } from '@utils/helpers'
import { time } from "console";
import paymentModel from "@models/payment";

//payment_list 
function paymentlist_list(data: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { page = 1, perPage = 10 } = data
            var List = await paymentModel.find({}).sort({ createdAt: -1 }).skip((page * perPage) - perPage).limit(perPage);
            resolve(List)
        } catch (err) {
            reject(err)
        }
    })
}

export default {
    paymentlist_list
} as const