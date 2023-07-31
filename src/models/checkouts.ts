import { Schema, model } from 'mongoose';
const _ = require('underscore');

interface checkouts {
    userId: String;
    entityId:String;
    merchantTransactionId:String;
    amount: String;
    currency:String;
    paymentType:String;
    type:String;
    buildNumber:String;
    bookingId:String;
    ndc:String;
    id:String;
    status:boolean;
    isDelete: boolean;
}

const schema = new Schema<checkouts>({
    userId: {type:String},
    entityId:{type:String},
    merchantTransactionId:{type:String},
    amount: {type:String},
    currency:{type:String},
    paymentType:{type:String},
    type:{type:String},
    buildNumber:{type:String},
    bookingId:{type:String},
    ndc:{type:String},
    id:{type:String},
    status:{type:Boolean},
    isDelete: {type:Boolean}
}, {
    timestamps: true,
    versionKey: false
});

const checkoutModel = model<checkouts>('checkouts', schema);
export = checkoutModel