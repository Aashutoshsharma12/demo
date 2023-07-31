import { CustomError } from "../../utils/errors";
import StatusCodes from "http-status-codes";
import { errors } from "../../constants/index";
import mongoose from "mongoose";
import moment from "moment-timezone";
import customerModel from "@models/customer";
import notificationModel from "@models/notification";
const _ = require('lodash');

function update_notification_status(query: any, userId: string, headers: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg: any = errors.en;
        if (headers.language == 'ar') {
            var err_msg: any = errors.ar;
        }
        try {
            const { isAllow_Notification } = query
            await customerModel.updateOne({ _id: userId }, { isAllow_Notification: isAllow_Notification })
            resolve({ success: true })
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}

function notification_status(userId: string, headers: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg: any = errors.en;
        if (headers.language == 'ar') {
            var err_msg: any = errors.ar;
        }
        try {
            const data = await customerModel.findOne({ _id: userId }, { isAllow_Notification: 1 })
            resolve(data)
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}

function notification_list(query: any, userId: string, headers: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg: any = errors.en;
        if (headers.language == 'ar') {
            var err_msg: any = errors.ar;
        }
        try {
            const { phoneNumber,countryCode} = query
            const [data,data1,data2] = await Promise.all([ notificationModel.find({phoneNumber: phoneNumber,countryCode:countryCode ,sendTo:"User"}), notificationModel.find({sendBy: 'Bulk'}),notificationModel.find({phoneNumber: phoneNumber,countryCode:countryCode ,sendTo:"Both"})])
            var merge:any = [...data,...data1,...data2]
            resolve({ items:merge.sort((first:any,second:any)=>second.createdAt - first.createdAt), count:merge.length })
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}



export default {
    update_notification_status,
    notification_status,
    notification_list
}

// const data = await notificationModel.aggregate([
            //     {
            //         "$facet": {
            //             "notification": [
            //                 { $match: { phoneNumber: phoneNumber, sendTo: "User" } }
            //             ],
            //             "notification1": [
            //                 { $match: { sendBy: 'Bulk', sendTo: "User" } }
            //             ]
            //         }
            //     }
            // ]);