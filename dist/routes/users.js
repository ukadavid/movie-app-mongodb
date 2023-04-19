"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userContoller_1 = require("../controller/userContoller");
const router = express_1.default.Router();
router.post("/register", userContoller_1.Register);
router.post("/login", userContoller_1.Login);
router.get("/logout", userContoller_1.Logout);
// router.get("/allusers", getUserAndMovies);
exports.default = router;
