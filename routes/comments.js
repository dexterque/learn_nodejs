const express = require('express')
const router = express.Router()
const checkLogin = require('../middlewares/check').checkLogin

// POST /comments 创建一条留言
router.post('/comments', checkLogin, function (res, req, next) {
  res.send('创建留言')
})

// GET /comments/:commentId/remove
router.get('/:commentId/remove', checkLogin, function (res, req, next) {
  res.send('删除留言')
})

module.exports = router
