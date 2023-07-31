import { galleryModel } from '@models/index';
import { StatusCodes } from 'http-status-codes';
import { errors } from '@constants';
import { CustomError } from '@utils/errors';

// Add image
function addImage(data: any, userId: any, image: any, headers: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg:any = errors.en;
        if (headers.language == 'ar') {
            var err_msg:any = errors.ar;
        }
        try {
            console.log("eneter")
            if (!image) {
                reject(new CustomError("Image required", StatusCodes.BAD_REQUEST));
            } else {
                const obj = {
                    ...data,
                    userId,
                    image: image ? image.path : ''
                };
                console.log(obj,"ojjjjjj")
                const add = await galleryModel.create(obj);
                resolve(add);
            }
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}

// Update image
function updateImage(image_id: any, userId: any, image: any, headers: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg:any = errors.en;
        if (headers.language == 'ar') {
            var err_msg:any = errors.ar;
        }
        try {
            const { id } = image_id;
            const checkImage = await galleryModel.findOne({ _id: id, isDelete: false });
            if (checkImage) {
                const obj = {
                    image: image ? image[0].path : checkImage.image
                };
                await galleryModel.updateOne({ _id: id }, obj);
                resolve({ success: true });
            } else {
                reject(new CustomError(err_msg.noDatafound, StatusCodes.BAD_REQUEST));
            }
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}

// Image List
function ImageList(query: any, userId: any, headers: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg:any = errors.en;
        if (headers.language == 'ar') {
            var err_msg:any = errors.ar;
        }
        try {
            const { storeId, page = 1, perPage = 10 } = query;
            if (!storeId) {
                reject(new CustomError(err_msg.requiredStore, StatusCodes.BAD_REQUEST));
            }
            const ImageList = await galleryModel.find({ storeId: storeId, isDelete: false }).sort({ createdAt: -1 }).skip((page * perPage) - perPage).limit(perPage);
            resolve({ images: ImageList });
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}

// Delete Images
function delete_image(body: any, userId: any, headers: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
        var err_msg:any = errors.en;
        if (headers.language == 'ar') {
            var err_msg:any = errors.ar;
        }
        try {
            const { image_Id, type, storeId } = body;
            if (type == "All") {
                if (!storeId) {
                    reject(new CustomError("storeId required", StatusCodes.BAD_REQUEST));
                } else {
                    await galleryModel.updateMany({ userId: userId, storeId: storeId, isDelete: false }, { isDelete: true });
                    resolve({ success: true });
                }
            } else {
                if (!image_Id && image_Id == null) {
                    reject(new CustomError("image_Id required", StatusCodes.BAD_REQUEST));
                } else if (image_Id.length == 0) {
                    reject(new CustomError("image_Id required", StatusCodes.BAD_REQUEST));
                } else {
                    await galleryModel.updateMany({ userId: userId, _id: image_Id }, { isDelete: true });
                    resolve({ success: true });
                }
            }
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}

export default {
    addImage,
    updateImage,
    ImageList,
    delete_image

} as const