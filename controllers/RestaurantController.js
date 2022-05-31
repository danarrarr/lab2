'use strict'
const models = require('../models')
const Restaurant = models.Restaurant

exports.index = async function (req, res) {
  try {
    const restaurants = await Restaurant.findAll()
    res.json(restaurants)
  } catch (err) {
    res.status(500).send(err)
  }
}

exports.indexOwner = async function (req, res) {
  try {
    const restaurants = await Restaurant.findAll({
      where: {
        restaurantId: req.user.userId
      }
    })
    res.json(restaurants)
  } catch (err) {
    res.status(404).send(err)
  }
}

exports.create = async function (req, res) {
  const newRestaurant = Restaurant.build(req.body)
  newRestaurant.userId = 1 // authenticated user
  if (typeof req.files?.heroImage !== 'undefined') {
    newRestaurant.heroImage = req.files.heroImage[0].path
  }
  if (typeof req.files?.logo !== 'undefined') {
    newRestaurant.logo = req.files.logo[0].path
  }
  try {
    const restaurant = await newRestaurant.save()
    res.json(restaurant)
  } catch (err) {
    if (err.name.includes('ValidationError')) {
      res.status(422).send(err)
    } else {
      res.status(500).send(err)
    }
  }
}

exports.show = async function (req, res) {
  try {
    const restaurant = await Restaurant.findByPk(req.params.restaurantId,
      {
        include: [
          {
            model: Restaurant,
            as: 'restaurants'
          }
        ]
      })
    res.json(restaurant)
  } catch (err) {
    res.status(404).send(err)
  }
}

// Implement below, the update and destroy functions as well
