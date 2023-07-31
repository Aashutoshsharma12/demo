import mongoose from 'mongoose';
import { Schema, model } from 'mongoose';
const _ = require('underscore');

interface search {
    userId: mongoose.Schema.Types.ObjectId;
    storeTypeId:mongoose.Schema.Types.ObjectId;
    title: string;
    lower_title:string;
    ar_title: string;
    count:number
}

const schema = new Schema<search>({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" },
    storeTypeId: { type: mongoose.Schema.Types.ObjectId, ref: "storeType" },
    title: { type: String },
    lower_title:{type:String},
    ar_title: { type: String },
    count:{type:Number}
}, {
    timestamps: true,
    versionKey: false
});

const searchModel = model<search>('search', schema);
export = searchModel
