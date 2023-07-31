import moment from "moment-timezone";
import paymentModel from "@models/payment";
import customerOrderModel from "../../models/customer_order";

//save payment status
function save_paymentstatus(userId: any, data: any, headers: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { orderId } = data
            const checkorder: any = await customerOrderModel.findOne({ _id: orderId })
            const count: any = await paymentModel.count({})
            const obj = {
                ...data,
                userId,
                merchantId: checkorder.orderId + "" + count,
                dateAndTime: moment().tz(headers.timezone).format('YYYY-MM-DD HH:mm'),
                date: moment().tz(headers.timezone).format('YYYY-MM-DD'),
                time: moment().tz(headers.timezone).format('HH:mm'),
                mode: 'Case',
                status: 'Received'
            }
            const save = await paymentModel.create(obj);
            resolve(save)
        } catch (err) {
            reject(err)
        }
    })
}
// const Moment = require('moment');
// const MomentRange = require('moment-range');
// const moment = MomentRange.extendMoment(Moment);

// const config = require('../../config/stripe');
// const stripe = require('stripe')(config.secretKey);


// function payment(body:any):Promise<any>{
// return new Promise(async(resolve:any , reject:any) =>{
//     const {card} = body
//     console.log("eneter",card)
//         const token:any = await createToken(card);
//         if (token.error) {
//             console.log(token,"ll")
//             reject('danger', token.error)
//             return resolve.redirect('/');
//         }
//         if (!token.id) {
//             reject('danger', 'Payment failed.');
//             return resolve.redirect('/');
//         }
    
//         const charge:any = await createCharge(token.id, 2000);
//         if (charge && charge.status == 'succeeded') { 
//             reject('success', 'Payment completed.');
//         } else {
//             reject('danger', 'Payment failed.');
//         }
//         return resolve.redirect('/');
    
// })
// } 

// const createToken = async (cardData:any) => {
//     let token:any = {};
//     try {
//         token = await stripe.tokens.create({
//             card: {
//                 number: cardData.number,
//                 exp_month: cardData.exp_month,
//                 exp_year: cardData.exp_year,
//                 cvc: cardData.cvv
//             }
//         });
//     } catch (error) {
//         switch (error.type) {
//             case 'StripeCardError':
//                 token.error = error.message;
//                 break;
//             default:
//                 token.error = error.message;
//                 break;
//         }
//     }
//     return token;
// }

// const createCharge = async (tokenId:any, amount:any) => {
//     let charge:any = {};
//     try {
//         charge = await stripe.charges.create({
//             amount: amount,
//             currency: 'usd',
//             source: tokenId,
//             description: 'My first payment'
//         });
//     } catch (error) {
//         charge.error = error.message;
//     }
//     return charge;
// }

export default {
    save_paymentstatus
    // payment
} as const