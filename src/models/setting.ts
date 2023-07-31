import { Schema, model } from 'mongoose';
interface Setting {
    andriodUserAppUrl: String;
    andriodVendorAppUrl: String;
    andriodDoorKeeperAppUrl: String;
    iosUserAppUrl: String;
    iosVendorAppUrl: String;
    iosDoorKeeperAppUrl: String;
    andriodUserVersion: String;
    andriodVendorVersion: String;
    andriodDoorKeeperVersion: String;
    iosUserVersion: String;
    iosVendorVersion: String;
    iosDoorKeeperVersion: String;
    andriodUserUpdate: String;
    andriodVendorUpdate: String;
    andriodDoorKeeperUpdate: String;
    iosUserUpdate: String;
    iosVendorUpdate: String;
    iosDoorKeeperUpdate: String;
}
const schema = new Schema<Setting>({
    andriodUserAppUrl: { type: String, default: '' },
    andriodVendorAppUrl: { type: String, default: '' },
    andriodDoorKeeperAppUrl: { type: String, default: '' },
    iosUserAppUrl: { type: String, default: '' },
    iosVendorAppUrl: { type: String, default: '' },
    iosDoorKeeperAppUrl: { type: String, default: '' },
    andriodUserVersion: { type: String, default: '1.0.1' },
    andriodVendorVersion: { type: String, default: '1.0.1' },
    andriodDoorKeeperVersion: { type: String, default: '1.0.1' },
    iosUserVersion: { type: String, default: '1.0.1' },
    iosVendorVersion: { type: String, default: '1.0.1' },
    iosDoorKeeperVersion: { type: String, default: '1.0.1' },
    andriodUserUpdate: { type: String, default: 'Normal' },
    andriodVendorUpdate: { type: String, default: 'Normal' },
    andriodDoorKeeperUpdate: { type: String, default: 'Normal' },
    iosUserUpdate: { type: String, default: 'Normal' },
    iosVendorUpdate: { type: String, default: 'Normal' },
    iosDoorKeeperUpdate: { type: String, default: 'Normal' },
}, {
    timestamps: true,
    versionKey: false
});
const settingModel = model<Setting>('settings', schema);
export = settingModel 