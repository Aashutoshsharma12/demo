import { CustomError } from '../../utils/errors';
import StatusCodes from 'http-status-codes';
import { errors } from '../../constants/index';
import parkingModel from '@models/parking';
import { title } from 'process';
const _ = require('lodash');

// Add Parking
function add_parking(data: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { title } = data;
            var obj = {
                parkingSlot_booked:false,
                title:title,
                addBy:"Admin"
            }
            const add_parking = await parkingModel.create(obj);
            resolve(add_parking);
        
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}
// parking list
function parking_list(query: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const {page = 1,perPage = 500,search } = query;
            let cond:any = {
                isDelete:false
            }
            if(search){
                cond = {
                    ...cond,
                     title: { $regex: search, $options: 'i' } ,
                }
            }
            const [list,totalCount,totalParking,leftParking,bookedParking] = await Promise.all([parkingModel.find(cond).skip((page * perPage) - perPage).limit(perPage),parkingModel.count(cond),parkingModel.count({isDelete:false}),parkingModel.count({isDelete:false,parkingSlot_booked:false}),parkingModel.count({isDelete:false,parkingSlot_booked:true})])
            resolve({list,totalCount,totalParking,leftParking,bookedParking});
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}
export default {
    add_parking,
    parking_list
} as const;