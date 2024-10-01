"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const async_wrapper_util_1 = __importDefault(require("@/application/utils/async-wrapper.util"));
const chat_service_impl_1 = __importDefault(require("@/application/services/chat/chat.service.impl"));
const user_repository_impl_1 = __importDefault(require("@/infrastructure/repositories/user.repository.impl"));
const chat_controller_1 = __importDefault(require("@/presentation/controllers/chat.controller"));
const chat_repository_impl_1 = __importDefault(require("@/infrastructure/repositories/chat.repository.impl"));
const validate_uuid_body_validation_1 = __importDefault(require("../validations/validate-uuid-body.validation"));
const validate_uuid_params_validation_1 = __importDefault(require("../validations/validate-uuid-params.validation"));
const router = express_1.default.Router();
const wrap = new async_wrapper_util_1.default();
const controller = new chat_controller_1.default(new chat_service_impl_1.default(new chat_repository_impl_1.default(), new user_repository_impl_1.default()));
router
    .route("/:uuid")
    .all((0, validate_uuid_params_validation_1.default)("uuid"), (0, validate_uuid_body_validation_1.default)("messageIds"))
    .post(wrap.asyncErrorHandler(controller.getChatMessages))
    .delete(wrap.asyncErrorHandler(controller.deleteConversationById));
router
    .route("/:userUuid/conversations")
    .all((0, validate_uuid_params_validation_1.default)("userUuid"), (0, validate_uuid_body_validation_1.default)("conversationIds"))
    .post(wrap.asyncErrorHandler(controller.getChatHistory));
router
    .route("/")
    .all((0, validate_uuid_body_validation_1.default)([
    "senderUuid",
    "receiverUuid"
]))
    .post(wrap.asyncErrorHandler(controller.newMessageAndConversation));
exports.default = router;
