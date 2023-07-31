import mongoose from 'mongoose';
import { Schema, model } from 'mongoose';
// import { identityGenerator } from "@ut";
const _ = require('underscore');

interface favorite {
    vendorId:any;
    storeId:any;
    userId: any;
}

const schema = new Schema<favorite>({
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
    storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'vendorStore'},
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users'}
}, {
    timestamps: true,
    versionKey: false
});

const favoriteModel = model<favorite>('favorites', schema);
export = favoriteModel

