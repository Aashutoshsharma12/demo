import { vendorModel, doorKeeperModel, userSessionModel } from '@models/index';
import { CustomError } from '@utils/errors';
import StatusCodes from 'http-status-codes';
const jwt = require('jsonwebtoken');
import { errors } from '@constants';
import bcrypt from 'bcrypt';
import { func } from 'joi';
const _ = require('lodash');

/**
 * user SignUp
 * 
 * @param user 
 * @returns 
 */
function addDoor_keeper(user: any, userId: any,headers:any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg:any = errors.en;
        if(headers.language == 'ar'){
            var err_msg:any = errors.ar;
        }
        try {
            console.log(userId,";[pp")
            const { phoneNumber,password } = user;
            const checkDoor_keeper = await doorKeeperModel.findOne({ phoneNumber });
            if (checkDoor_keeper) {
                reject(new CustomError(err_msg.accountAlreadyExist, StatusCodes.BAD_REQUEST));
            } else {
                const password1  = bcrypt.hashSync(password,10);
                const obj = {
                    ...user,
                    userId,
                    password:password1
                };
                const add = await doorKeeperModel.create(obj);
                resolve(add);        
            }
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}


// Export default
export default {
    addDoor_keeper
} as const;
