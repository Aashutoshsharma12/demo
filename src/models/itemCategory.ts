import mongoose from 'mongoose';
import { Schema, model } from 'mongoose';

interface itemCategory {
    storeTypeId:any,
    title: string;
    lower_title:string;
    vendorId:any;
    addBy:string;
    ar_title: string;
    image:string;
    isActive: boolean;
    isDelete: boolean;

}

const schema = new Schema<itemCategory>({
    storeTypeId:{type:mongoose.Schema.Types.ObjectId,ref:"storeType"},
    title: { type: String, required: true },
    lower_title: { type: String},
    vendorId:{type:mongoose.Schema.Types.ObjectId,ref:"Vendor"},
    addBy:{type:String,default:'Admin'},    //Admin,Vendor
    ar_title: { type: String, required: true },
    image:{type:String},
    isActive: { type: Boolean, default: true },
    isDelete: { type: Boolean, default: false },
},
    {
        timestamps: true,
        versionKey: false
    });

const itemCategoryModel = model<itemCategory>('itemCategory', schema);
export = itemCategoryModel