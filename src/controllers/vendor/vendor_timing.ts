import { timingModel, vendorStoreModel } from '@models/index';
import { StatusCodes } from 'http-status-codes';
import { errors } from '@constants';
import { CustomError } from '@utils/errors';

// Add and Edit vendor open closing timing
function addEditTiming(data: any, userId: any, headers: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg: any = errors.en;
        if (headers.language == 'ar') {
            var err_msg: any = errors.ar;
        }
        try {
            if (!data.storeId) {
                reject(new CustomError(err_msg.requiredStore, StatusCodes.BAD_REQUEST))
            } else {
                var obj = {
                    ...data,
                    userId
                };
                const check = await timingModel.findOne({ userId, storeId: data.storeId });
                if (!check) {
                    const add_timing = await timingModel.create(obj);
                    await vendorStoreModel.updateOne({ userId, _id: data.storeId }, { store_openClosing_time: true })
                    resolve(add_timing);
                } else {
                    await vendorStoreModel.updateOne({ userId, _id: data.storeId }, { store_openClosing_time: true })
                    await timingModel.updateOne({ userId, storeId: data.storeId }, data);
                    resolve({ success: true });
                }
            }

        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}

// get Timing
function getTiming(query: any, userId: any, headers: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg: any = errors.en;
        if (headers.language == 'ar') {
            var err_msg: any = errors.ar;
        }
        try {
            if (!query.storeId) {
                reject(new CustomError(err_msg.requiredStore, StatusCodes.BAD_REQUEST))
            } else {
                const get = await timingModel.findOne({ userId, storeId: query.storeId });
                if (get) {
                    resolve(get);
                } else {
                    resolve({});
                }
            }

        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}

export default {
    addEditTiming,
    getTiming
} as const

