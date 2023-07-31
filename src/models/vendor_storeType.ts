import mongoose, { Schema, model } from 'mongoose';
// import { identityGenerator } from "@ut";
const _ = require('underscore');

interface  VendorStoreType {
    userId:any; //VendorId
    storeTypeId: any;  
    isActive: boolean;
    isDelete: boolean;
}

const schema = new Schema<VendorStoreType>({
    storeTypeId: { type:mongoose.Schema.Types.ObjectId, ref:'storeType' },
    userId:{type:mongoose.Schema.Types.ObjectId,ref:'Vendor'},
    isActive: { type: Boolean, default: true },
    isDelete: { type: Boolean, default: false },
}, {
    timestamps: true,
    versionKey: false
});

const VendorStoreType = model<VendorStoreType>('VendorStoreType', schema);
export = VendorStoreType
