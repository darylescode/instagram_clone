"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_service_impl_1 = __importDefault(require("@/services/user/user.service.impl"));
const user_repository_impl_1 = __importDefault(require("@/repositories/user/user.repository.impl"));
const user_controller_1 = __importDefault(require("@/controllers/user.controller"));
const follow_repository_impl_1 = __importDefault(require("@/repositories/follow/follow.repository.impl"));
const recent_search_repository_impl_1 = __importDefault(require("@/repositories/recent-search/recent-search.repository.impl"));
const router = express_1.default.Router();
const controller = new user_controller_1.default(new user_service_impl_1.default(new user_repository_impl_1.default(), new follow_repository_impl_1.default(), new recent_search_repository_impl_1.default()));
router.get("/", controller.getUserData);
router.get("/lists", controller.searchUsersByQuery);
router.get("/:user_id/follows/stats", controller.getFollowStats);
router.get("/:user_id/recent-searches", controller.getRecentSearches);
router.post("/:user_id/lists", controller.getFollowerFollowingLists);
router.post("/:user_id/follows/:followed_id", controller.toggleFollow);
router.post("/:user_id/recent-searches/:searched_id", controller.saveRecentSearches);
router.delete("/recent-searches/:recent_id", controller.removeRecentSearches);
router.delete("/:user_id/", controller.deleteUser);
exports.default = router;
