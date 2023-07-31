import mongoose from 'mongoose';
import { Schema, model } from 'mongoose';
// import { identityGenerator } from "@ut";
const _ = require('underscore');

interface vendor_menueItems {
    userId: any;
    storeId:any;
    storeTypeId: any;
    foodCategoryId: any;
    itemCategoryId: any;
    cuisineCategoryId: any;
    itemName: string;
    lower_itemName: string;
    ar_itemName: string;
    amount:number;
    size_amount:number;
    amountIn:string;
    recommended:boolean,
    preparationTime: string;
    timeIn:string;
    description: string;
    ar_description: string;
    image: string;
    storeType_status:boolean;
    cuisineCategory_status:boolean; //cuisine status
    status:boolean; // item category status
    addons:boolean;
    item_size:boolean;
    isActive: boolean;
    isDelete: boolean;
}

const schema = new Schema<vendor_menueItems>({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'vendors' },
    storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'vendorStore'},
    storeTypeId: { type: mongoose.Schema.Types.ObjectId, ref: 'storeType' },
    foodCategoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'foodCategory' },
    itemCategoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'itemCategory' },
    cuisineCategoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'cusineCategory'},
    itemName: { type: String, required: true },
    lower_itemName:{type:String},
    ar_itemName: { type: String},
    amount:{type:Number,required:true},
    size_amount:{type:Number,default:0},
    amountIn:{type:String,default:"SAR"},
    recommended:{type:Boolean,default:false},
    preparationTime: { type: String, required: true },
    timeIn:{type:String,default:"Minutes"},
    description: { type: String },
    ar_description: { type: String },
    image: { type: String, required: true,default:'' },
    storeType_status:{type:Boolean,default:true},
    cuisineCategory_status:{type:Boolean,default:true},
    status:{type:Boolean,default:true},
    addons:{type:Boolean,default:false},
    item_size:{type:Boolean,default:false},
    isActive: { type: Boolean, default: true },
    isDelete: { type: Boolean, default: false },
}, {
    timestamps: true,
    versionKey: false
});

const vendor_menueItemsModel = model<vendor_menueItems>('vendor_menueItems', schema);
export = vendor_menueItemsModel

