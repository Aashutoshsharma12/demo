import { CustomError } from '../../utils/errors';
import StatusCodes from 'http-status-codes';
import { errors } from '../../constants/index';
import parkingModel from '@models/parking';
import doorKeeperModel from '@models/door_Keeper';
import customerOrderModel from '@models/customer_order';
import moment from 'moment-timezone';
import mongoose from 'mongoose';
const _ = require('lodash');

// provide parking slot to customer
function provide_parking(data: any, doorKeeperId: any, headers: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg: any = errors.en;
        if (headers.language == 'ar') {
            var err_msg: any = errors.ar;
        }
        try {
            const { order_Id } = data;
            const checkDoorKeeper = await doorKeeperModel.findOne({ _id: doorKeeperId, isDelete: false, isActive: true }, { userId: 1 });
            if (!checkDoorKeeper) {
                reject(new CustomError(err_msg.noDatafound, StatusCodes.BAD_REQUEST))
            } else {
                const parking = await parkingModel.findOne({ isActive: true, isDelete: false, parkingSlot_booked: false }, { title: 1 });
                if (!parking) {
                    reject(new CustomError(err_msg.notParkingAvailable, StatusCodes.BAD_REQUEST))
                } else {
                    const check = await customerOrderModel.findOne({ _id: order_Id, vendorId: checkDoorKeeper.userId }, { parkingStatus: 1, status: 1, pickup_date: 1, pickup_time: 1, pickup_dateTime: 1 });
                    if (!check) {
                        reject(new CustomError(err_msg.noDatafound, StatusCodes.BAD_REQUEST))
                    } else if (check.status == "Pending") {
                        reject(new CustomError(err_msg.invalidQRcode, StatusCodes.BAD_REQUEST))
                    } else if (check.status == "Rejected") {
                        reject(new CustomError(err_msg.alreadyTaken.replace('{{order}}', check.status), StatusCodes.BAD_REQUEST))
                    } else if (check.status == "Cancelled") {
                        reject(new CustomError(err_msg.alreadyTaken.replace('{{order}}', check.status), StatusCodes.BAD_REQUEST))
                    } else if (check.status == "Completed") {
                        reject(new CustomError(err_msg.alreadyTaken.replace('{{order}}', check.status), StatusCodes.BAD_REQUEST))
                    } else if (check.parkingStatus == "In") {
                        reject(new CustomError(err_msg.alreadyParkingProvide, StatusCodes.BAD_REQUEST))
                    } else if (check.parkingStatus == "Out") {
                        reject(new CustomError(err_msg.actionAlreadyTaken, StatusCodes.BAD_REQUEST))
                    } else if (check.pickup_date > moment().tz(headers.timezone).format('YYYY-MM-DD') || check.pickup_date < moment().tz(headers.timezone).format('YYYY-MM-DD')) {
                        reject(new CustomError(err_msg.invalidQRcode, StatusCodes.BAD_REQUEST))
                    } else if ((moment.tz(check.pickup_dateTime, headers.timezone).subtract(15, 'minutes').format('HH:mm')) <= (moment().tz(headers.timezone).format('HH:mm')) && (moment().tz(headers.timezone).format('HH:mm')) <= (check.pickup_time)) {
                        const obj: any = {
                            parkingStatus: "In",
                            inparkingDateTime: moment().tz(headers.timezone).format('YYYY-MM-DD HH:mm'),
                            parkingNumber: parking.title
                        }
                        await Promise.all([parkingModel.updateOne({ isDelete: false, title: parking.title }, { parkingSlot_booked: true }),
                        customerOrderModel.updateOne({ _id: order_Id }, obj)])
                        const order_details = await customerOrderModel.find({ _id: (order_Id) }, { parkingNumber: 1, storeId: 1, userId: 1, items: 1, order_dateTime: 1, orderId: 1,pickup_date:1,pickup_dateTime:1,pickup_time:1 })
                            .populate([{ path: "storeId userId", select: 'branchName name' }, { path: 'items.itemId', select: 'itemName addons item_size foodCategoryId', populate: { path: 'foodCategoryId', select: 'title' } }
                                , { path: 'items.item_size', select: 'item_size amount' }, { path: 'items.addons.addonsId', select: 'title amount' }])
                        resolve(order_details)
                    }
                    else {
                        reject(new CustomError(err_msg.invalidQRcode, StatusCodes.BAD_REQUEST))
                    }
                } 
            }
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}

export default {
    provide_parking
} as const;