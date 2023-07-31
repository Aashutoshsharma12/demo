import mongoose from 'mongoose';
import { Schema, model } from 'mongoose';
// import { identityGenerator } from "@ut";
const _ = require('underscore');

interface Type {
    userId:any;
    storeId:any;
    title: string;
    lower_title:string;
    ar_title: string;
    isActive: boolean;
    isDelete: boolean;
}

const schema = new Schema<Type>({
    userId:{type:mongoose.Schema.Types.ObjectId,ref:"Vendor"},
    storeId:{type:mongoose.Schema.Types.ObjectId,ref:"vendorStore"},
    title: { type: String, required: true },
    lower_title: { type: String},
    ar_title: { type: String},
    isActive: { type: Boolean, default: true },
    isDelete: { type: Boolean, default: false },
}, {
    timestamps: true,
    versionKey: false
});

const addons_typeModel = model<Type>('addons_type', schema);
export = addons_typeModel