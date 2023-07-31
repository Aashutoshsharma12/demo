import mongoose from 'mongoose';
import { Schema, model } from 'mongoose';
// import { identityGenerator } from "@ut";
const _ = require('underscore');

interface offers {
    userId: any;
    storeId: any;
    storeTypeId: any;
    addBy: string;
    image: string;
    title: string;
    description: string;
    offer_type: string;
    offer_amount: number;
    ar_title: string;
    ar_description: string;
    upto_Amount: Number,
    minimum_amount:Number,
    couponCode:string,
    startDate: any;
    expiryDate: any;
    isActive: boolean;
    isDelete: boolean;
}

const schema = new Schema<offers>({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'vendors' },
    storeId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'vendorStore' }],
    storeTypeId: { type: mongoose.Schema.Types.ObjectId, ref: 'storeType' },
    addBy: { type: String, default: 'Vendor' },
    image: { type: String, default: '' },
    couponCode: { type: String},
    title: { type: String, required: true },
    description: { type: String },
    offer_type: { type: String },
    offer_amount: { type: Number, required: true },
    startDate: { type: Date, required: true },
    ar_title: { type: String},
    ar_description: { type: String },
    minimum_amount:{type:Number,default: 0 },
    upto_Amount: { type: Number, default: 0 },
    expiryDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    isDelete: { type: Boolean, default: false },
}, {
    timestamps: true,
    versionKey: false
});

const offerModel = model<offers>('offers', schema);
export = offerModel