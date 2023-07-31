import mongoose from 'mongoose';
import { Schema, model } from 'mongoose';
import { identityGenerator } from "../utils/helpers";
const _ = require('underscore');

interface Address {
    role: string;
    addressLine1: string;
    addressLine2: string;
    ar_addressLine1: string;
    ar_addressLine2: string;
    city: string;
    state: string;
    ar_city: string;
    ar_state: string;
    zipCode: string;
    countryCode:string;
    fullAddress:string;
    userId: mongoose.Schema.Types.ObjectId,
    googlePlaceId: string;
    lat: string;
    lng: string;
    isActive: boolean;
    isDelete: boolean;
}

const schema = new Schema<Address>({  
    countryCode: { type: String, required: true },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String },
    ar_addressLine1: { type: String},
    ar_addressLine2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    ar_city: { type: String},
    ar_state: { type: String},
    zipCode: { type: String },
    googlePlaceId: { type: String },
    fullAddress:{type:String,required:true},
    lat: Number,
    lng: Number,
    userId:{type:mongoose.Schema.Types.ObjectId,required:true},
    isActive: { type: Boolean, default: true },
    isDelete: { type: Boolean, default: false },
    role: { type: String, default: "Customer", required: true },
}, {
    timestamps: true,
    versionKey: false
});

const addressModel = model<Address>('Address', schema);
export = addressModel;
