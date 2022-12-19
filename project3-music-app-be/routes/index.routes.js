const router = require("express").Router();

router.get("/", (req, res, next) => {
  res.json("All good in here --> this is the Landing Page");
});

module.exports = router;
