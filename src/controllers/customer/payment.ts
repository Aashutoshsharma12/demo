import { checkoutModel,cardModel,bankModel } from '@models/index';
import { CustomError } from '@utils/errors';
import StatusCodes from 'http-status-codes';
import { errors } from '@constants';
import bcrypt from 'bcrypt';
import { func } from 'joi';
const _ = require('lodash');
import https from 'https';
import querystring from 'querystring';
import randomstring from 'randomstring';
import moment from 'moment-timezone';
import { resolve } from 'path';
//import request from 'request-promise';

/** Get Details */
function CheckOut(dataObj : any,userId: any,headers:any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg:any = errors.en;
        if(headers.language == 'ar'){
            var err_msg:any = errors.ar;
        }
        try{
            var merchantId = randomstring.generate();
            var req_data = dataObj;
            console.log(req_data);
            var path = '/v1/checkouts';
            var obj:any = {
                //testMode:'EXTERNAL',
                entityId: req_data.entityId,
               // customParameters:true,
                merchantTransactionId: merchantId,
                //amount: 1,//req_data.amount,
                //currency: 'SAR',//req_data.currency,
                //paymentType: 'DB',
                "billing.street1": req_data.street1,
                "billing.city": req_data.city,
                "billing.state":req_data.state,
                "billing.country":'SA',
                "billing.postcode":req_data.postcode,
                "customer.givenName":req_data.givenName,
                "customer.surname":req_data.surname
            }

            

            if (req_data.regId) {
                var obj:any = {
                     'entityId': req_data.entityId,
                    'merchantTransactionId': merchantId,
                    // 'customParameters':true,
                    'registrations[0].id': req_data.regId,
                   // 'testMode':'EXTERNAL',
                     "billing.street1": req_data.street1,
                     "billing.city": req_data.city,
                     "billing.state":req_data.state,
                     "billing.country":'SA',
                     "billing.postcode":req_data.postcode,
                     "customer.givenName":req_data.givenName,
                    "customer.surname":req_data.surname
                }
                //obj['registrations[0].id'] = req_data.regId;
            }

            if(req_data.checkout_type == 'payment'){
                obj.amount = req_data.amount;
                obj.currency = req_data.currency;
                obj.paymentType = 'DB'
            }
            console.log(obj);
            var data = querystring.stringify(obj);
            var options = {
                port: 443,
                host: 'eu-test.oppwa.com',//'eu-prod.oppwa.com',
                path: path,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': data.length,
                    Authorization: 'Bearer OGFjN2E0Yzk4OGRhZDBjMDAxODhkZDYwYTVkNjAzODl8Z1lQdzdIQ3lFRQ=='
                },
            };
            var postRequest = https.request(options, function(res1) {
                res1.setEncoding('utf8');
                res1.on('data', async(chunk) => {
                    var jsonRes = JSON.parse(chunk);
                    var checkoutdata = {
                        entityId: req_data.entityId,
                        merchantTransactionId: merchantId,
                        bookingId:req_data.bookingId,
                        amount: req_data.amount,//req_data.amount,
                        currency: req_data.currency,//req_data.currency,
                        paymentType: '',
                        userId: userId,
                        type: 'hyperPay',
                        buildNumber: jsonRes.buildNumber,
                        timestamp: jsonRes.timestamp,
                        ndc: jsonRes.ndc,
                        id: jsonRes.id,
                        createdAt: moment().format()
                    }
                    if(req_data.checkout_type == 'payment'){
                        checkoutdata.paymentType = 'DB'
                    }
                    console.log('Android checkout', jsonRes);
                    await new checkoutModel(checkoutdata).save();
                    resolve(jsonRes );
                });
            });
            postRequest.write(data);
            postRequest.end();
        }catch(err){
            console.log(err);
            reject(err);
        }
    });
}

/** Add Card */
function AddCard(dataObj:any,userId:any,headers:any):Promise<any>{
    return new Promise(async (resolve, reject) => {
        var err_msg:any = errors.en;
        if(headers.language == 'ar'){
            var err_msg:any = errors.ar;
        }
        try{
            const req_data = dataObj;
            var cardData = await cardModel.findOne({ 'token': req_data.registrationId,'status':true, 'userId': userId });
            if (!cardData) {
                await cardModel.updateMany({'userId':userId},{'isDefault':false});
                var cardData_check = await cardModel.findOne({ 'card_number': req_data.last4Digits,'status':true,'brand':req_data.paymentBrand ,'userId': userId });
                if(!cardData_check){
                    var card_data = {
                        userId: userId,
                        merchantId: req_data.merchantId,
                        exp_month: req_data.expiryMonth,
                        exp_year: req_data.expiryYear,
                        bank_name:req_data.bank_name,
                        name: req_data.holder,
                        card_number: req_data.last4Digits,
                        card_number2: req_data.bin,
                        card_type: req_data.type,
                        brand: req_data.paymentBrand,
                        payment_type: req_data.paymentType,
                        country: req_data.country,
                        token: req_data.registrationId,
                        status:true,
                        isDelete:false
                    }
                    var saveCardData = await new cardModel(card_data).save();
                    resolve(saveCardData);
                }else{
                    resolve({});
                }
            }else{
                resolve({});
            }
        }catch(error){
            console.log(error);
            reject(error);
        }
    });
}

/** Get Card */
function getCard(dataObj:any,userId:any,headers:any):Promise<any>{
    return new Promise(async (resolve, reject) => {
        var err_msg:any = errors.en;
        if(headers.language == 'ar'){
            var err_msg:any = errors.ar;
        }
        try{
            const {pageNo=1,perPage=10} = dataObj;
            var cardData = await cardModel.find({'status':true, 'userId': userId,'isDelete':false }).sort({'createdAt':-1}).skip(perPage*(pageNo-1)).limit(perPage);
            var cardCount = await cardModel.countDocuments({'isDelete':false,'status':true,'userId':userId});
            if (cardData && cardData.length) {
                resolve({data:cardData,count:cardCount});
            }else{
                resolve({data:cardData,count:cardCount});
            }
        }catch(error){
            console.log(error);
            reject(error);
        }
    });
}

/** Delete Card */
function deleteCard(dataObj:any,userId:any,headers:any):Promise<any>{
    return new Promise(async(resolve,reject)=>{
        try{
            const cardId = dataObj.cardId;
            var deleteCard = await cardModel.updateOne({'_id':cardId},{'isDelete':true,'status':false});
            resolve({});
        }catch(error){
            console.log(error);
            reject(error);
        }
    });
}

function paymentCallBack(dataObj:any,headers:any):Promise<any>{
    return new Promise(async(resolve,reject)=>{
        try{
            console.log('paymentCallBack -------------------',paymentCallBack);
            resolve({});
        }catch(error){
            console.log(error);
            reject(error);
        }
    });
}

function verifyPayment(dataObj:any,headers:any):Promise<any>{
    return new Promise(async(resolve,reject)=>{
        try{
            console.log('verifyPayment -------------------',verifyPayment);
            resolve({});
        }catch(error){
            console.log(error);
            reject(error);
        }
    });
}

/** Add default Card */
function AdddefaultCard(dataObj:any,userId:any,headers:any):Promise<any>{
    return new Promise(async(resolve,reject)=>{
        try{
            const cardId = dataObj.cardId;
            await cardModel.updateMany({'userId':userId},{'isDefault':false});
            await cardModel.updateOne({'_id':cardId},{'isDefault':true});
            resolve({});
        }catch(error){
            console.log(error);
            reject(error);
        }
    });
}

// Add bank account
function AddBankAccount(dataObj:any,userId:any,headers:any):Promise<any>{
    return new Promise(async(resolve,reject)=>{
        try{
            await bankModel.updateMany({'userId':userId},{'isDefault':false});
            var obj:any = {
                account_holder_name: dataObj.account_holder_name,
                userId: userId,
                bank_name: dataObj.bank_name,
                bank_address: dataObj.bank_address,
                account_number: dataObj.account_number,
                iban_number: dataObj.iban_number,
                isDefault:true,
                status: true,
                isDelete:false
            }
            const bank:any = await new bankModel(obj).save();
            return(bank);
        }catch(error){
            console.log(error);
            reject(error);
        }
    });
}

// Get Bank accounts
function GetBankAccount(userId:any,headers:any):Promise<any>{
    return new Promise(async(resolve,reject)=>{
        try{
            var banks = await bankModel.find({'userId':userId,'status':true,'isDelete':false});
            resolve(banks);
        }catch(error){
            console.log(error);
            reject(error);
        }
    });
}

// Delete Bank account
// Add bank account
function DeleteBankAccount(dataObj:any,userId:any,headers:any):Promise<any>{
    return new Promise(async(resolve,reject)=>{
        try{
            await bankModel.updateOne({'_id':dataObj.bankId},{'status':false,'isDelete':true});
            resolve({});
        }catch(error){
            console.log(error);
            reject(error);
        }
    });
}
// Export default
export default {
    CheckOut,
    AddCard,
    getCard,
    deleteCard,
    paymentCallBack,
    verifyPayment,
    AdddefaultCard,
    AddBankAccount,
    GetBankAccount,
    DeleteBankAccount
} as const;