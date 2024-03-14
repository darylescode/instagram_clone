"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const exception_1 = __importDefault(require("../exception/exception"));
const errorHandler = (err, req, res, next) => {
    if (err instanceof exception_1.default) {
        const { status, message } = err;
        return res.status(status).send({ message });
    }
    res.status(500).send({ message: "Something went wrong" });
};
exports.errorHandler = errorHandler;
