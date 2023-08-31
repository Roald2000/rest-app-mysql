const bcryptjs = require("bcryptjs");
const { User } = require("../models/model.user");
const createHttpError = require("http-errors");
const { createResponse } = require("../app.helper");
const { JWT } = require("../app.service");

module.exports = {
  login: async function (req, res, next) {
    try {
      const { username, password } = req.body;

      const findUsername = await User.findOne({
        where: { username: username },
      });

      if (!findUsername) {
        throw createHttpError.NotFound("Invalid Username/Password");
      } else {
        const checkPassword = bcryptjs.compareSync(
          password,
          findUsername?.dataValues.password
        );
        if (!checkPassword) {
          throw createHttpError.BadRequest("Invalid Username/Password");
        } else {
          createResponse(res, 200, {
            message: "Login Success!",
            token: JWT.generateToken(findUsername?.username ?? username),
          });
        }
      }
    } catch (error) {
      next(error);
    }
  },
  register: async function (req, res, next) {
    try {
      const { username, password } = req.body;
      if (!username) {
        throw createHttpError.BadRequest("Invalid Username");
      }
      if (!password) {
        throw createHttpError.BadRequest("Invalid Password");
      }
      const checkUser = await User.findAll({ where: { username: username } });
      if (checkUser.length !== 0) {
        throw createHttpError.Conflict("Invalid Username / Password");
      } else {
        const buildData = User.build({
          username: username,
          password: password,
        });
        const isCreated = await buildData.save();
        isCreated &&
          createResponse(res, 201, { message: "User Register Success" });
      }
    } catch (error) {
      next(error);
    }
  },
};
