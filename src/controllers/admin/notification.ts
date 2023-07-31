import { notificationModel, userSessionModel, customerModel, vendorModel } from "@models/index";
import { StatusCodes } from "http-status-codes";
import { CustomError } from "@utils/errors";
import { errors } from "@constants";
import { sendPushNotification } from '@utils/helpers';
import moment from "moment-timezone";

//Send Notification
function sendNotification(data: any, headers: any, file: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { title, ar_title, phoneNumber, countryCode, ar_description, description, sendBy, role } = data;
            var userDevice_token = []
            var vendorDevice_token = []
            var array = []
            if (file) {
                var image: any = file.path
            } else {
                var image: any = ""
            }
            if (sendBy == "Single") {
                if (phoneNumber && phoneNumber != '' && countryCode && countryCode != '') {
                    var user: any = await customerModel.findOne({ 'phoneNumber': phoneNumber, 'countryCode': countryCode, 'isActive': true });
                    var vendor: any = await vendorModel.findOne({ 'phoneNumber': phoneNumber, 'countryCode': countryCode, 'isActive': true });
                    if (user) {
                        if (vendor) {
                            const vendor_session: any = await userSessionModel.find({ 'userId': vendor._id, status: true }, { 'deviceToken': 1 });
                            const user_session: any = await userSessionModel.find({ 'userId': user._id, status: true }, { 'deviceToken': 1 });
                            if (user_session.length != 0) {
                                for (let i = 0; i < user_session.length; i++) {
                                    if (user_session[i].deviceToken && user_session[i].deviceToken != '')
                                        userDevice_token.push(user_session[i].deviceToken)
                                }
                            }
                            if (vendor_session.length != 0) {
                                for (let i1 = 0; i1 < vendor_session.length; i1++) {
                                    if (vendor_session[i1].deviceToken && vendor_session[i1].deviceToken != '')
                                        vendorDevice_token.push(vendor_session[i1].deviceToken)
                                }
                            }
                        } else {
                            const user_session: any = await userSessionModel.find({ 'userId': user._id, status: true }, { 'deviceToken': 1 });
                            if (user_session.length != 0) {
                                for (let i = 0; i < user_session.length; i++) {
                                    if (user_session[i].deviceToken && user_session[i].deviceToken != '')
                                        userDevice_token.push(user_session[i].deviceToken)
                                }
                            }
                        }
                    } else {
                        if (vendor) {
                            const vendor_session: any = await userSessionModel.find({ 'userId': vendor._id, status: true }, { 'deviceToken': 1 });
                            if (vendor_session.length != 0) {
                                for (let i = 0; i < vendor_session.length; i++) {
                                    if (vendor_session[i].deviceToken && vendor_session[i].deviceToken != '')
                                        vendorDevice_token.push(vendor_session[i].deviceToken)
                                }
                            }
                        } else {
                            reject(new CustomError(errors.en.phoneNumberNot, StatusCodes.BAD_REQUEST))
                        }
                    }
                    if (vendorDevice_token.length != 0 && userDevice_token.length != 0) {
                        var token: any = [...vendorDevice_token, ...userDevice_token]
                        var sendTo: any = "Both"
                    } else if (vendorDevice_token.length != 0) {
                        var token: any = vendorDevice_token
                        var sendTo: any = "Vendor"
                    } else {
                        var token: any = userDevice_token
                        var sendTo: any = "User"
                    }
                    if (token && token.length > 0) {
                        const data = {
                            'title': title,
                            'ar_title': ar_title,
                            'description': description,
                            'ar_description': ar_description,
                            'phoneNumber': phoneNumber,
                            "countryCode": countryCode,
                            'image': image,
                            'deviceToken': token,
                            'sendFrom': "Admin",
                            'type': 'by_admin'
                        }
                        sendPushNotification(data);
                    }
                    var saveObj = {
                        'title': title,
                        'ar_title': ar_title,
                        'description': description,
                        'ar_description': ar_description,
                        'phoneNumber': phoneNumber,
                        "countryCode": countryCode,
                        'image': image,
                        'sendFrom': "Admin",
                        "notification_dateTime": moment().tz(headers.timezone).format('DD/MM/YYYY,HH:mm'),
                        "notificationTime": moment().tz(headers.timezone).format('HH:mm'),
                        "notificationDate": moment().tz(headers.timezone).format('DD/MM/YYYY'),
                        'sendTo': sendTo,
                        "sendBy": sendBy
                    }
                    const create = await notificationModel.create(saveObj);
                    resolve({ success: true, response: create })

                } else {
                    reject(new CustomError(errors.en.requiredPhoneNo, StatusCodes.BAD_REQUEST))
                }
            }
            else if (sendBy == "Bulk") {
                if (!role) {
                    reject(new CustomError('Role required', StatusCodes.BAD_REQUEST))
                } else {
                    if (role == "Both") {
                        var obj: any = {
                            status: true,
                            role: { $in: ['Customer', 'Vendor'] }
                        }
                    } else {
                        var obj: any = {
                            status: true,
                            role: "Customer"
                        }
                    }
                    var deviceToken1 = await userSessionModel.count(obj);
                    var deviceToken = await userSessionModel.find(obj, { deviceToken: 1 });
                    if (deviceToken && deviceToken.length) {
                        for (let i = 0; i < deviceToken.length; i++) {
                            if (deviceToken[i].deviceToken && deviceToken[i].deviceToken != '') {
                                array.push(deviceToken[i].deviceToken)
                            }
                        }
                    }
                    var token: any = array
                    var sendTo: any = role
                    const data = {
                        'title': title,
                        'ar_title': ar_title,
                        'description': description,
                        'ar_description': ar_description,
                        'phoneNumber': phoneNumber,
                        'image': image,
                        'deviceToken': token,
                        'sendFrom': "Admin",
                        'type': 'by_admin'
                    }
                    sendPushNotification(data);

                    var saveObj1 = {
                        'title': title,
                        'ar_title': ar_title,
                        'description': description,
                        'ar_description': ar_description,
                        'phoneNumber': phoneNumber,
                        'image': image,
                        'sendFrom': "Admin",
                        "notification_dateTime": moment().tz(headers.timezone).format('DD/MM/YYYY,HH:mm'),
                        "notificationTime": moment().tz(headers.timezone).format('HH:mm'),
                        "notificationDate": moment().tz(headers.timezone).format('DD/MM/YYYY'),
                        'sendTo': sendTo,
                        "sendBy": sendBy

                    }
                    const create = await notificationModel.create(saveObj1);
                    resolve({ success: true, response: create })


                }
            } else {
                reject(new CustomError("SendBy can be only ['Single','Bulk]", StatusCodes.BAD_REQUEST))
            }
        } catch (error) {
            console.log(error);
            reject(error);
        }
    })
}

//Notification list
function adminNotificationList(query: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { page = 1, pageSize = 10, search, date, role } = query;
            let condition: any = {
                isDelete: false
            }
            if (search && search != '' && date && date != '' && role && role != '') {
                const date1 = moment(date, 'DD/MM/YYYY').add(1, "days").format('DD/MM/YYYY')
                condition = {
                    ...condition,
                    description: { $regex: search, $options: 'i' },
                    notificationDate: { $gte: date, $lt: date1 },
                    sendTo: role
                }
            } else if (search && search != '' && role && role != '') {
                condition = {
                    ...condition,
                    description: { $regex: search, $options: 'i' },
                    sendTo: role
                }
            } else if (search && search != '' && date && date != '') {
                const date1 = moment(date, 'DD/MM/YYYY').add(1, "days").format('DD/MM/YYYY')
                condition = {
                    ...condition,
                    description: { $regex: search, $options: 'i' },
                    notificationDate: { $gte: date, $lt: date1 },
                }
            }
            else if (date && date != '' && role && role != '') {
                const date1 = moment(date, 'DD/MM/YYYY').add(1, "days").format('DD/MM/YYYY')
                condition = {
                    ...condition,
                    notificationDate: { $gte: date, $lt: date1 },
                    sendTo: role
                }
            }
            else if (date && date != '') {
                const date1 = moment(date, 'DD/MM/YYYY').add(1, "days").format('DD/MM/YYYY')
                condition = {
                    ...condition,
                    notificationDate: { $gte: date, $lt: date1 },
                }
            }
            else if (search && search != '') {
                condition = {
                    ...condition,
                    description: { $regex: search, $options: 'i' },
                }
            } else if (role && role != '') {
                condition = {
                    ...condition,
                    sendTo: role
                }
            }
            else {
                condition = {
                    ...condition
                }
            }
            const response = await notificationModel.find(condition).skip((page * pageSize) - pageSize).limit(pageSize).sort({ "createdAt": -1 });
            const Total = await notificationModel.countDocuments(condition);
            if (!response) {
                reject(new CustomError(errors.en.noDatafound, StatusCodes.BAD_REQUEST))
            } else {
                resolve({ response, Total })
            }
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
}

export default {
    sendNotification,
    adminNotificationList
} as const;