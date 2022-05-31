'use strict'
const RestaurantController = require('../controllers/RestaurantController')
const OrderController = require('../controllers/OrderController')
const multer = require('multer')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const fs = require('fs')
    fs.mkdirSync(process.env.PRODUCTS_FOLDER, { recursive: true })
    cb(null, process.env.PRODUCTS_FOLDER)
  },
  filename: function (req, file, cb) {
    cb(null, Math.random().toString(36).substring(7) + '-' + Date.now() + '.' + file.originalname.split('.').pop())
  }
})
const upload = multer({ storage: storage }).single('image')

module.exports = (options) => {
  const app = options.app
  app.route('/restaurants')
    .get(
      RestaurantController.index
    )
    .post(
      upload,
      RestaurantController.create
    )
  app.route('/restaurants/{restaurantId}')
    .get(
      RestaurantController.show
    )
    .put(
      upload,
      RestaurantController.update
    )
    .delete(
      RestaurantController.destroy
    )
    .update(
      RestaurantController.update
    )
  // FR 3
  app.route('/restaurants/{restaurantId}/orders')
    .get(
      OrderController.indexRestaurant
    )
  // FR 5
  app.route('/restaurants/:restaurantId/analytics')
    .get(
      OrderController.analytics
    )
  // TODO: Include routes for restaurant described in the lab session wiki page.
}
