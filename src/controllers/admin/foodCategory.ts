import { foodCategoryModel } from '../../models/index';
import { CustomError } from '../../utils/errors';
import StatusCodes from 'http-status-codes';
import { errors } from '../../constants/index';
const _ = require('lodash');

// Add Category
function add_foodCategory(data: any, userId: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const { title } = data;
            const lower_case = title.toLowerCase();
                data.lower_title = lower_case;
            const checkCategory = await foodCategoryModel.findOne({ lower_title: lower_case,isDelete:false });
            if (checkCategory) {
                reject(new CustomError(errors.en.categoryExists, StatusCodes.BAD_REQUEST));
            } else {
                const add_foodCategory = await foodCategoryModel.create(data);
                resolve(add_foodCategory);
            }
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}


export default {
    add_foodCategory
} as const;