import { Schema, model } from 'mongoose';

interface Faq {
    question: string;
    answer:string;
    ar_question: string;
    ar_answer:string;
    role:string;
    isActive: boolean;
    isDelete: boolean;

}

const schema = new Schema<Faq>({
    question: { type: String, required: true },
    answer: { type: String},
    ar_question: { type: String},
    ar_answer: { type: String},
    role:{type:String},       //Vendor Customer
    isActive: { type: Boolean, default: true },
    isDelete: { type: Boolean, default: false },
},
    {
        timestamps: true,
        versionKey: false
    });

const faqModel = model<Faq>('Faq', schema);
export = faqModel