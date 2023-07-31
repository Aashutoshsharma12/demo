import customerModel from "@models/customer";
import customerOrderModel from "@models/customer_order";
import parkingModel from "@models/parking";
import moment from "moment-timezone";
var cron = require('node-cron');
// // var cron = require('node-schedule')
// export = async (eventEmitter: any) => {
cron.schedule('00 00 12 * * 0-6', async () => {
    var timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    console.log(";;;;;;;;;----------------", moment().format('YYYY-MM-DD'))
    const check = await customerOrderModel.find({ status: { $in: ['Pending'] }, pickup_date: { $lt: moment().tz(timezone).format('YYYY-MM-DD') } });
    if (check.length) {
        await Promise.all(check.map(async (list) => {
            const array = list.statusList;
            const obj1: any = {
                status: 'Rejected',
                dateAndTime: moment().tz(timezone).format('YYYY-MM-DD HH:mm'),
                time: moment().tz(timezone).format('HH:mm')
            }
            const array1 = [...array, { ...obj1 }];
            const obj = {
                status: 'Rejected',
                statusList: array1
            }
            await customerOrderModel.updateOne({ _id: list._id, pickup_date: { $lt: moment().tz(timezone).format('YYYY-MM-DD') } }, obj)
            // await parkingModel.updateOne({ title: parkingNumber }, { parkingSlot_booked: false });
        }))
    }
})
// }


