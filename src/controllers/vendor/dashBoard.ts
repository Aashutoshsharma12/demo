import { addonsModel, customerOrderModel, offerModel, vendorModel, vendorStoreModel, vendor_menueItemsModel } from '../../models/index';
import { CustomError } from '../../utils/errors';
import StatusCodes from 'http-status-codes';
import { errors } from '../../constants/index';
import mongoose from "mongoose";
import addons_type from './addons_type';
import vendor_store from './vendor_store';
const _ = require('lodash');
const { ObjectId } = require('mongodb')

// DashBoard Api
function dashBoardApi(query: any, userId: any, headers: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg: any = errors.en;
        if (headers.language == 'ar') {
            var err_msg: any = errors.ar;
        }
        try {
            const { storeId } = query;
            if (!storeId) {
                reject(new CustomError(err_msg.requiredStore, StatusCodes.BAD_REQUEST));
            }
            const [menuItemsCount, offerCount, totalOrders, cancelledOrders, liveOrders,details,totalEarning] = await Promise.all([vendor_menueItemsModel.countDocuments({ userId: userId, storeId: storeId, isDelete: false }), offerModel.countDocuments({ storeId: storeId, isDelete: false }), customerOrderModel.countDocuments({ vendorId: userId, storeId: storeId, status: { $in: ['Pending', 'Accepted', 'Completed', 'Cancelled'] } }), customerOrderModel.countDocuments({ vendorId: userId, storeId: storeId, status: 'Cancelled' }), customerOrderModel.countDocuments({ vendorId: userId, storeId: storeId, status: { $in: ['Pending', 'Accepted'] } }), vendorStoreModel.findOne({ userId: userId, _id: storeId }, { image: 1, branchId: 1, branchName: 1, ar_branchName: 1, main_branchName: 1, fullAddress: 1, streetAdress: 1, online_status: 1 }),customerOrderModel.aggregate([
                { $match: { status: 'Completed', storeId: ObjectId(storeId) } },
                {
                    $group: {
                        _id: null,
                        totalSum: { $sum: '$totalAmount' },
                        count: { $sum: 1 }
                    }
                }
            ])])
            if (totalEarning && totalEarning.length) {
                var totalEarningAmount: any = totalEarning[0].totalSum
                var completedOrder: any = totalEarning[0].count
            } else {
                var totalEarningAmount: any = 0
                var completedOrder: any = 0
            }
            if (details) {
                resolve({
                    image: details.image,
                    branchId: details.branchId,
                    main_branchName: details.branchName,
                    ar_branchName: details.ar_branchName,
                    fullAddress: details.fullAddress,
                    streetAdress: details.streetAddress,
                    online_status: details.online_status,
                    totalEarning: totalEarningAmount,
                    totalOrder: totalOrders,
                    completedOrder: completedOrder,
                    cancelledOrder: cancelledOrders,
                    liveOrderCOunt: liveOrders,
                    menuItem_count: menuItemsCount,
                    offerCount: offerCount,
                });
            } else {
                reject(new CustomError(err_msg.noDatafound, StatusCodes.BAD_REQUEST));
            }
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}

//online offline store
function online_offlineStore(query: any, userId: any, headers: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg: any = errors.en;
        if (headers.language == 'ar') {
            var err_msg: any = errors.ar;
        }
        try {
            const update = await vendorStoreModel.updateOne({ _id: query.storeId, userId: userId }, { online_status: query.online_status })
            resolve({ success: true })
        } catch (err) {
            reject(err)
        }
    })

}

export default {
    dashBoardApi,
    online_offlineStore
} as const;

/** aggregation facet */
 // const count = await customerOrderModel.aggregate([
            //     {
            //         "$facet": {
            //             "totalOrders": [
            //                 { "$match": { vendorId: new mongoose.Types.ObjectId(userId), storeId: new mongoose.Types.ObjectId(storeId), status: { $in: ['Pending', 'Accepted', 'Completed', 'Cancelled'] } } },
            //                 { "$count": "totalOrders" },
            //             ],
            //             "cancelledOrders": [
            //                 { "$match": { vendorId: new mongoose.Types.ObjectId(userId), storeId: new mongoose.Types.ObjectId(storeId), status: 'Cancelled' } },
            //                 { "$count": "cancelledOrders" }
            //             ],
            //             "liveOrders": [
            //                 { "$match": { vendorId: new mongoose.Types.ObjectId(userId), storeId: new mongoose.Types.ObjectId(storeId), status: { $in: ['Pending', 'Accepted'] } } },
            //                 { "$count": "liveOrders" }
            //             ]
            //         }
            //     },
            // ])
            // if (count.length) {
            //     if (count[0].totalOrders.length) {
            //         var totalOrders: any = count[0].totalOrders[0].totalOrders
            //     } else {
            //         var totalOrders: any = 0
            //     }
            //     if (count[0].cancelledOrders.length) {
            //         var cancelledOrders: any = count[0].cancelledOrders[0].cancelledOrders
            //     } else {
            //         var cancelledOrders: any = 0
            //     }
            //     if (count[0].liveOrders.length) {
            //         var liveOrders: any = count[0].liveOrders[0].liveOrders
            //     } else {
            //         var liveOrders: any = 0
            //     }
            // }