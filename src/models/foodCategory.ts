import { Schema, model } from 'mongoose';

interface foodCategory {
    title: string;
    lower_title:string;
    ar_title: string;
    isActive: boolean;
    isDelete: boolean;

}

const schema = new Schema<foodCategory>({
    title: { type: String, required: true },
    lower_title: { type: String},
    ar_title: { type: String },
    isActive: { type: Boolean, default: true },
    isDelete: { type: Boolean, default: false },
},
    {
        timestamps: true,
        versionKey: false
    });

const foodCategoryModel = model<foodCategory>('foodCategory', schema);
export = foodCategoryModel