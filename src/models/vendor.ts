// import mongoose from 'mongoose';
import { Schema, model } from 'mongoose';
import { identityGenerator } from "@utils/helpers";
const _ = require('underscore');

interface Vendor {
    ownerName: string;
    phoneNumber: string;
    countryCode: string;
    role: string;
    businessName: string;
    ar_businessName: string;
    password: string;
    status:string,
    acceptRejectTime:string,
    acceptRejectDate:string,
    acceptRejectDate_Time:string;
    acceptTerms_Condition:Boolean;
    isActive: boolean;
    items_count:Number;
    isDelete: boolean;
    isVerifyOtp:boolean;
    isAllowNotification: boolean;
}

const schema = new Schema<Vendor>({
    ownerName: { type: String },
    phoneNumber: { type: String, required: true },
    countryCode: { type: String, required: true, default: '+91' },
    role: { type: String, default: "Vendor", required: true },
    status: { type: String, default: "Pending"}, //Pending Accepted Rejected By Admin
    businessName: { type: String, required: true },
    acceptRejectTime:{type:String},
    acceptRejectDate:{type:String},
    acceptRejectDate_Time:{type:String},
    ar_businessName: { type: String},
    password: { type: String },
    acceptTerms_Condition:{type: Boolean,default:true},
    isVerifyOtp:{type: Boolean,default:true},
    isActive: { type: Boolean, default: true },
    items_count:{
        type:Number,default:0
    },
    isDelete: { type: Boolean, default: false },
    isAllowNotification: { type: Boolean, default: true }
}, {
    timestamps: true,
    versionKey: false
});

const vendorModel = model<Vendor>('Vendor', schema);
export = vendorModel
