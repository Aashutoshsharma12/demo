import { Schema, model } from 'mongoose';
const _ = require('underscore');

interface admin_Taxes {
    tax: number;
    isActive: boolean;
    isDelete: boolean;
}

const schema = new Schema<admin_Taxes>({
    tax: { type: Number,required:true },
    isActive: { type: Boolean, default: true },
    isDelete: { type: Boolean, default: false },
}, {
    timestamps: true,
    versionKey: false
});

const tax_chargesModel = model<admin_Taxes>('admin_Taxes_charges', schema);
export = tax_chargesModel
