import settingModel from '@models/setting';
import { CustomError } from '@utils/errors';
import StatusCodes from 'http-status-codes';
import { errors } from '@constants';
/**
 * Admin register
 * 
 * @param body 
 * @returns 
 */
function registerSetting(body: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {console.log(body)
            const response = await settingModel.create(body)
            resolve(response)
        } catch (err) {
            console.log(err)
            if (err.code == 11000) {
                reject(new CustomError(errors.en.userExist, StatusCodes.INTERNAL_SERVER_ERROR))
            }
            reject(err)
        }
    });
}

//***********Edit*********/

function editSetting(body:any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
          const data: any = await settingModel.findOne({ });
            if (!data) {
                reject(new CustomError(errors.en.noDatafound, StatusCodes.INTERNAL_SERVER_ERROR))
            } else {
               const dataObj = await settingModel.updateOne({ }, body, { new: true });
                resolve(dataObj)
            }
        } catch (err) {
            reject(err)
        }
    });
}


//**** Detail By Id*****/

function detailSetting(query: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
           const response = await settingModel.findOne({  })
            if (!response) {
                reject(new CustomError(errors.en.noDatafound, StatusCodes.INTERNAL_SERVER_ERROR))
            } else {
                resolve(response)
            }
        } catch (err) {
            reject(err)

        }
    });
}



// Export default
export default {
    registerSetting,
    editSetting,
    detailSetting
} as const;
