import { Schema,model } from "mongoose";
import mongoose from "mongoose";

interface Timing {
    userId:any;
    storeId:any;
    Monday:string;
    Tuesday:string;
    Wednesday:string;
    Thursday:string;
    Friday:string;
    Saturday:string;
    Sunday:string
}

const schema = new Schema<Timing>({
    userId:{type:mongoose.Schema.Types.ObjectId,ref:'Vendor'},
    storeId:{type:mongoose.Schema.Types.ObjectId,ref:'vendorStore'},
    Monday:{
        openingTime:{type:String,default:''},
        closingTime:{type:String,default:''}
    },
    Tuesday:{
        openingTime:{type:String,default:''},
        closingTime:{type:String,default:''}
    },
    Wednesday:{
        openingTime:{type:String,default:''},
        closingTime:{type:String,default:''}
    },
    Thursday:{
        openingTime:{type:String,default:''},
        closingTime:{type:String,default:''}
    },
    Friday:{
        openingTime:{type:String,default:''},
        closingTime:{type:String,default:''}
    },
    Saturday:{
        openingTime:{type:String,default:''},
        closingTime:{type:String,default:''}
    },
    Sunday:{
        openingTime:{type:String,default:''},
        closingTime:{type:String,default:''}
    }
},{
    timestamps:true,
    versionKey:false
});
const timingModel = model<Timing>('vendorTiming',schema)
export = timingModel;