import { Schema, model } from 'mongoose';
const _ = require('underscore');

interface banks {
    account_holder_name: String;
    userId: String;
    bank_name: String;
    bank_address: String;
    account_number: String;
    iban_number: String;
    isDefault:Boolean;
    status: Boolean;
    isDelete:Boolean;
}

const schema = new Schema<banks>({
    account_holder_name: {type:String},
    userId: {type:String},
    bank_name: {type:String},
    bank_address: {type:String},
    account_number: {type:String},
    iban_number: {type:String},
    isDefault:{type:Boolean},
    status: {type:Boolean},
    isDelete:{type:Boolean}
}, {
    timestamps: true,
    versionKey: false
});

const bankModel = model<banks>('banks', schema);
export = bankModel;