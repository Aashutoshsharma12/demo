import { string } from 'joi';
import mongoose, { Schema, model } from 'mongoose';

interface payment {
    paymentId: string;
    merchantId: string;
    orderId: any;
    userId: any;
    vendorId: any;
    customerName: string;
    dateAndTime: string;
    date: string;
    time: string;
    email: string;
    card: any;
    amount: number;
    mode: string;
    status: string;
}

const schema = new Schema<payment>({
    paymentId: { type: String },
    merchantId: { type: String },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "customerOrder" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "customer" },
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" },
    customerName: { type: String },
    card: {
        number: { type: Number },
        exp_month: { type: String },
        exp_year: { type: String },
        cvv: { type: String }
    },
    dateAndTime: { type: String },
    date: { type: String },
    time: { type: String },
    amount: { type: Number },
    email: { type: String },
    mode: { type: String },
    status: { type: String }
}, {
    timestamps: true,
    versionKey: false
});

const paymentModel = model<payment>('payment', schema);
export = paymentModel;