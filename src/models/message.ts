import { Schema, model } from 'mongoose';

interface Message {
    issueId:string;
    userId:string;
    sender:string;
    receiver:string;
    msg: string;
    ar_msg: string;
    msgType:string;
    date:string; 
    isActive: boolean;
    isDelete: boolean;

}

const schema = new Schema<Message>({
    issueId:{type:String},                     // vendorId , customerId
    userId:{type:String},                     // vendorId , customerId
    sender: { type: String,default:"Vendor"}, //Customer,Vendor
    receiver: { type: String,default:"Admin"},
    msg: { type: String},
    ar_msg: { type: String},
    msgType: { type: String,default:"text"},   //text,image
    date:{type:String},                        //message create date
    isActive: { type: Boolean, default: true },
    isDelete: { type: Boolean, default: false },
},
    {
        timestamps: true,
        versionKey: false
    });

const messageModel = model<Message>('message', schema);
export = messageModel