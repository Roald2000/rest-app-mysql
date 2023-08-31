const createHttpError = require("http-errors");
const jwt = require("jsonwebtoken");
const { BlackList } = require("./models/model.user");

const secret_key = process.env.secret_key;
const secret_key_life = process.env.secret_key_life;

const Service = {
  JWT: {
    generateToken: function (payload) {
      try {
        return jwt.sign({ user: payload }, secret_key ?? "secret-key", {
          expiresIn: secret_key_life ?? "1 day",
        });
      } catch (error) {
        throw error;
      }
    },
    verifyToken: function (token) {
      try {
        if (!token) {
          throw createHttpError.Forbidden(`Invalid token, ${token}`);
        } else {
          const verified = jwt.verify(token, secret_key);
          if (verified.exp < Date.now() / 1000) {
            throw createHttpError.Forbidden("Invalid token, expired");
          } else {
            return verified.user;
          }
        }
      } catch (error) {
        throw error;
      }
    },
    authMiddleWare: async function (req, res, next) {
      try {
        let token = req.headers.authorization;
        if (!token) {
          throw createHttpError.Forbidden(`Invalid token, ${token}`);
        } else {
          token =
            token.split(" ")[0] === "Bearer" ? token.split(" ")[1] : token;

          const isBlacklisted = await BlackList.findOne({
            where: { token: token },
          });

          if (isBlacklisted ?? isBlacklisted?.dataValues) {
            throw createHttpError.Forbidden("Invalid token, access denied");
          } else {
            const user = this.verifyToken(token);
            req.user = user;
            next();
          }
        }
      } catch (error) {
        next(error);
      }
    },
  },
  // Other: {}
};

module.exports = {
  ...Service,
};
