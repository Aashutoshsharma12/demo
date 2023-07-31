import mongoose,{ Schema, model } from 'mongoose';

interface Rating {
    review: string;
    ar_review: string;
    rating:number;
    userId:any,
    vendorId:any,
    storeId:any,
    orderId:any
    isActive: boolean;
    isDelete: boolean;

}

const schema = new Schema<Rating>({
    review: { type: String},
    ar_review: { type: String},
    rating: { type: Number},
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
    storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'vendorStore' },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'customerOrder' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    isActive: { type: Boolean, default: true },
    isDelete: { type: Boolean, default: false },
},
    {
        timestamps: true,
        versionKey: false
    });

const ratingModel = model<Rating>('rating', schema);
export = ratingModel;