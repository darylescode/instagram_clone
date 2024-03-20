"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DatabaseException {
    constructor(errno, code, sqlState, sqlMessage, sql, node) {
        this.errorCode = errno;
        this.message = sqlMessage;
        this.errorType = code;
        this.state = sqlState;
        this.query = sql;
        this.node = node;
    }
    static fromError(error) {
        return new DatabaseException(error.errno, error.code, error.sqlState, error.sqlMessage, error.sql, error.node);
    }
}
exports.default = DatabaseException;
