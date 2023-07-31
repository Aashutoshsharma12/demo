import mongoose, { Schema, model } from 'mongoose';

interface report_issue {
    userId: any;
    description: string;
    ar_description: string;
    role:string;
    image:string;
    status:string;
    issueId:string;
    storeId:any;
    isActive: boolean;
    isDelete: boolean;
}

const schema = new Schema<report_issue>({
    userId:{type:String},
    description: { type: String, required: true },
    storeId:{type:mongoose.Schema.Types.ObjectId,ref:'vendorStore'},
    ar_description: { type: String},
    role: { type: String,default:"Customer"},
    image:{type:String,default:''},
    status:{type:String,default:"Pending"},
    issueId:{type:String},
    isActive: { type: Boolean, default: true },
    isDelete: { type: Boolean, default: false },
},
    {
        timestamps: true,
        versionKey: false
    });

const reportModel = model<report_issue>('report&Issue', schema);
export = reportModel