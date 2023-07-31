import mongoose, { Schema, model } from 'mongoose';

interface cusineCategory {
    title: string;
    ar_title: string;
    image:string;
    storeTypeId:any;
    lower_title:string;
    isActive: boolean;
    isDelete: boolean;

}

const schema = new Schema<cusineCategory>({
    title: { type: String, required: true },
    ar_title: { type: String, required: true },
    storeTypeId:{type:mongoose.Schema.Types.ObjectId,ref:'storeType'},
    image:{type:String},
    lower_title: { type: String},
    isActive: { type: Boolean, default: true },
    isDelete: { type: Boolean, default: false },
},
    {
        timestamps: true,
        versionKey: false
    });

const cusineCategoryModel = model<cusineCategory>('cusineCategory', schema);
export = cusineCategoryModel