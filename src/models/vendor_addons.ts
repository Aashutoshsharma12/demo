import mongoose from 'mongoose';
import { Schema, model } from 'mongoose';
// import { identityGenerator } from "@ut";
const _ = require('underscore');

interface Addons {
    userId:any;
    itemId:any;
    addons_typeId:any;
    title: string;
    lower_title:string;
    ar_title: string;
    amount:string;
    amountIn:string; //currency Rupee,Dollar
    isActive: boolean;
    isDelete: boolean;
}

const schema = new Schema<Addons>({
    userId:{type:mongoose.Schema.Types.ObjectId,ref:"Vendor"},
    itemId:{type:mongoose.Schema.Types.ObjectId,ref:"vendor_menueItems"},
    addons_typeId:{type:mongoose.Schema.Types.ObjectId,ref:"addons_type"},
    title: { type: String, required: true },
    lower_title: { type: String},
    ar_title: { type: String},
    amount: { type: String, required: true },
    amountIn: { type: String,default:"SAR"}, //currency Rupee,Dollar
    isActive: { type: Boolean, default: true },
    isDelete: { type: Boolean, default: false },
}, {
    timestamps: true,
    versionKey: false
});

const addonsModel = model<Addons>('addons', schema);
export = addonsModel