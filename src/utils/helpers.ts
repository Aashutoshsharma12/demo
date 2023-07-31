import axios from 'axios';
import moment from 'moment-timezone';

// var FCM = require('fcm-node');
// var serverKey = 'AAAAP3x64_g:APA91bHY-QPSRxqyu-oVLCWvuX1fxwSFyvHQgcRf2ZqJSb0HCfa3_6QlD3Cmxc1-0XUHDrDxjIWk6RUpvE_BtAIPPvwQ_4-V44RGhVZP__geX3uzygpxEfAk7GItxaolCI9HE3LYp7lf';
// var fcm = new FCM(serverKey);


function identityGenerator(count: number, padding: string) {
    var c = count + 1;
    var str = "" + c;
    var pad = "0000";
    var ans = pad.substring(0, pad.length - str.length) + str;
    var m = new Date();
    var mm = m.getMonth() + 1;
    var yy = m.getFullYear();
    var dd = m.getDate();
    // var ss = m.getSeconds();
    if (mm >= 10) {
        var mm1: any = mm
    } else {
        var mm1: any = 0 + "" + mm
    }
    if (dd >= 10) {
        var dd1: any = dd
    } else {
        var dd1: any = 0 + "" + dd
    }
    var theID = (padding + "" + yy + "" + mm1 + "" + dd1 + "" + ans);
    return theID
}

function sendPushNotification(data: any) {
    var FCM = require('fcm-node');
    var serverKey = process.env.FCM_KEY;
    var fcm = new FCM(serverKey);
    var tokens = data.deviceToken
    if(tokens){
        if (tokens.length != 0) {
            for (let i = 0; i < tokens.length; i++) {
                let notification = {
                    title: data.title,
                    body: data.description,
                    image:data.image ? data.image : ''
                }
                var message: any = {
                    to: tokens,
                    ...notification,
                    ...data
                };
                console.log(message,";ll")
                fcm.send(message, function (err: any, response: any) {
                    if (err) {
                        console.log("Something has gone wrong in sending push!", err);
                    } else {
                        console.log("Successfully sent with response: ", response);
                    }
                });
            }
        }
        else{
            let notification = {
                title: data.title,
                body: data.description
                // sound: 'https://res.cloudinary.com/tecorbssvan/video/upload/v1650879605/sounds/mixkit-happy-bells-notification-937_hghli0.wav',
            }
            var message: any = {
                to: tokens,
                ...notification,
                ...data
            };
            fcm.send(message, function (err: any, response: any) {
                if (err) {
                    console.log("Something has gone wrong in sending push!", err);
                } else {
                    console.log("Successfully sent with response: ", response);
                }
            });
        }
    }   
}

function getDaysArray(start:any, end:any) {
    for(var arr=[],dt=new Date(start); dt<=new Date(end); dt.setDate(dt.getDate()+1)){
        arr.push(new Date(dt));
    }
    return arr;
};

function getMonthsArray(startDate: any, endDate: any) {
    var start      = startDate.split('-');
    var end        = endDate.split('-');
    var startYear  = parseInt(start[0]);
    var endYear    = parseInt(end[0]);
    var dates      = [];
  
    for(var i = startYear; i <= endYear; i++) {
      var endMonth = i != endYear ? 11 : parseInt(end[1]) - 1;
      var startMon = i === startYear ? parseInt(start[1])-1 : 0;
      for(var j = startMon; j <= endMonth; j = j > 12 ? j % 12 || 11 : j+1) {
        var month = j+1;
        var displayMonth = month < 10 ? '0'+month : month;
        dates.push({
            year: i,
            month: displayMonth
        });
      }
    }
    return dates;
}

export {
    identityGenerator,
    sendPushNotification,
    getDaysArray,
    getMonthsArray
}