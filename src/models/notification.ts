import { date } from 'joi';
import { Schema, model } from 'mongoose';

interface Notification {
    title: string;
    ar_title: string;
    phoneNumber: string;
    countryCode:string;
    description: string;
    ar_description: string;
    image: string;
    notification_dateTime: string;
    notificationTime: string;
    notificationDate: String;
    sendFrom: string;
    sendBy:string;
    sendTo: string;
    isActive: boolean;
    isDelete: boolean;

}

const schema = new Schema<Notification>({
    title: { type: String, required:true },
    ar_title: { type: String},
    phoneNumber: { type: String },
    countryCode:{type:String},
    description: { type: String, required:true },
    ar_description: { type: String},
    image: { type: String },
    sendBy:{type:String},
    notificationTime: { type: String },
    notification_dateTime: { type: String },
    notificationDate: { type: String },
    sendFrom: { type: String,default:"Admin" },
    sendTo: { type: String },
    isActive: { type: Boolean, default: true },
    isDelete: { type: Boolean, default: false },

}, {
    timestamps: true,
    versionKey: false
});

const notificationModel = model<Notification>('notifications', schema);
export = notificationModel;