import { Schema, model } from 'mongoose';
// import { identityGenerator } from "@ut";
const _ = require('underscore');

interface StoreType {
    storeType: string; 
    ar_storeType:string;
    image:string,
    lower_name:string;
    isActive: boolean;
    isDelete: boolean;
}

const schema = new Schema<StoreType>({
    storeType: { type: String, required: true },
    ar_storeType:{type: String, required: true},
    image:{type:String},
    lower_name:{type:String},
    isActive: { type: Boolean, default: true },
    isDelete: { type: Boolean, default: false },
}, {
    timestamps: true,
    versionKey: false
});

const storeTypeModel = model<StoreType>('storeType', schema);
export = storeTypeModel
