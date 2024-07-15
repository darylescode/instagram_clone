"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_details_model_1 = __importDefault(require("../models/user-details.model"));
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class UserDto extends user_details_model_1.default {
    id;
    uuid;
    email;
    password;
    roles;
    created_at;
    constructor(id, uuid, username, email, password, first_name, last_name, age, roles, avatar_url, birthday, created_at) {
        super(username, first_name, last_name, avatar_url, age, birthday);
        this.id = id;
        this.uuid = uuid;
        this.email = email;
        this.password = password;
        this.roles = roles;
        this.created_at = created_at;
    }
    // Getters
    getId() {
        return this.id;
    }
    getUuid() {
        return this.uuid;
    }
    getUsername() {
        return this.username;
    }
    getEmail() {
        return this.email;
    }
    getRoles() {
        return this.roles;
    }
    getPassword() {
        return this.password;
    }
    getAvatar() {
        return this.avatar_url;
    }
    getCreatedAt() {
        return this.created_at;
    }
    // Setters
    setId(value) {
        this.id = value;
    }
    setUuid(value) {
        this.uuid = value;
    }
    setUsername(value) {
        this.username = value;
    }
    setEmail(value) {
        this.email = value;
    }
    setPassword(value) {
        this.password = value;
    }
    setRoles(value) {
        this.roles = value;
    }
    setFirstName(value) {
        this.first_name = value;
    }
    setLastName(value) {
        this.last_name = value;
    }
    setAge(value) {
        this.age = value;
    }
    setAvatar(value) {
        this.avatar_url = value;
    }
    setBirthday(value) {
        this.birthday = value;
    }
    setCreatedAt(value) {
        this.created_at = value;
    }
}
__decorate([
    (0, class_transformer_1.Exclude)({ toPlainOnly: true }),
    __metadata("design:type", Number)
], UserDto.prototype, "id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], UserDto.prototype, "uuid", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsEmail)({}, { message: "invalid email" }),
    __metadata("design:type", String)
], UserDto.prototype, "email", void 0);
__decorate([
    (0, class_transformer_1.Exclude)({ toPlainOnly: true }),
    (0, class_validator_1.Length)(6, 100, { message: "password must be at least 6 characters" }),
    __metadata("design:type", String)
], UserDto.prototype, "password", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)({ message: "Roles must be a string" }),
    (0, class_validator_1.IsIn)(["user", "admin"], { message: "invalid role" }),
    __metadata("design:type", Object)
], UserDto.prototype, "roles", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UserDto.prototype, "created_at", void 0);
exports.default = UserDto;
