const Users = require('../models/userModel')
const Reports = require('../models/reportModel')

const userCtrl = {
  getAllUsers: async (req, res) => {
    try {
      const users = await Users.find({})
      res.setHeader('Access-Control-Expose-Headers', 'Content-Range')
      res.setHeader(
        'Content-Range',
        `user 0-${users.length - 1}/${users.length}`
      )
      res.json(users.map((user) => ({ ...user, id: user._id })))
    } catch (err) {
      return res.status(500).json({ msg: err.message })
    }
  },
  searchUser: async (req, res) => {
    try {
      const users = await Users.find({$or:[
        {username: { $regex: req.query.username}},
        {fullname:  req.query.username}
        ]})
        .limit(10)
        .select('fullname username avatar')

      res.json({ users })
    } catch (err) {
      return res.status(500).json({ msg: err.message })
    }
  },
  getUser: async (req, res) => {
    try {
      const user = await Users.findById(req.params.id)
        .select('-password')
        .populate('followers following reports', '-password')
      if (!user) return res.status(400).json({ msg: 'User does not exist.' })

      res.json({ user, id: user._id })
    } catch (err) {
      return res.status(500).json({ msg: err.message })
    }
  },
  updateUser: async (req, res) => {
    try {
      const { avatar, fullname, mobile, address, story, website, gender } =
        req.body
      if (!fullname)
        return res.status(400).json({ msg: 'Please add your full name.' })

      await Users.findOneAndUpdate(
        { _id: req.user._id },
        {
          avatar,
          fullname,
          mobile,
          address,
          story,
          website,
          gender,
        }
      )

      res.json({ msg: 'Update Success!' })
    } catch (err) {
      return res.status(500).json({ msg: err.message })
    }
  },
  follow: async (req, res) => {
    try {
      const user = await Users.find({
        _id: req.params.id,
        followers: req.user._id,
      })
      if (user.length > 0)
        return res.status(500).json({ msg: 'You followed this user.' })

      const newUser = await Users.findOneAndUpdate(
        { _id: req.params.id },
        {
          $push: { followers: req.user._id },
        },
        { new: true }
      ).populate('followers following', '-password')

      await Users.findOneAndUpdate(
        { _id: req.user._id },
        {
          $push: { following: req.params.id },
        },
        { new: true }
      )

      res.json({ newUser })
    } catch (err) {
      return res.status(500).json({ msg: err.message })
    }
  },
  unfollow: async (req, res) => {
    try {
      const newUser = await Users.findOneAndUpdate(
        { _id: req.params.id },
        {
          $pull: { followers: req.user._id },
        },
        { new: true }
      ).populate('followers following', '-password')

      await Users.findOneAndUpdate(
        { _id: req.user._id },
        {
          $pull: { following: req.params.id },
        },
        { new: true }
      )

      res.json({ newUser })
    } catch (err) {
      return res.status(500).json({ msg: err.message })
    }
  },
  suggestionsUser: async (req, res) => {
    try {
      const newArr = [...req.user.following, req.user._id]

      const num = req.query.num || 10

      const users = await Users.aggregate([
        { $match: { _id: { $nin: newArr } } },
        { $sample: { size: Number(num) } },
        {
          $lookup: {
            from: 'users',
            localField: 'followers',
            foreignField: '_id',
            as: 'followers',
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'following',
            foreignField: '_id',
            as: 'following',
          },
        },
      ]).project('-password')
      console.log(users)
      return res.json({
        users,
        result: users.length,
      })
    } catch (err) {
      return res.status(500).json({ msg: err.message })
    }
  },
  reportUser: async (req, res) => {
    try {
      console.log(req.body)
      const newReport = new Reports({ reason: req.body.reason })
      newReport.save()
      const updatedUser = await Users.findOneAndUpdate(
        { _id: req.params.id },
        {
          $push: { reports: newReport._id },
        },
        { new: true }
      )
      res.json({ msg: 'User reported' })
    } catch (err) {
      return res.status(500).json({ msg: err.message })
    }
  },
  toggleBanUser: async (req, res) => {
    const findUser = await Users.findOne(
      { _id: req.params.id },
      function (err, user) {
        user.banned = !user.banned
        user.save(function (err, updatedUser) {
          if (err) {
            res.status(500).json({ msg: err.message })
          } else {
            res.json(updatedUser)
          }
        })
      }
    )
  },
}

module.exports = userCtrl
