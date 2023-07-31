import { Schema, model } from 'mongoose';
const _ = require('underscore');

interface Admin {
  name: string;
  email: string;
  ID:string;
  phoneNumber: string;
  countryCode: string;
  password: string;
  confirmPassword: string;
  permission: string;
  login_dateTime:string;
  login_time:string;
  login_date:string;
  tax:number;
  token: string;
  role: string;  //Admin sub_Admin
  isActive: boolean;
  isDelete: boolean;
}

const schema = new Schema<Admin>({
  name: { type: String },
  email: { type: String },
  password: { type: String },
  ID:{type:String},
  confirmPassword: { type: String },
  phoneNumber: { type: String, required: true },
  countryCode: { type: String, required: true, default: '+91' },
  permission: [{ type: String }],
  login_dateTime:{ type: String,default:'' },
  login_date:{ type: String ,default:''},
  login_time:{ type: String ,default:''},
  tax:{type:Number},
  token: { type: String, default: "" },
  isActive: { type: Boolean, default: true },
  isDelete: { type: Boolean, default: false },
  role: { type: String, default: "Admin", required: true }
}, {
  timestamps: true,
  versionKey: false
});

const adminModel = model<Admin>('admin', schema);
export = adminModel
