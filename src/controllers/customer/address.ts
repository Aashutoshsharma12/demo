import customerModel from '../../models/customer';
import { CustomError } from '../../utils/errors';
import StatusCodes from 'http-status-codes';
import { errors } from '../../constants/index';
import addressModel from '../../models/address';
import vendorStoreModel from '../../models/vendor_store';
const _ = require('lodash');

// AddAddress
var updateAddress = async(userId:any,address:any) =>{
    const checkAddress = await addressModel.findOne({ userId: userId, isDelete: false });
    if (checkAddress) {
        await addressModel.updateOne({ userId: userId, isDelete: false }, address);
    } else {
        await addressModel.create(address);
    }
}
function addAddress(body: any, userId: string, headers: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg: any = errors.en;
        if (headers.language == 'ar') {
            var err_msg: any = errors.ar;
        }
        try {
            const { lat, lng } = body;
            const near: any = process.env.approx_distance
            var nearby: any = near * 0.621371
            const address = {
                ...body,
                userId
            }
            const check_restaurant = await vendorStoreModel.aggregate([
                {
                    $addFields: {
                        location: ['$lng', '$lat']
                    }
                },
                {
                    $match: {
                        location: {
                            $geoWithin:
                            {
                                $centerSphere: [[Number(lng), Number(lat)], Number(nearby) / 3963.2]
                            }
                        }
                    }
                }
            ])
            if (check_restaurant && check_restaurant.length) {
                updateAddress(userId,address)
                resolve({ vendor: true })
            } else {
                resolve({ vendor: false });
            }
            // const availableAddress = await vendorStoreModel.find({ isDelete: false });
            // console.log(availableAddress,"l;lavailableAddress")
            // if (availableAddress && availableAddress.length) {
            //     let i;
            //     const unit: any = "K";
            //     const array: any = [];
            //     const lat1 = lat;
            //     const lon1 = lng;
            //     var nearby:any = process.env.approx_distance
            //     for (i = 0; i < availableAddress.length; i++) {
            //         var lat2: any = availableAddress[i].lat;
            //         var lon2: any = availableAddress[i].lng;
            //         var lat2: any = availableAddress[i].lat;
            //         var lon2: any = availableAddress[i].lng;
            //         var radlat1 = Math.PI * lat1 / 180;
            //         var radlat2 = Math.PI * lat2 / 180;
            //         var theta = lon1 - lon2;
            //         var radtheta = Math.PI * theta / 180;
            //         var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
            //         if (dist > 1) {
            //             dist = 1;
            //         }
            //         dist = Math.acos(dist);
            //         dist = dist * 180 / Math.PI;
            //         dist = dist * 60 * 1.1515;
            //         if (unit == "K") { dist = dist * 1.609344 }
            //         if (unit == "N") { dist = dist * 0.8684 }
            //         console.log(availableAddress,"l;lavailableAddress",dist,"dist")

            //         if (dist <= nearby || dist == NaN) {
            //             array.push(availableAddress[i]);
            //         }
            //     }
            //     if (array && array.length && array.length != 0) {
            //         const checkAddress = await addressModel.findOne({ userId: userId, isDelete: false });
            //         if (checkAddress) {
            //             await addressModel.updateOne({ userId: userId, isDelete: false }, address);
            //             resolve({ vendor: true });
            //         }else{
            //             await addressModel.create(address);
            //             resolve({ vendor: true });
            //         }
            //     } else {
            //         resolve({ vendor: false });
            //     }
            // } else {
            //     resolve({ vendor: false });
            // }
        } catch (err) {
            console.log(err);
            if (err.code == 11000) {
                reject(new CustomError(err_msg.addressExist, StatusCodes.BAD_REQUEST));
            }
            reject(err);
        }
    });
}


function getAddress(userId: any, headers: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg: any = errors.en;
        if (headers.language == 'ar') {
            var err_msg: any = errors.ar;
        }
        try {
            const address = await addressModel.findOne({ userId: userId, isDelete: false });
            if (address) {
                resolve(address);
            } else {
                resolve(address);
            }
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}



export default {
    addAddress,
    getAddress
} as const;