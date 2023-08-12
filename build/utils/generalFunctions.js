"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toUnixDateTime = void 0;
const toUnixDateTime = (datetime) => {
    const unixTimestamp = Math.floor(datetime.getTime() / 1000);
    return unixTimestamp;
};
exports.toUnixDateTime = toUnixDateTime;
