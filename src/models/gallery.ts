import mongoose from 'mongoose';
import {Schema , model} from 'mongoose'


interface Gallery {
    userId:any;
    image:string;
    storeId:any;
    isActive:boolean;
    isDelete:boolean
}

const schema  = new Schema<Gallery>({
    userId:{type:mongoose.Schema.Types.ObjectId,ref:"Vendor"},
    storeId:{type:mongoose.Schema.Types.ObjectId,ref:"vendorStore"},
    image:{type:String},
    isActive:{type:Boolean,default:true},
    isDelete:{type:Boolean,default:false}
},{
    timestamps:true,
    versionKey:false
})

const galleryModel = model<Gallery>('vendor_gallery',schema);
export = galleryModel