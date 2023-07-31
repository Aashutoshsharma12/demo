import { AnyTxtRecord } from 'dns';
import { string } from 'joi';
import mongoose, { Schema, model } from 'mongoose';

interface Order {
    vendorId: any;
    orderId: string;
    storeId: any;
    userId: any;
    items: any;
    address: any;
    storeTypeId:any;
    totalItems: number;
    addons: any;
    status: string; //Add to cart,Pending,Cancelled,Accepted,Completed
    statusList: string;
    cancel_Reason: string;
    description: string;
    ar_description: string;
    order_dateTime: string;
    order_time: string;
    order_date: string;
    pickup_dateTime: string;
    pickup_time: string;
    pickup_date: string;
    parkingStatus: string;    //In,Out,pending
    inparkingDateTime: string;
    parkingNumber:string;
    outparkingDateTime: string;
    couponCode: string;
    couponCodeAmount: number;
    discount:number;
    subTotal: number;
    taxes_Charges: number;
    taxes_Charges_amount:number;
    totalAmount: number;
    paymentStatus: string;
    paid: string ;  //online cash
    rating:Number;
    qrCode:string;
    device_modelName:string;
}

const schema = new Schema<Order>({
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
    storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'vendorStore' },
    orderId: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    items: [{
        itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'vendor_menueItems' },
        perItemPrice: { type: Number },
        quantity: { type: Number },
        itemPrice:{type:Number},
        item_size: { type: mongoose.Schema.Types.ObjectId, ref: 'vendor_itemSize' },
        addons: [{
            addonsId: { type: mongoose.Schema.Types.ObjectId, ref: 'addons'},
            addonsTypeId: { type: mongoose.Schema.Types.ObjectId, ref: 'addons_type'},
            perAddonsPrice: { type: Number }
        }]
    }],
    address: {
        addressId: { type: mongoose.Schema.Types.ObjectId, ref: 'Address' },
        lat:{type:String},
        lng:{type:String},
        fullAddress:{type:String},
        city:{type:String},
        state:{type:String},
        zipCode:{type:String},
        addressLine1:{type:String}
    },
    storeTypeId:{ type: mongoose.Schema.Types.ObjectId, ref: 'storeType'},
    totalItems: { type: Number },
    status: { type: String, default: "Add to cart" },
    statusList: [{
        status: { type: String },
        dateAndTime: { type: String },
        time: { type: String }
    }],
    cancel_Reason: { type: String },
    description: { type: String },
    ar_description: { type: String },
    order_dateTime: { type: String, default: '' },
    order_time: { type: String, default: '' },
    order_date: { type: String, default: '' },
    pickup_dateTime:{ type: String, default: ''},
    pickup_time:{type: String, default: ''},
    pickup_date:{type: String, default: ''},
    parkingStatus: { type: String, default: "Pending" },
    inparkingDateTime: { type: String, default: '' },
    parkingNumber:{type:String},
    outparkingDateTime: { type: String, default: '' },
    couponCode: { type: String, default: '' },
    couponCodeAmount: { type: Number,default:0 },
    discount:{type: Number,default:0 },
    subTotal: { type: Number },
    taxes_Charges: { type: Number},
    taxes_Charges_amount:{type: Number},
    totalAmount: { type: Number },
    paymentStatus: { type: String, default: "Pending" },
    paid: { type: String, default: '' },
    rating:{type:Number,default:0},
    qrCode:{type:String,default:''},
    device_modelName:{type:String,default:''}
}, {
    timestamps: true,
    versionKey: false
})
const customerOrderModel = model<Order>('customerOrder', schema);
export = customerOrderModel