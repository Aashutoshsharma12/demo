import { tax_chargesModel } from '../../models/index';
import { CustomError } from '../../utils/errors';
import StatusCodes from 'http-status-codes';
import { errors } from '../../constants/index';
import { contentSecurityPolicy } from 'helmet';
const _ = require('lodash');

// add tax
function addTax(body: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { tax } = body;
            if (!tax) {
                reject(new CustomError("tax_chareges required", StatusCodes.BAD_REQUEST));
            } else {
                const get = await tax_chargesModel.findOne({ isDelete: false });
                if (get) {
                    await tax_chargesModel.updateOne({ isDelete: false }, { tax: tax });
                    resolve({ success: true });
                } else {
                    var save = await tax_chargesModel.create({ tax: tax })
                    resolve(save);

                }
            }
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}

// admin tax details
function details():Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
               const details =  await tax_chargesModel.findOne({ isActive: true, isDelete: false },{tax:1});
               if (details) {
                resolve(details);
            } else {
                reject(new CustomError(errors.en.noDatafound, StatusCodes.BAD_REQUEST));
            }
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}

export default {
    details,
    addTax
} as const;