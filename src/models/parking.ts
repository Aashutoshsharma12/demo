import mongoose from 'mongoose';
import { Schema, model } from 'mongoose';
// import { identityGenerator } from "@ut";
const _ = require('underscore');

interface parking {
    addBy: string;
    title: string;
    parkingSlot_booked:boolean
    isActive: boolean;
    isDelete: boolean;
}

const schema = new Schema<parking>({
    addBy: { type: String, default: 'Admin' },
    parkingSlot_booked:{type:Boolean,default:false},
    title: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    isDelete: { type: Boolean, default: false },
}, {
    timestamps: true,
    versionKey: false
});

const parkingModel = model<parking>('parking', schema);
export = parkingModel