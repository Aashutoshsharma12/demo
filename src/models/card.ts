import { Schema, model } from 'mongoose';
const _ = require('underscore');

interface cards {
    merchantId: String;
    userId: String;
    name: String;
    card_number: String;
    card_number2: String;
    exp_month: String;
    exp_year: String;
    card_type: String;
    brand: String;
    payment_type: String;
    isDefault:Boolean;
    bank_name:String;
    country: String;
    token: String;
    status: Boolean;
    isDelete:Boolean;
}

const schema = new Schema<cards>({
    merchantId: {type:String},
    userId: {type:String},
    name: {type:String},
    card_number: {type:String},
    card_number2: {type:String},
    exp_month: {type:String},
    exp_year: {type:String},
    card_type: {type:String},
    brand: {type:String},
    payment_type: {type:String},
    isDefault:{type:Boolean,default:true},
    bank_name:{type:String},
    country: {type:String},
    token: {type:String},
    status: {type:Boolean},
    isDelete:{type:Boolean}
}, {
    timestamps: true,
    versionKey: false
});

const cardModel = model<cards>('cards', schema);
export = cardModel;