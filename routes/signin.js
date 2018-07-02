const express = require('express')
const router = express.Router()
const checkNotLogin = require('../middlewares/check').checkNotLogin

// GET /signin 登录页
router.get('/signin', checkNotLogin, function (req, res, next) {
  res.send('登录页')
})

// POST /signin 登录
router.post('/signin', checkNotLogin, function (req, res, next) {
  res.send('登录')
})

module.exports = router
