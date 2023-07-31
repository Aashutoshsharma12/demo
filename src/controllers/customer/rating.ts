import {vendorStoreModel,ratingModel,vendorModel,customerOrderModel } from '../../models/index';
import { CustomError } from '../../utils/errors';
import StatusCodes from 'http-status-codes';
import { errors } from '../../constants/index';
const { ObjectId } = require('mongodb');
const _ = require('lodash');

// Add Rating
function addRating(query: any, userId: any,headers:any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg:any = errors.en;
        if(headers.language == 'ar'){
            var err_msg:any = errors.ar;
        }
        try {
            var {orderId,vendorId,storeId,review,ar_review,rating} = query;
            var ratings = await ratingModel.findOne({'orderId':ObjectId(orderId),'userId':ObjectId(userId)});
            if(ratings){                
                reject(new CustomError(err_msg.alreadyExist, StatusCodes.BAD_REQUEST));
            }else{
                var obj = {
                    orderId:orderId,
                    vendorId:vendorId,
                    storeId:storeId,
                    review:review,
                    ar_review:ar_review,
                    rating:rating,
                    userId:userId
                }
                var ratingData = await new ratingModel(obj).save();
                await customerOrderModel.updateOne({'_id':ObjectId(orderId)},{$set:{'rating':rating}});
                var avgRatingData = 0;
                var avgRating = await ratingModel.aggregate(
                    [
                        {$match:{'storeId':ObjectId(storeId)}},
                      {
                        $group:
                          {
                            _id: null,
                            rating: { $avg: "$rating" }
                          }
                      },
                      
                    ]
                );
                if(avgRating && avgRating.length && avgRating[0].rating){
                    avgRatingData = avgRating[0].rating;
                }
                await vendorStoreModel.updateOne({'_id':ObjectId(storeId)},{$set:{'rating':avgRatingData}});
                resolve(ratingData);
            }
        }catch(error){
            console.log(error);
            reject(error);
        }
    });
}

// vendor rating list
function getVendorRating(query:any,userId: any,headers:any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg:any = errors.en;
        if(headers.language == 'ar'){
            var err_msg:any = errors.ar;
        }
        try {
            var {page=1,perPage=10}=query;
            var ratings = await ratingModel.find({'vendorId':ObjectId(userId)}).sort({createdAt:-1}).skip(perPage*(page-1)).limit(perPage);
            var count = await ratingModel.countDocuments({'vendorId':ObjectId(userId)});
            resolve({ratings,count});
        }catch(error){
            console.log(error);
            reject(error);
        }
    });
}

// Get rating based on user
function getOrderRating(query:any,userId: any,headers:any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg:any = errors.en;
        if(headers.language == 'ar'){
            var err_msg:any = errors.ar;
        }
        try {
            var {page = 1,perPage=10} = query;
            var ratings = await ratingModel.find({'userId':ObjectId(userId)}).sort({'createdAt':-1}).skip(perPage*(page-1)).limit(perPage);
            resolve(ratings);
        }catch(error){
            console.log(error);
            reject(error);
        }
    });
}

export default {
    addRating,
    getVendorRating,
    getOrderRating
} as const;