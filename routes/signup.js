const fs = require('fs')
const path = require('path')
const sha1 = require('sha1')
const express = require('express')
const router = express.Router()

const UserModel = require('../models/users')
const checkNotLogin = require('../middlewares/check').checkNotLogin

// GET /signup 注册页
router.get('/', checkNotLogin, function (req, res, next) {
  res.render('signup')
})

// POST /signup 注册
router.post('/', checkNotLogin, function (req, res, next) {
  const name = req.fields.name
  const gender = req.fields.gender
  const bio = req.fields.bio
  const avatar = req.fields.avatar.path.split(path.sep).pop()
  let password = req.fields.password
  const repassword = req.fields.repassword

  // 校验数据
  try {
    if (!(name.length >= 1 && name.length <= 10)) {
      throw new Error('名字请限制在1到10个字符')
    }
    if (['f', 'm', 'x'].indexOf(gender) === -1) {
      throw new Error('性别只能是 f, m , x')
    }
    if (!(bio.length >= 1 && bio.length <= 30)) {
      throw new Error('个人简介在30字以内')
    }
    if (!req.file.avatar.name) {
      throw new Error('缺少头像')
    }
    if (password.length < 6) {
      throw new Error('密码至少6个字符')
    }
    if (password !== repassword) {
      throw new Error('两次密码不一致')
    }
  } catch (e) {
    // 注册失败
    fs.unlink(req.file.avatar.path)
    req.flash('error', '注册失败')
    return res.redirect('/signup')
  }

  // 明文密码加密
  password = sha1(password)

  // 待写入数据库的用户信息
  let user = {
    name: name,
    password: password,
    gender: gender,
    bio: bio,
    avatar: avatar
  }
  // 用户信息写入数据库
  UserModel.create(user)
    .then(function (result) {
      // 此user是插入mongodb后的值，包含_id
      user = result.ops[0]
      // 删除密码，将用户信息存入session
      delete user.password
      req.session.user = user
      // 写入flash
      req.flash('success', '注册成功')
      // 跳转到首页
      res.redirect('/posts')
    })
    .catch(function (e) {
      // 注册失败，异步删除上传头像
      fs.unlink(req.file.avatar.path)
      // 用户名被占用，跳转到注册页
      if (e.message.match('duplicate key')) {
        return res.redirect('/signup')
      }
      next(e)
    })
})

module.exports = router
