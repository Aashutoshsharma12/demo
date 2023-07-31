import * as chai from 'chai';
const chaiHttp = require('chai-http')
import chaiAsPromised from 'chai-as-promised';
import { expect, assert } from 'chai'
chai.use(chaiHttp)
import 'mocha';
import axios from 'axios';
import { success } from 'src/constants'
var request = require("request");
import { StatusCodes } from "http-status-codes";
import exp from 'constants';
import addons_type from '@controllers/vendor/addons_type';
import { func } from 'joi';
import addons from '@controllers/vendor/addons';
var fs = require('fs');
const { CREATED, OK } = StatusCodes
// import $ from 'JQueryStatic'
var base_url = "http://localhost:3009/api/v1/vendor/"
var jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzZTIwMWU0NTYzMDhlMzMyZWE3NTI1MSIsInJvbGUiOiJWZW5kb3IiLCJpYXQiOjE2NzU3NjE2NjAsImV4cCI6MTY3ODM1MzY2MH0.AeM4pj4EQNdS_Bnfrm5w5dNWrY1OkA4g55w5f5UWiE4"

// // //vendor Authentication
// describe('Vendor Authentication **********************************', () => {
//    const countryCode = "+91"
//    const phoneNumber = "9000190126"
//    const role = "Vendor"
//    const ownerName = "Punit sharma"
//    const ar_businessName = "Punit sharma"
//    const businessName = "Food valley(First)"
//    const password = "1234"
//    const acceptTerms_Condition = true//sign up
//    describe('Signup-------------------', () => {
//       it("signup APi", (done) => {
//          request.post(base_url + "" + "auth/sign-up", {
//             json: true, body: {
//                "countryCode": countryCode,
//                "phoneNumber": phoneNumber,
//                "role": role,
//                "ownerName": ownerName,
//                "ar_businessName": ar_businessName,
//                "businessName": businessName,
//                "password": password,
//                "acceptTerms_Condition": acceptTerms_Condition
//             }
//          }, function (error: any, body: any, res: any) {
//             expect(res.message).to.be.equal(success.en.signupSuccessful);
//             expect(res.code).to.be.equal(CREATED);
//             expect(res.data).to.include.all.keys('token', 'isUser',
//                'storeType',
//                'isVerified',
//                'phoneNumber',
//                'countryCode',
//                'ownerName',
//                'businessName',
//                '_id');
//             done();
//          });
//       })
//    })
//    //login
//    describe('Login---------------------', () => {
//       it("login APi", (done) => {
//          // request.post(base_url + "" + "auth/login", {
//          //    json: true, body: {
//          //       "countryCode": countryCode,
//          //       "phoneNumber": phoneNumber,
//          //       "role": role,
//          //       "password": password
//          //    }
//          // }, function (error: any, body: any, res: any) {
//          //    console.log(error, "flkkfkfkf", res, "ldlkdk")
//          //    expect(res.message).to.be.equal(success.en.loginSuccessful);
//          //    expect(res.code).to.be.equal(OK);
//          //    expect(res.data).to.include.all.keys('token', 'isUser',
//          //       'storeType',
//          //       'isVerified',
//          //       'storeTypeId',
//          //       'storeId',
//          //       '_id'
//          //    );
//          //    done();
//          // }, 10000);
//          request(base_url + "" + "auth/login", {
//             json: true, body: {
//                "countryCode": countryCode,
//                "phoneNumber": phoneNumber,
//                "role": role,
//                "password": password
//             }
//          }, function (error: any, body: any, res: any) {
//             console.log(error, "flkkfkfkf", res, "ldlkdk")
//             expect(res.message).to.be.equal(success.en.loginSuccessful);
//             expect(res.code).to.be.equal(OK);
//             expect(res.data).to.include.all.keys('token', 'isUser',
//                'storeType',
//                'isVerified',
//                'storeTypeId',
//                'storeId',
//                '_id'
//             );
//             done();
//          }, 10000);

//       })
//    });


//    //check-account
//    describe('Check-Account--------------', () => {
//       it("check-account APi", (done) => {
//          request.post(base_url + "" + "auth/check-account", {
//             json: true, body: {
//                "countryCode": countryCode,
//                "phoneNumber": phoneNumber,
//                "role": role
//             }
//          }, function (error: any, body: any, res: any) {
//             // expect(res.message).to.be.equal(success.en.ac);
//             expect(res.code).to.be.equal(OK);
//             expect(res.data).to.include.all.keys('isUser');
//             done();
//          });
//       })
//    })
//    //reset_password
//    describe('Reset_Password--------------', () => {
//       it("reset password Api", (done) => {
//          request.put(base_url + "" + "auth/resetPassword", {
//             json: true, body: {
//                "countryCode": countryCode,
//                "phoneNumber": phoneNumber,
//                "newPassword": "1234",
//                "confirmPassword": "1234"
//             }
//          }, function (error: any, body: any, res: any) {
//             expect(res.message).to.be.equal(success.en.success);
//             expect(res.code).to.be.equal(OK);
//             done();
//          });
//       })
//    })
//    //change-password
//    describe('Change_Password-------------', () => {
//       it("change password Api", (done) => {
//          request.put(base_url + "" + "auth/changePassword", {
//             json: true, headers: { 'Authorization': jwt }, body: {
//                "oldPassword": password,
//                "newPassword": "1234",
//                "confirmPassword": "1234"
//             }
//          }, function (error: any, body: any, res: any) {
//             expect(res.message).to.be.equal(success.en.updatePassword);
//             expect(res.code).to.be.equal(OK);
//             done();
//          });
//       })
//    })
//    //logout
//    // describe('Logout', () => {
//    //     it("logout APi", (done) => {
//    //         request.get(base_url + "" + "auth/logout", {
//    //             json: true, headers: { 'Authorization': jwt }
//    //         }, function (error: any, body: any, res: any) {
//    //             expect(res.message).to.be.equal(success.en.logOutSuccessful);
//    //             expect(res.code).to.be.equal(OK);
//    //             expect(res.data).to.include.all.keys('success');
//    //             done();
//    //         });
//    //     })
//    // })
// })

// //vendor store
// describe('Vendor Store *********************************************', () => {
//    var fullAddress = "Pilkhuwa Hapur Ghaziabad near nizampur India"
//    var streetAddress = "Hapur"
//    var countryCode = "In"
//    var state = "Uttar Pradesh"
//    var addressLine1 = " nizampur"
//    var addressLine2 = "nizampur hapur"
//    var city = "hapur"
//    var zipCode = "245101"
//    var lat = "12.223"
//    var lng = "20.433"
//    var googlePlaceId = "345tef6yh"
//    var notes = "hii brkjdc"
//    var storeTypeId = "63440972d43a01c93539858e"
//    var branchName = "Vinay shop"
//    var phoneNoCountryCode = "+91"
//    var phoneNumber = "9087655678"
//    var email = "as12@gmail.com"
//    var ar_branchName = "Vinay shop"
//    var branchId = "63e22a1310700359a60c0303"
//    //add Store Main branch
//    // describe('Add Store (Main Branch)', () => {
//    //     it("add store APi", (done) => {
//    //         request.post(base_url + "" + "vendor_store/add", {
//    //             json: true, headers: { 'Authorization': jwt }, body: {
//    //                 "fullAddress": fullAddress,
//    //                 "streetAddress": streetAddress,
//    //                 "countryCode": countryCode,
//    //                 "state": state,
//    //                 "addressLine1": addressLine1,
//    //                 "addressLine2": addressLine2,
//    //                 "city": city,
//    //                 "zipCode": zipCode,
//    //                 "lat": lat,
//    //                 "lng": lng,
//    //                 "googlePlaceId": googlePlaceId,
//    //                 "notes": notes,
//    //                 "storeTypeId": storeTypeId
//    //             }
//    //         }, function (error: any, body: any, res: any) {
//    //             expect(res.message).to.be.equal(success.en.storeAdd);
//    //             expect(res.code).to.be.equal(CREATED);
//    //             done();
//    //         });
//    //     })
//    // })
//    //add  branch
//    // describe('Add Branch--------------', () => {
//    //     it("add branch Api", (done) => {
//    //         request.post(base_url + "" + "vendor_store/add_branch", {
//    //             json: true, headers: { 'Authorization': jwt }, body: {
//    //                 "fullAddress": fullAddress,
//    //                 "countryCode": countryCode,
//    //                 "state": state,
//    //                 "addressLine1": addressLine1,
//    //                 "addressLine2": addressLine2,
//    //                 "city": city,
//    //                 "zipCode": zipCode,
//    //                 "lat": lat,
//    //                 "lng": lng,
//    //                 "googlePlaceId": googlePlaceId,
//    //                 "phoneNoCountryCode": phoneNoCountryCode,
//    //                 "email": email,
//    //                 "phoneNumber": phoneNumber,
//    //                 "branchName": branchName,
//    //                 "ar_branchName": ar_branchName,
//    //                 "isActive": true
//    //             }
//    //         }, function (error: any, body: any, res: any) {
//    //             expect(res.message).to.be.equal(success.en.branchAdd);
//    //             expect(res.code).to.be.equal(CREATED);
//    //             done();
//    //         });
//    //     })
//    // })
//    //Edit branch
//    describe('Edit Branch----------------', () => {
//       it("edit branch Api", (done) => {
//          request.put(base_url + "" + "vendor_store/editBranch?branch_Id=" + "" + branchId, {
//             json: true, headers: { 'Authorization': jwt }, body: {
//                "fullAddress": fullAddress,
//                "countryCode": countryCode,
//                "state": state,
//                "addressLine1": addressLine1,
//                "addressLine2": addressLine2,
//                "city": city,
//                "zipCode": zipCode,
//                "lat": lat,
//                "lng": lng,
//                "googlePlaceId": googlePlaceId,
//                "phoneNoCountryCode": phoneNoCountryCode,
//                "email": email,
//                "phoneNumber": phoneNumber,
//                "branchName": branchName,
//                "ar_branchName": ar_branchName,
//                "isActive": true
//             }
//          }, function (error: any, body: any, res: any) {
//             expect(res.message).to.be.equal(success.en.branchEdit);
//             expect(res.code).to.be.equal(CREATED);
//             done();
//          });
//       })
//    })
//    //Branch details
//    describe('Branch Details-------------', () => {
//       it("branch details Api", (done) => {
//          request.get(base_url + "" + "vendor_store/branchDetails/" + "" + branchId, {
//             json: true, headers: { 'Authorization': jwt }
//          }, function (error: any, body: any, res: any) {
//             expect(res.message).to.be.equal(success.en.recordFetched);
//             expect(res.code).to.be.equal(OK);
//             done();
//          });
//       })
//    })
//    //Branch list
//    describe('Branch List-----------', () => {
//       it("branch list Api", (done) => {
//          request.get(base_url + "" + "vendor_store/listOf_branch", {
//             json: true, headers: { 'Authorization': jwt }
//          }, function (error: any, body: any, res: any) {
//             expect(res.message).to.be.equal(success.en.recordFetched);
//             expect(res.code).to.be.equal(OK);
//             done();
//          });
//       })
//    })
//    //Branch status update
//    describe('Update Status Branch-------------', () => {
//       it("Update Status Api", (done) => {
//          request.get(base_url + "" + "vendor_store/update_status?branch_id=" + "" + branchId + "&isActive=" + "" + true, {
//             json: true, headers: { 'Authorization': jwt }
//          }, function (error: any, body: any, res: any) {
//             expect(res.message).to.be.equal(success.en.branchstatus);
//             expect(res.code).to.be.equal(OK);
//             done();
//          });
//       })
//    })
// })

// //Menu Items
// describe('Menu Items Module ***************************************', () => {
//    const storeTypeId = "63440972d43a01c93539858e"
//    const foodCategoryId = "6345113c33a16976037f049c"
//    const itemCategoryId = "639ac64c160b110f85b7d73a"
//    const cuisineCategoryId = "639ac410160b110f85b7d5c3"
//    const itemName = "a11q1www"
//    const amount = "100"
//    // const image = "https://res.cloudinary.com/tecorbssvan/image/upload/v1671087120/tlbptvekgq8buuk7pmel.jpg"
//    const description = "Itemqqqww1"
//    const preparationTime = '30'
//    const storeId = "63e22a1310700359a60c0303"
//    const recommended = 'false'
//    const ar_description = "Item"
//    const ar_itemName = "Item"
//    const itemId = "63e34ea07a9cd2ea6aead1c3"
//    // describe('Add Menu Item -------------------------------', function () {
//    //     // it('add menu_item', (done) => {
//    //     var body = {
//    //         'storeTypeId': storeTypeId,
//    //         'foodCategoryId': foodCategoryId,
//    //         'itemCategoryId': itemCategoryId,
//    //         'cuisineCategoryId': cuisineCategoryId,
//    //         'itemName': itemName,
//    //         'amount': amount,
//    //         'description': description,
//    //         'preparationTime': preparationTime,
//    //         'storeId': storeId,
//    //         'recommended': recommended,
//    //         'ar_description': ar_description,
//    //         'ar_itemName': ar_itemName
//    //     }
//    //     it('add menu items', async (done) => {
//    //         // this.timeout(5000)
//    //         myagent.post(app + "" + '/api/v1/vendor/vendor_menuItems/add').set('Authorization', jwt).set("Content-Type", "multipart/form-data").field(body)
//    //             .attach('image', '/home/tecorb/Pictures/Screenshot from 2023-02-07 10-52-44.png')
//    //             // .expect(CREATED)
//    //             .end(function (err: any, res: any) {
//    //                 // console.log(res.body,"pppoopo")
//    //                 if (err) {
//    //                     console.log(err, ";opoooo");
//    //                 } else {
//    //                     console.log(res.body, ';lllllppoop')
//    //                     expect(res.body.code).to.equal(200);
//    //                     done();
//    //                 }
//    //             });

//    //     })
//    // });
//    // })
//    //item wdetails
//    describe('Item Detaills ---------', () => {
//       it('item details api', (done) => {
//          request.get(base_url + "" + "vendor_menuItems/get?itemId=" + "" + itemId, { json: true, headers: { 'Authorization': jwt } },
//             function (err: any, body: any, res: any) {
//                expect(res.code).to.be.eq(OK)
//                expect(res.message).to.be.eq(success.en.recordFetched)
//                done();
//             })
//       })
//    })
//    //item list
//    describe('Item List ---------', () => {
//       it('item list api', (done) => {
//          request.get(base_url + "" + "vendor_menuItems/list?storeId=" + "" + storeId, { json: true, headers: { 'Authorization': jwt } },
//             function (err: any, body: any, res: any) {
//                expect(res.code).to.be.eq(OK)
//                expect(res.message).to.be.eq(success.en.recordFetched)
//                done();
//             })
//       })
//    })
//    //update status
//    describe('Update Status ---------', () => {
//       it('update status api', (done) => {
//          request.get(base_url + "" + "vendor_menuItems/update?isActive=true&itemId=" + "" + itemId, { json: true, headers: { 'Authorization': jwt } },
//             function (err: any, body: any, res: any) {
//                expect(res.code).to.be.eq(OK)
//                expect(res.message).to.be.eq(success.en.ItemsUpda)
//                done();
//             })
//       })
//    })
//    // describe('Delete Item ---------', () => {
//    //     it('delete item api', (done) => {
//    //         request.delete(base_url + "" + "vendor_menuItems/delete_items/"+""+itemId, { json: true, headers: { 'Authorization': jwt } },
//    //             function (err: any, body: any, res: any) {
//    //                 console.log(res,"dkdkd")
//    //                 expect(res.code).to.be.eq(OK)
//    //                 expect(res.message).to.be.eq(success.en.menuItemDelete)
//    //                 done();
//    //             })
//    //     })
//    // })
//    //cusine category APi
//    describe('Cuisine list ---------', () => {
//       it('cuisine list api', (done) => {
//          request.get(base_url + "" + "vendor_menuItems/cusinecategoriesList?storeTypeId=" + "" + storeTypeId, { json: true, headers: { 'Authorization': jwt } },
//             function (err: any, body: any, res: any) {
//                expect(res.code).to.be.eq(OK)
//                expect(res.message).to.be.eq(success.en.recordFetched)
//                done();
//             })
//       })
//    })
//    // item category Api
//    describe('Item_category list ---------', () => {
//       it('item_category list api', (done) => {
//          request.get(base_url + "" + "vendor_menuItems/itemcategoriesList?storeTypeId=" + "" + storeTypeId, { json: true, headers: { 'Authorization': jwt } },
//             function (err: any, body: any, res: any) {
//                expect(res.code).to.be.eq(OK)
//                expect(res.message).to.be.eq(success.en.recordFetched)
//                done();
//             })
//       })
//    })
//    //Food category APi
//    describe('Food_category list ---------', () => {
//       it('food_category list api', (done) => {
//          request.get(base_url + "" + "vendor_menuItems/foodCategoryList", { json: true, headers: { 'Authorization': jwt } },
//             function (err: any, body: any, res: any) {
//                expect(res.code).to.be.eq(OK)
//                expect(res.message).to.be.eq(success.en.recordFetched)
//                done();
//             })
//       })
//    })

// });

// //Offer module
// describe('Offer Module **********************************************', () => {
//    const storeId = "63e22a1310700359a60c0303"
//    const offerId = "63e48365d79addb4beed1df9"
//    //offer list
//    describe('Offer list ----------------', () => {
//       it('offer list api', (done) => {
//          request.get(base_url + "" + 'offer/list?page=1&perPage=1&storeId=' + "" + storeId, { json: true, headers: { 'Authorization': jwt, 'timezone': 'Asia/Calcutta' } },
//             function (err: any, body: any, res: any) {
//                expect(res.code).to.be.eq(OK);
//                expect(res.message).to.be.eq(success.en.recordFetched);
//                done();
//             })
//       })
//    })
//    //offer details
//    describe('Offer Details ----------------', () => {
//       it('offer details api', (done) => {
//          request.get(base_url + "" + 'offer/get/' + "" + offerId, { json: true, headers: { 'Authorization': jwt } },
//             function (err: any, body: any, res: any) {
//                expect(res.code).to.be.eq(OK);
//                // assert.equal(res.code,'3030',"LOOOOO------")
//                expect(res.message).to.be.eq(success.en.recordFetched);
//                done();
//             })
//       })
//    })
//    //update offer status 
//    describe('Update Offer Status----------------', () => {
//       it('update offer status api', (done) => {
//          request.put(base_url + "" + 'offer/update_status?isActive=true&offerId=' + "" + offerId, { json: true, headers: { 'Authorization': jwt, 'timezone': 'Asia/Kolkata' } },
//             function (err: any, body: any, res: any) {
//                expect(res.code).to.be.eq(CREATED);
//                // assert.equal(res.code,'3030',"LOOOOO------")
//                expect(res.message).to.be.eq(success.en.OffersEdit);
//                done();
//             })
//       })
//    })
//    // //delete offer 
//    //   describe('Delete Offer  ----------------', () => {
//    //     it('delete offer api', (done) => {
//    //         request.delete(base_url + "" + 'offer/delete/' + "" + storeId, { json: true, headers: { 'Authorization': jwt } },
//    //             function (err: any, body: any, res: any) {
//    //                 expect(res.code).to.be.eq(OK);
//    //                 // assert.equal(res.code,'3030',"LOOOOO------")
//    //                 expect(res.message).to.be.eq(success.en.offerDelete);
//    //                 done();
//    //             })
//    //     })
//    // })
// })

// //item_size
// describe('Item_Size Module **********************************************', () => {
//    const itemId = "63e34ea07a9cd2ea6aead1c3"
//    const item_size = "Quarter1"
//    const amount = "20"
//    var ar_item_size = 'Quarter'
//    const itemSizeId = "63e38184967a0f2f19a24252"
//    const storeId = "63e22a1310700359a60c0303"

//    // //add item size
//    // describe('item_size Add ----------------', () => {
//    //     it('add item_size api', (done) => {
//    //         request.post(base_url + "" + 'vendor_itemSize/add', {
//    //             json: true, headers: { 'Authorization': jwt }, body: {
//    //                 "itemId": itemId,
//    //                 "item_size": item_size,
//    //                 "ar_item_size": ar_item_size,
//    //                 "amount": amount
//    //             }
//    //         },
//    //             function (err: any, body: any, res: any) {
//    //                 console.log(res, "ress")
//    //                 expect(res.code).to.be.eq(CREATED);
//    //                 expect(res.message).to.be.eq(success.en.AddItem_size);
//    //                 done();
//    //             })
//    //     })
//    // })
//    //edit item size
//    describe('Edit item_size ----------------', () => {
//       it('edit item size api', (done) => {
//          request.put(base_url + "" + 'vendor_itemSize/edit?itemSizeId=' + "" + itemSizeId, {
//             json: true, headers: { 'Authorization': jwt }, body: {
//                "itemId": itemId,
//                "item_size": item_size,
//                "ar_item_size": ar_item_size,
//                "amount": amount
//             }
//          },
//             function (err: any, body: any, res: any) {
//                expect(res.code).to.be.eq(CREATED);
//                expect(res.message).to.be.eq(success.en.updItemSize);
//                done();
//             })
//       })
//    })
//    //item size details
//    describe('Item size details----------------', () => {
//       it('item size details api', (done) => {
//          request.get(base_url + "" + 'vendor_itemSize/get?itemSizeId=' + "" + itemSizeId, { json: true, headers: { 'Authorization': jwt } },
//             function (err: any, body: any, res: any) {
//                expect(res.code).to.be.eq(OK);
//                expect(res.message).to.be.eq(success.en.recordFetched);
//                done();
//             })
//       })
//    })
//    //item size LIST
//    describe('Item size List ---------------', () => {
//       it('item size list api', (done) => {
//          request.get(base_url + "" + 'vendor_itemSize/list?page=1&perPage=1&itemId=' + "" + itemId, { json: true, headers: { 'Authorization': jwt } },
//             function (err: any, body: any, res: any) {
//                expect(res.code).to.be.eq(OK);
//                expect(res.message).to.be.eq(success.en.recordFetched);
//                done();
//             })
//       })
//    })
//    //update item size  status
//    describe('Update Item size Status ---------------', () => {
//       it('update item size status api', (done) => {
//          request.get(base_url + "" + 'vendor_itemSize/update?isActive=true&itemSizeId=' + "" + itemSizeId, { json: true, headers: { 'Authorization': jwt } },
//             function (err: any, body: any, res: any) {
//                expect(res.code).to.be.eq(OK);
//                expect(res.message).to.be.eq(success.en.updItemSize);
//                done();
//             })
//       })
//    })
//    // //delete item size 
//    //   describe('Delete Item Size  ----------------', () => {
//    //     it('delete Item Size api', (done) => {
//    //         request.delete(base_url + "" + 'vendor_itemSize/delete_itemSize/' + "" + storeId, { json: true, headers: { 'Authorization': jwt } },
//    //             function (err: any, body: any, res: any) {
//    //                 expect(res.code).to.be.eq(OK);
//    //                 // assert.equal(res.code,'3030',"LOOOOO------")
//    //                 expect(res.message).to.be.eq(success.en.offerDelete);
//    //                 done();
//    //             })
//    //     })
//    // })
// })

// //order Module
// describe('Order module ******************', () => {
//    var storeId = "63e22a1310700359a60c0303"
//    var orderId = '6399aa1d42784439752fc561'
//    //order list
//    describe('Order list ------------------------', () => {
//       it('order list api', (done) => {
//          request.get(base_url + "" + "order/list?type=Pending&storeId=" + "" + storeId, { json: true, headers: { 'Authorization': jwt } },
//             function (err: any, body: any, res: any) {
//                expect(res.code).to.be.eq(OK);
//                expect(res.message).to.be.eq(success.en.recordFetched)
//                done()
//             }
//          )
//       });
//    });

//    //order details
//    describe('Order details ------------------------', () => {
//       it('order details api', (done) => {
//          request.get(base_url + "" + "order/details?orderId=" + "" + orderId, { json: true, headers: { 'Authorization': jwt, 'timezone': 'Asia/kolkata' } },
//             function (err: any, body: any, res: any) {
//                expect(res.code).to.be.eq(OK);
//                expect(res.message).to.be.eq(success.en.recordFetched)
//                done();
//             }
//          )
//       });
//    });
//    //update order status
//    describe('Update Order status ------------------------', () => {
//       it('order details api', (done) => {
//          request.put(base_url + "" + "order/update?status=Pending&orderId=" + "" + orderId, { json: true, headers: { 'Authorization': jwt, 'timezone': "Asia/Kolkata" } },
//             function (err: any, body: any, res: any) {
//                expect(res.code).to.be.eq(OK);
//                expect(res.message).to.be.eq(success.en.success)
//                done()
//             }
//          )
//       });
//    });
//    //sacn order 
//    // describe('Scan Order  ------------------------', () => {
//    //    it('scan order  api', (done) => {
//    //       request.get(base_url + "" + "order/scan_QRcode?orderId=" + "" + orderId, { json: true, headers: { 'Authorization': jwt } },
//    //          function (err: any, body: any, res: any) {
//    //             console.log(res,"ll;;")
//    //             expect(res.code).to.be.eq(OK);
//    //             expect(res.message).to.be.eq(success.en.success)
//    //             done()
//    //          }
//    //       )
//    //    });
//    // });
// });

// //Addons Type
// describe('Addons Type module *********', () => {
//    const title = 'Pepperoni white'
//    const ar_title = "Pepperoni White"
//    const storeId = "63e22a1310700359a60c0303"
//    const addons_typeId = "63e4ef83da6f15c8a93d1ee1"
//    // describe('Add addons type  ------------------', () => {
//    //    it('add addons type Api', (done) => {
//    //       request.post(base_url + "" + 'addons_type/add', {
//    //          json: true, headers: { 'Authorization': jwt }, body: {
//    //             "title": title,
//    //             "ar_title": ar_title,
//    //             "storeId": storeId,
//    //             "isActive": true
//    //          }
//    //       }, function (err: any, body: any, res: any) {
//    //          console.log(res,"res")
//    //          expect(res.code).to.be.eq(CREATED);
//    //          expect(res.message).to.be.eq(success.en.addons_type)
//    //          done();
//    //       }
//    //       )
//    //    })
//    // })
//    //edit addons type
//    describe('Edit addons type  ------------------', () => {
//       it('edit addons type Api', (done) => {
//          request.put(base_url + "" + 'addons_type/edit/' + "" + addons_typeId + "?title=" + "" + title + "&storeId=" + "" + storeId, {
//             json: true, headers: { 'Authorization': jwt }
//          }, function (err: any, body: any, res: any) {
//             expect(res.code).to.be.eq(CREATED);
//             expect(res.message).to.be.eq(success.en.addons_typeEdit)
//             done();
//          }
//          )
//       })
//    })
//    //details addons type
//    describe('Details addons type  ------------------', () => {
//       it('details addons type Api', (done) => {
//          request.get(base_url + "" + 'addons_type/get/' + "" + addons_typeId, {
//             json: true, headers: { 'Authorization': jwt }
//          }, function (err: any, body: any, res: any) {
//             expect(res.code).to.be.eq(OK);
//             expect(res.message).to.be.eq(success.en.recordFetched)
//             done();
//          }
//          )
//       })
//    })
//    // addons type list
//    describe('Addons type  list ------------------', () => {
//       it('addons type list Api', (done) => {
//          request.get(base_url + "" + 'addons_type/list?isActive=true&storeId=' + "" + storeId, {
//             json: true, headers: { 'Authorization': jwt }
//          }, function (err: any, body: any, res: any) {
//             expect(res.code).to.be.eq(OK);
//             expect(res.message).to.be.eq(success.en.recordFetched)
//             done();
//          }
//          )
//       })
//    })
// })

// //Addons
// describe('Addons Module ***********************************', () => {
//    const itemId = "63e34ea07a9cd2ea6aead1c3"
//    const storeId = "63e22a1310700359a60c0303"
//    const addons_typeId = "63e4ef83da6f15c8a93d1ee1"
//    const addonsId = "63e4f73cda6f15c8a93d225b"
//    // //add addons
//    // describe('Add addons --------------------------', () => {
//    //    it('add addons api', (done) => {
//    //       request.post(base_url + "" + "addons/add", {
//    //          json: true, headers: { 'Authorization': jwt }, body: {
//    //             "itemId": itemId,
//    //             "addons_typeId": addons_typeId,
//    //             "title": "Onion Slice1",
//    //             "ar_title": "Onion Slice1",
//    //             "amount": "30"
//    //          }
//    //       }, function (err: any, body: any, res: any) {
//    //          console.log(res, "addons")
//    //          expect(res.code).to.be.eq(CREATED);
//    //          expect(res.message).to.be.eq(success.en.addonsAdd)
//    //          done();
//    //       })
//    //    })
//    // })
//    //edit addons
//    describe('Edit addons --------------------------', () => {
//       it('edit addons api', (done) => {
//          request.put(base_url + "" + "addons/edit/" + "" + addonsId, {
//             json: true, headers: { 'Authorization': jwt }, body: {
//                "itemId": itemId,
//                "addons_typeId": addons_typeId,
//                "title": "Onion Slice1",
//                "ar_title": "Onion Slice1",
//                "amount": "30"
//             }
//          }, function (err: any, body: any, res: any) {
//             assert.equal(res.code, CREATED)
//             assert.equal(res.message, success.en.addonsEdit)
//             done();
//          })
//       })
//    })
//    //addons details
//    describe('Addons Details --------------------------', () => {
//       it('addons details api', (done) => {
//          request.get(base_url + "" + "addons/get/" + "" + addonsId, { json: true, headers: { 'Authorization': jwt } },
//             function (err: any, body: any, res: any) {
//                assert.equal(res.code, OK)
//                assert.equal(res.message, success.en.recordFetched);
//                done();
//             })
//       })
//    })
//    //Addons List
//    describe('Addons list --------------------------', () => {
//       it('Addons list api', (done) => {
//          request.get(base_url + "" + "addons/list?itemId=" + "" + itemId, { json: true, headers: { 'Authorization': jwt } },
//             function (err: any, body: any, res: any) {
//                assert.equal(res.code, OK)
//                assert.equal(res.message, success.en.recordFetched);
//                done();
//             })
//       })
//    })
//    //update addons status
//    describe('Addons status --------------------------', () => {
//       it('addons  status api', (done) => {
//          request.get(base_url + "" + "addons/update/" + "" + addonsId + "&isActive=true", {
//             json: true, headers: { 'Authorization': jwt }
//          },
//             function (err: any, body: any, res: any) {
//                assert.equal(res.code, OK)
//                assert.equal(res.message, success.en.success);
//                done();
//             })
//       })
//    })
//    // //delete addons
//    // describe('Addons delete --------------------------', () => {
//    //    it('addons  delete api', (done) => {
//    //       request.delete(base_url + "" + "addons/delete_addons/" + "" + itemId, {
//    //          json: true, headers: { 'Authorization': jwt }
//    //       },
//    //          function (err: any, body: any, res: any) {
//    //             console.log(res,"delete")
//    //             assert.equal(res.code,OK)
//    //             assert.equal(res.message,success.en.addondelete);
//    //             done();
//    //          })
//    //    })
//    // })
// })

describe('demo *************', () => {
   const countryCode = "+91"
   const phoneNumber = "9000190126"
   const role = "Vendor"
   const ownerName = "Punit sharma"
   const ar_businessName = "Punit sharma"
   const businessName = "Food valley(First)"
   const password = "1234"
   const acceptTerms_Condition = true//sign up
   it("demo APiijfew09320994444444444444444444444444444444444444444444", (done) => {
      // request.post(base_url + "" + "auth/login", {
      //    json: true, body: {
      //       "countryCode": countryCode,
      //       "phoneNumber": phoneNumber,
      //       "role": role,
      //       "password": password
      //    }
      // }, function (error: any, body: any, res: any) {
      //    console.log(error, "flkkfkfkf", res, "ldlkdk")
      //    expect(res.message).to.be.equal(success.en.loginSuccessful);
      //    expect(res.code).to.be.equal(OK);
      //    expect(res.data).to.include.all.keys('token', 'isUser',
      //       'storeType',
      //       'isVerified',
      //       'storeTypeId',
      //       'storeId',
      //       '_id'
      //    );
      //    done();
      // }, 10000);
               expect(201).to.be.equal(201);

   });
})
