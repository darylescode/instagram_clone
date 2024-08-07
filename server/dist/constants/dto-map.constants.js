"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_dto_1 = __importDefault(require("@/domain/dto/user.dto"));
const dtoMap = {
    auth: {
        register: user_dto_1.default,
    },
};
exports.default = dtoMap;
