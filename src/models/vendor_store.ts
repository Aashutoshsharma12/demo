import mongoose from 'mongoose';
import { Schema, model } from 'mongoose';
// import { identityGenerator } from "@ut";
const _ = require('underscore');

interface vendorStore {
    userId: mongoose.Schema.Types.ObjectId;
    storeTypeId: any;
    store_openClosing_time:boolean;
    phoneNoCountryCode: string;
    country:string;
    image:string,
    phoneNumber:string;
    branchId:string;
    main_branchName:string;
    branchName:string;
    ar_main_branchName:string;
    ar_branchName:string;
    email:string;
    streetAddress: string;
    notes: string;
    fullAddress: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    zipCode?: string;
    countryCode: string;
    googlePlaceId: string;
    items_count:Number;
    rating:Number;
    online_status:boolean;
    cuisineeId:any;
    hightItemAmount:Number;
    lowItemAmount:Number;
    categoryId:any,
    vegType:any
    lat: string;
    lng: string;
    isActive: boolean;
    isDelete: boolean;
}

const schema = new Schema<vendorStore>({
    userId:{type:mongoose.Schema.Types.ObjectId,ref:"Vendor"},
    storeTypeId: { type:mongoose.Schema.Types.ObjectId,ref:"storeType" },
    streetAddress: { type: String, default:"" },
    notes: { type: String},
    store_openClosing_time:{type:Boolean,default:false},
    branchId:{type:String},
    image:{type:String,default:""},
    main_branchName: { type: String},
    ar_main_branchName: { type: String},
    email:{type:String},
    phoneNoCountryCode:{type:String},
    phoneNumber: { type: String},
    branchName: { type: String},
    ar_branchName: { type: String},
    fullAddress: { type: String, required: true },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String},
    city: { type: String, required: true },
    state: { type: String, required: true },
    country:{type:String},
    countryCode: { type: String },
    zipCode: { type: String, required: true },
    googlePlaceId: {type:String},
    rating:{type:Number,default:5},
    online_status:{type:Boolean,default:false},
    cuisineeId:[{ type:mongoose.Schema.Types.ObjectId,ref:"cusineCategory" }],
    hightItemAmount:{type:Number,default:0},
    lowItemAmount:{type:Number,default:0},
    categoryId:[{ type:mongoose.Schema.Types.ObjectId,ref:"itemCategory" }],
    vegType:[{ type:mongoose.Schema.Types.ObjectId,ref:"foodCategory" }],
    lat:Number,
    lng: Number,
    items_count:{type:Number,default:0},
    isActive: { type: Boolean, default: true },
    isDelete: { type: Boolean, default: false },
}, {
    timestamps: true,
    versionKey: false
});

const vendorStoreModel = model<vendorStore>('vendorStore', schema);
export = vendorStoreModel
