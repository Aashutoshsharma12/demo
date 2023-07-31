import { Schema, model } from 'mongoose';
const _ = require('underscore');

interface Customer {
  name: string;
  email: any;
  customerRCId:string;
  countryCode: string;
  phoneNumber: string;
  isAllow_Notification:boolean;
  image: string;
  stripeId:string;
  role: string;
  isActive: boolean;
  isDelete: boolean;
}

const schema = new Schema<Customer>({
  name: { type: String ,default:''},
  email: { type: Array },
  customerRCId:{type:String},
  stripeId:{type:String},
  countryCode: { type: String, required: true, default: '+91' },
  phoneNumber: { type: String, required: true },
  image: { type: String, default: '' },
  isAllow_Notification:{type:Boolean,default:true},
  role: { type: String, default: "Customer", required: true },
  isActive: { type: Boolean, default: true },
  isDelete: { type: Boolean, default: false },
}, {
  timestamps: true,
  versionKey: false
});

schema.index({ countryCode: 1, phoneNumber: 1, role: 1 }, { unique: true });
const customerModel = model<Customer>('Customer', schema);
export = customerModel
