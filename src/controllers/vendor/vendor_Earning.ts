import { CustomError } from "@utils/errors";
import { errors } from "@constants";
import { StatusCodes } from "http-status-codes";
import customerOrderModel from "@models/customer_order";
import moment from "moment-timezone";
import { aggregate } from "@models/customer";

// Earning list
function totalEarningList(query: any, userId: any, header: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg: any = errors.en;
        if (header.language == 'ar') {
            var err_msg: any = errors.ar;
        }
        try {
            const { ObjectId } = require('mongodb');
            const { page = 1, perPage = 10, startDate, endDate, storeId } = query;
            const { timezone } = header
            if (startDate && startDate != '' && endDate && endDate != '') {
                var obj: any = {
                    vendorId: ObjectId(userId),
                    storeId: ObjectId(storeId),
                    status: "Completed",
                    order_date: { $gte: startDate, $lte: endDate }
                }
            } else {
                const startDate = moment().tz(timezone).startOf('week').format('YYYY-MM-DD');
                const endDate = moment(startDate).tz(timezone).add(1, 'week').format('YYYY-MM-DD');
                var obj: any = {
                    vendorId: ObjectId(userId),
                    storeId: ObjectId(storeId),
                    status: "Completed",
                    order_date: { $gt: startDate, $lte: endDate }
                }
            }
            if (!storeId) {
                reject(new CustomError(err_msg.requiredStore, StatusCodes.BAD_REQUEST));
            } else {
                const list: any = await customerOrderModel.find(obj, { userId: 1, vendorId: 1, storeId: 1, orderId: 1, pickup_date: 1, pickup_dateTime: 1, pickup_time: 1, totalAmount: 1, totalItems: 1, taxes_Charges_amount: 1, vendor_earning: { $subtract: ["$totalAmount", "$taxes_Charges_amount"] } }).populate({ path: "userId", select: 'name' }).skip((page * perPage) - perPage).limit(perPage);
                if (list && list.length) {
                    var totalAmounts: any = await customerOrderModel.aggregate([
                        {
                            $addFields: {
                                vendor_Amount: ["$totalAmount"]
                            }
                        },
                        { $match: obj },
                        {
                            $group: {
                                _id: null,
                                sum: {
                                    $sum: { $subtract: ["$totalAmount", "$taxes_Charges_amount"] }
                                },
                                count: { $sum: 1 }
                            }
                        },
                    ]);
                    var amount: any = totalAmounts[0].sum;
                    var count: any = totalAmounts[0].count;
                } else {
                    var amount: any = 0;
                    var count: any = 0;
                }
                resolve({ items: list, count1: count, total_amount: amount });
            }
        } catch (err) {
            console.log(err);
            reject(err);
        }
    })
}
export default {
    totalEarningList
} as const