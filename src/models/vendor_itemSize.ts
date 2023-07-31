import mongoose from 'mongoose';
import { Schema, model } from 'mongoose';
// import { identityGenerator } from "@ut";
const _ = require('underscore');

interface ItemSize {
    userId: any;
    itemId: any;
    item_size: string;
    lower_item_Size: string;
    ar_item_size: string;
    amount:number;
    amountIn:string;
    isActive: boolean;
    isDelete: boolean;
}

const schema = new Schema<ItemSize>({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'vendors' },
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'vendor_menueItems' },
    item_size:{type:String,required:true},
    lower_item_Size:{type:String,required:true},
    ar_item_size:{type:String},
    amount:{type:Number,required:true},
    amountIn:{type:String,default:"SAR"},
    isActive: { type: Boolean, default: true },
    isDelete: { type: Boolean, default: false },
}, {
    timestamps: true,
    versionKey: false
});

const vendor_itemSizeModel = model<ItemSize>('vendor_itemSize', schema);
export = vendor_itemSizeModel

