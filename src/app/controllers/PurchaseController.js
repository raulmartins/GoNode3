const Ad = require('../models/Ad')
const User = require('../models/User')
const Purchase = require('../models/Purchase')
const jobs = require('../jobs')
const Queue = require('../services/Queue')

class PurchaseController {
  async store (req, res) {
    const { ad, content } = req.body
    const purchaseAd = await Ad.findById(ad).populate('author')
    const user = await User.findById(req.userId)

    if (!purchaseAd) return res.status(404).json()

    await Purchase.create({ ad: purchaseAd._id, content })
    Queue.create(jobs.PurchaseMail.key, {
      ad: purchaseAd,
      user,
      content
    }).save()

    res.send()
  }

  async index (req, res) {
    const filters = {}
    const purchase = await Purchase.paginate(filters, {
      limit: 20,
      page: req.query.page || 1,
      sort: '-createdAt',
      populate: ['ad']
    })

    return res.json(purchase)
  }

  async sold (req, res) {
    const id = req.params.id
    await Ad.findByIdAndDelete(id)
    return res.status(200).json({ Message: 'Item sold with success' })
  }
}

module.exports = new PurchaseController()
