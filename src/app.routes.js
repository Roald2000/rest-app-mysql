const router = require("express").Router();

router.use("/user", require("./routes/route.user"));

module.exports = router;
