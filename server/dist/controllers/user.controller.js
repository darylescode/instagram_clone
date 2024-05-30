"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const async_wrapper_util_1 = __importDefault(require("@/utils/async-wrapper.util"));
class UsersController {
    userService;
    followService;
    searchHistoryService;
    wrap = new async_wrapper_util_1.default();
    constructor(userService, followService, searchHistoryService) {
        this.userService = userService;
        this.followService = followService;
        this.searchHistoryService = searchHistoryService;
    }
    getUserData = this.wrap.apiWrap(async (req, res, next) => {
        let user;
        const uuid = req.body.uuid;
        const person = req.query.person || "";
        if (person) {
            user = await this.userService.getUserByUsername(person);
        }
        else {
            user = await this.userService.getUserById(uuid);
        }
        res.status(200).send({ user });
    });
    searchUsersByQuery = this.wrap.apiWrap(async (req, res, next) => {
        const search = req.query.search;
        const users = await this.userService.searchUserByFields(search);
        res.status(200).send({ users });
    });
    deleteUser = this.wrap.apiWrap(async (req, res, next) => {
        const user_id = req.params.user_id;
        const message = await this.userService.deleteUserById(user_id);
        res.status(200).send(message);
    });
    getFollowStats = this.wrap.apiWrap(async (req, res, next) => {
        const user_id = req.params.user_id;
        const stats = await this.followService.getFollowStats(user_id);
        res.status(200).send(stats);
    });
    getFollowerFollowingLists = this.wrap.apiWrap(async (req, res, next) => {
        const user_id = req.params.user_id;
        const fetch = req.query.fetch;
        const listsId = req.body.listsId;
        const users = await this.followService.getFollowerFollowingLists(user_id, fetch, listsId);
        res.status(200).send(users);
    });
    toggleFollow = this.wrap.apiWrap(async (req, res, next) => {
        const user_id = req.params.user_id;
        const followed_id = req.params.followed_id;
        const message = await this.followService.toggleFollow(user_id, followed_id);
        res.status(200).send(message);
    });
    getSearchHistory = this.wrap.apiWrap(async (req, res, next) => {
        const searcher_uuid = req.params.searcher_uuid;
        const searches = await this.searchHistoryService
            .getUsersSearchHistoryById(searcher_uuid);
        res.status(200).send(searches);
    });
    saveRecentSearches = this.wrap.apiWrap(async (req, res, next) => {
        const searcher_uuid = req.params.searcher_uuid;
        const search_uuid = req.params.search_uuid;
        const message = await this.searchHistoryService.saveUsersSearch(searcher_uuid, search_uuid);
        res.status(200).send(message);
    });
    removeRecentSearches = this.wrap.apiWrap(async (req, res, next) => {
        const uuid = req.params.uuid;
        const message = await this.searchHistoryService
            .removeRecentSearchesById(uuid);
        res.status(200).send(message);
    });
}
;
exports.default = UsersController;
