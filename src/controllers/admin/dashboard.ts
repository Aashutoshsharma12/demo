import { cusineCategoryModel, customerModel, customerOrderModel, itemCategoryModel, storeTypeModel, vendorModel, vendorStoreModel } from "@models/index";
import { any, array } from "joi";
import moment from "moment-timezone";
const { ObjectId } = require('mongodb')
const _ = require('lodash')
import { getDaysArray, getMonthsArray } from '@utils/helpers'
import { time } from "console";

//dashboard count Api
function dashboardApi(adminId: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const [total_Vendor, total_FoodShop, total_GroceryShop, total_MeatShop, total_StoreType, total_SubCategory, total_Orders, total_CancelledOrders, active_Customer, total_Customer,total_earning] = await Promise.all([vendorModel.count({ isDelete: false }), vendorStoreModel.count({ storeTypeId: "634407b7d43a01c935398589", isDelete: false }), vendorStoreModel.count({ storeTypeId: "63440848d43a01c93539858a", isDelete: false }), vendorStoreModel.count({ storeTypeId: "63440972d43a01c93539858e", isDelete: false }), storeTypeModel.count({ isDelete: false }), itemCategoryModel.count({ isDelete: false }), customerOrderModel.count({ status: { $in: ['Pending', 'Accepted', 'Completed', 'Cancelled'] } }), customerOrderModel.count({ status: 'Cancelled' }), customerModel.count({ isActive: true, isDelete: false }), customerModel.count({ isDelete: false }),customerOrderModel.aggregate([
                { $match: { status: 'Completed' } },
                {
                    $group: {
                        _id: '$status',
                        totalSum: { $sum: '$taxes_Charges_amount' }
                    }
                }
            ])])
            var obj = {
                total_Customer: total_Customer,
                active_Customer: active_Customer,
                inactive_Customer: (total_Customer - active_Customer),
                total_Vendor: total_Vendor,
                total_FoodShop: total_FoodShop,
                total_GroceryShop: total_GroceryShop,
                total_MeatShop: total_MeatShop,
                total_StoreType: total_StoreType,
                total_SubCategory: total_SubCategory,
                total_Orders: total_Orders,
                total_CancelledOrders: total_CancelledOrders
            }
            if (total_earning.length) {
                var earning: any = parseFloat(total_earning[0].totalSum).toFixed(2)
            } else {
                var earning: any = 0.00
            }
            resolve({ obj, total_Payment: earning })
        } catch (err) {
            reject(err)
        }
    })
}

//recent_acceptedVendor_list 
function recent_acceptedVendor_list(adminId: any, header: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { timezone } = header
            const obj = {
                status: 'Approved',
                acceptRejectDate: { $gte: moment().tz(timezone).format('DD/MM/YYYY'), $lt: moment().tz(timezone).add(1, 'days').format('DD/MM/YYYY') },
                acceptRejectTime: { $gte: moment().tz(timezone).subtract(3, 'hours').format('HH:mm'), $lte: moment().tz(timezone).format('HH:mm') },
            }
            var array: any = []
            var obj1: any = {}
            var vendorList: any = await vendorModel.find(obj, { ownerName: 1, businessName: 1, acceptRejectDate: 1, acceptRejectDate_Time: 1, acceptRejectTime: 1, status: 1 }).sort({ acceptRejectTime: -1 }).limit(5);
            if (vendorList && vendorList.length) {
                for (let i = 0; i < vendorList.length; i++) {
                    const vendorImage: any = await vendorStoreModel.findOne({ userId: vendorList[i]._id, main_branchName: vendorList[i].businessName }, { image: 1 })
                    obj1 = {
                        vendorDetails: vendorList[i],
                        image: vendorImage.image
                    }
                    array.push(obj1)
                }
            }
            resolve(array)
        } catch (err) {
            reject(err)
        }
    })
}
//latest Order


function latestOrderList(header: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { timezone } = header
            const obj = {
                status: { $in: ['Pending', 'Accepted', 'Completed', 'Cancelled'] },
                order_date: { $gte: moment().tz(timezone).format('YYYY-MM-DD'), $lt: moment().tz(timezone).add(1, 'days').format('YYYY-MM-DD') },
            }
            const list = await customerOrderModel.find(obj, { orderId: 1, order_date: 1, order_dateTime: 1, order_time: 1, totalAmount: 1, status: 1, paymentStatus: 1, userId: 1 }).populate({ path: 'userId', select: 'name' }).sort({ order_time: -1 }).limit(10)
            resolve({ items: list, totalCount: list.length })
        } catch (err) {
            reject(err)
        }
    })
}

//All Store Type Profit
function storeType_Profit(query: any, admin: any) {
    return new Promise(async (resolve, reject) => {
        try {
            var array1: any = []
            var array11: any = []
            var array12: any = []

            const { type } = query
            if (type == "today") {
                var startDate = moment().format('YYYY-MM-DD')
                var endDate = moment().format('YYYY-MM-DD')
                var previousstartDate = moment().subtract(1, "days").format('YYYY-MM-DD')
            } else if (type == "week") {
                var startDate = moment().startOf('week').format('YYYY-MM-DD')
                var endDate = moment().endOf('week').format('YYYY-MM-DD')
                var previousstartDate = moment().subtract(1, 'week').startOf('week').format('YYYY-MM-DD')
            } else if (type == "month") {
                var startDate = moment().startOf('month').format('YYYY-MM-DD')
                var endDate = moment().endOf('month').format('YYYY-MM-DD')
                var previousstartDate = moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD')
            } else if (type == "year") {
                var startDate = moment().startOf('year').format('YYYY-MM-DD')
                var endDate = moment().endOf('year').format('YYYY-MM-DD')
                var previousstartDate = moment().subtract(1, 'year').startOf('year').format('YYYY-MM-DD')
            } else {
                var startDate = moment().startOf('year').format('YYYY-MM-DD')
                var endDate = moment().endOf('year').format('YYYY-MM-DD')
                var previousstartDate = moment().subtract(1, 'year').startOf('year').format('YYYY-MM-DD')
            }
            var obj1 = {
                status: 'Completed',
                order_date: { $gte: startDate, $lte: endDate }
            }
            var obj2 = {
                status: 'Completed',
                order_date: { $gte: previousstartDate, $lt: startDate }
            }
            const list: any = await customerOrderModel.aggregate([
                { $match: obj1 },
                {
                    $group: {
                        _id: '$storeTypeId',
                        totalSum: { $sum: "$totalAmount" }
                    }
                },
            ]);
            const list1: any = await customerOrderModel.aggregate([
                { $match: obj2 },
                {
                    $group: {
                        _id: '$storeTypeId',
                        previoustotalSum: { $sum: "$totalAmount" }
                    }
                },
            ]);
            var merge = [...list, ...list1]
            let merged = _.uniqWith(merge, (pre: any, cur: any) => {
                if ((pre._id).toString() == (cur._id).toString()) {
                    cur.totalSum = cur.totalSum
                    cur.previoustotalSum = pre.previoustotalSum
                    return true;
                }
                return false;
            })
            if (merge && merge.length > 0) {
                // for (let i = 0; i < merged.length; i++) {
                //     const details = await storeTypeModel.find({ isDelete: false, _id: merged[i]._id }, { storeType: 1 })
                //     var obj3 = {
                //         storeTypeId: merged[i]._id,
                //         currentAmount: merged[i].totalSum ? merged[i].totalSum : 0,
                //         previousAmount: merged[i].previoustotalSum ? merged[i].previoustotalSum : 0,
                //         storeTypeDetails: details
                //     }
                //     array1.push(obj3)
                // }
                var a: any;
                var b: any;
                const details = await storeTypeModel.find({ isDelete: false }, { storeType: 1 });
                details.map((storeType: any) => {
                    b = {
                        storeTypeId: storeType._id,
                        currentAmount: 0,
                        previousAmount: 0,
                        storeTypeDetails: storeType
                    }
                    array12.push(b)
                    merged.map((Id: any) => {
                        if ((storeType._id).toString() === (Id._id).toString()) {
                            a = {
                                storeTypeId: Id._id,
                                currentAmount: Id.totalSum ? Id.totalSum : 0,
                                previousAmount: Id.previoustotalSum ? Id.previoustotalSum : 0,
                                storeTypeDetails: storeType
                            }
                            array11.push(a)
                        }
                    })
                })
                var ids = new Set(array11.map((c1: any) => (c1.storeTypeId).toString()));
                array1 = [...array11, ...array12.filter((c1: any) => !ids.has((c1.storeTypeId).toString()))];
            } else {
                const details = await storeTypeModel.find({ isDelete: false }, { storeType: 1 })
                details.map((de) => {
                    var obj12 = {
                        storeTypeId: de._id,
                        currentAmount: 0,
                        previousAmount: 0,
                        storeTypeDetails: de
                    }
                    array1.push(obj12)
                })
                // for (let i = 0; i < details.length; i++) {
                //     var obj12 = {
                //         storeTypeId: details[i]._id,
                //         currentAmount: 0,
                //         previousAmount: 0,
                //         storeTypeDetails: [details[i]]
                //     }
                //     array1.push(obj12)
                // }
            }
            resolve({ items: array1 })
        } catch (err) {
            reject(err)
        }
    })
}

function order_PlacedAmountGraphApi(query: any, adminId: any, header: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { type_data } = query
            const { timezone } = header
            var details: any;
            var d: any = [];
            var t: any;
            if (type_data && type_data != '' && type_data != undefined) {
                if (type_data == 'year') {
                    var date: any = moment().tz(timezone).endOf('year')
                    var date1: any = moment().tz(timezone).startOf('year')
                } else if (type_data == 'month') {
                    var date: any = moment().tz(timezone).endOf('month')
                    var date1: any = moment().tz(timezone).startOf('month')
                } else if (type_data == 'week') {
                    var date: any = moment().tz(timezone).endOf('week')
                    var date1: any = moment().tz(timezone).startOf('week')
                } else if (type_data == "today") {
                    var date: any = moment().tz(timezone)
                    var date1: any = moment().tz(timezone)
                }
            } else {
                var date: any = moment().tz(timezone).endOf('year')
                var date1: any = moment().tz(timezone).startOf('year')
            }

            if (type_data == "year") {
                details = await customerOrderModel.aggregate([{ $match: { $and: [{ 'updatedAt': { $gte: new Date(date1.year(), date1.month(), date1.date()), $lte: new Date(date.year(), date.month(), date.date()) } }, { status: 'Completed' }] } },
                {
                    $group:
                    {
                        _id:
                        {
                            month: { $month: "$updatedAt" }
                        },
                        totalSum: { $sum: '$totalAmount' },
                        date: { $first: "$updatedAt" }
                    }
                },
                {
                    $project:
                    {
                        date:
                        {
                            $dateToString: { format: `%Y-%m-%d`, date: `$date` }
                        },
                        totalSum: 1,
                        month: {
                            $dateToString: { format: `%m`, date: `$date` }
                        },
                        year: {
                            $dateToString: { format: `%Y`, date: `$date` }
                        },
                        _id: 0
                    }
                }
                ])
                var daylist: any = getMonthsArray(date1.format('YYYY-MM-DD'), date.format('YYYY-MM-DD'));
                var d = daylist.map((element: any) => {
                    if (details.find((it: any) => it.year == element.year && it.month == element.month)) {
                        return details.find((it: any) => it.year == element.year && it.month == element.month)
                    } else {
                        return {
                            date: (element.year + '-' + element.month + '-' + '01'),
                            totalSum: 0
                        }
                    }
                })
            } else
                if (type_data == 'today' || type_data == 'week' || type_data == 'month') {
                    details = await customerOrderModel.aggregate([{ $match: { $and: [{ 'updatedAt': { $gte: new Date(date1.year(), date1.month(), date1.date()), $lte: new Date(date.year(), date.month(), date.date()) } }, { status: 'Completed' }] } },
                    {
                        $group:
                        {
                            _id:
                            {
                                _id: { "$dayOfYear": "$updatedAt" }
                            },
                            totalSum: { $sum: '$totalAmount' },
                            date: { $first: "$updatedAt" }
                        }
                    },
                    {
                        $project:
                        {
                            date:
                            {
                                $dateToString: { format: `%Y-%m-%d`, date: `$date` }
                            },
                            totalSum: 1,
                            month: {
                                $dateToString: { format: `%m`, date: `$date` }
                            },
                            year: {
                                $dateToString: { format: `%Y`, date: `$date` }
                            },
                            _id: 0
                        }
                    }
                    ])
                    var daylist: any = getDaysArray(date1.format('YYYY-MM-DD'), date.format('YYYY-MM-DD'));
                    daylist = daylist.map((v: any) => v.toISOString().slice(0, 10))
                    var d = daylist.map((element: any) => {
                        if (details.find((it: any) => it.date == element)) {
                            return details.find((it: any) => it.date == element)
                        } else {
                            return {
                                date: element,
                                totalSum: 0
                            }
                        }
                    })
                } else {
                    details = await customerOrderModel.aggregate([{ $match: { $and: [{ 'updatedAt': { $gte: new Date(date1.year(), date1.month(), date1.date()), $lte: new Date(date.year(), date.month(), date.date()) } }, { status: 'Completed' }] } },
                    {
                        $group:
                        {
                            _id:
                            {
                                month: { $month: "$updatedAt" }
                            },
                            totalSum: { $sum: '$totalAmount' },
                            date: { $first: "$updatedAt" }
                        }
                    },
                    {
                        $project:
                        {
                            date:
                            {
                                $dateToString: { format: `%Y-%m-%d`, date: `$date` }
                            },
                            totalSum: 1,
                            month: {
                                $dateToString: { format: `%m`, date: `$date` }
                            },
                            year: {
                                $dateToString: { format: `%Y`, date: `$date` }
                            },
                            _id: 0
                        }
                    }
                    ])
                    var daylist: any = getMonthsArray(date1.tz(timezone).format('YYYY-MM-DD'), date.tz(timezone).format('YYYY-MM-DD'));
                    // details = daylist.map((element: any) => {
                    //     if (details.find((it: any) => it.year == element.year && it.month == element.month)) {
                    //         return details.find((it: any) => it.year == element.year && it.month == element.month)
                    //     } else {
                    //         console.log("enter")
                    //         return {
                    //             date: new Date(element.year, element.month, 1),
                    //             totalSum: 0
                    //         }
                    //     }
                    // })
                    if (details.length != 0) {
                        daylist.map((month: any) => {
                            details.map((months: any) => {
                                if (month.month == months.month && month.year == months.year) {
                                    t = { date: (month.year + '-' + month.month + '-' + '01'), totalSum: months.totalSum }
                                } else {
                                    t = { date: (month.year + '-' + month.month + '-' + '01'), totalSum: 0 }
                                }
                                d.push(t)
                            })
                        })
                    } else {
                        daylist.map((month: any) => {
                            t = { date: (month.year + '-' + month.month + '-' + '01'), totalSum: 0 }
                            d.push(t)
                        })
                    }
                }
            const item = d.map((li: any) => [li.date, li.totalSum])
            // const itemCount = details.map((li: any) => [li.count])
            resolve({ total: item })
        } catch (err) {
            reject(err)
        }
    })
}

export default {
    dashboardApi,
    recent_acceptedVendor_list,
    latestOrderList,
    storeType_Profit,
    order_PlacedAmountGraphApi
} as const