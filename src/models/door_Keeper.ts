import mongoose from 'mongoose';
import { Schema, model } from 'mongoose';
const _ = require('underscore');

interface Door_Keeper {
    userId:any;
    name: string;
    phoneNumber: string;
    countryCode: string;
    role: string;
    image:string;
    password: string;
    isActive: boolean;
    isDelete: boolean;
}

const schema = new Schema<Door_Keeper>({
    userId:{type:mongoose.Schema.Types.ObjectId,ref:"Vendor"},
    name: { type: String },
    phoneNumber: { type: String, required: true },
    countryCode: { type: String, required: true, default: '+91' },
    role: { type: String, default: "DoorKeeper" },
    image:{type:String,default:''},
    password: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    isDelete: { type: Boolean, default: false },
}, {
    timestamps: true,
    versionKey: false
});

const doorKeeperModel = model<Door_Keeper>('door_keeper', schema);
export = doorKeeperModel
