const Ad = require('./../models/Ad')

class AdController {
  async index (req, res) {
    const filters = {}

    if (req.query.price_min || req.query.price_max) {
      filters.price = {}
      if (req.query.price_min) {
        filters.price.$gte = req.query.price_min
      }
      if (req.query.price_max) {
        filters.price.$lte = req.query.price_max
      }
    }

    if (req.query.title) {
      filters.title = RegExp(req.query.title, 'i')
    }

    const ads = await Ad.paginate(filters, {
      limit: 20,
      page: req.query.page || 1,
      sort: '-createdAt',
      populate: ['author']
    })

    return res.json(ads)
  }
  async show (req, res) {
    const ad = await Ad.findById(req.params.id)
    if (!ad) {
      return res.status(404).json()
    }

    return res.json(ad)
  }
  async store (req, res) {
    const ad = await Ad.create({ ...req.body, author: req.userId })
    return res.json(ad)
  }
  async update (req, res) {
    const ad = await Ad.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    })

    return res.json(ad)
  }
  async destroy (req, res) {
    const ad = await Ad.findByIdAndDelete(req.params.id)
    return res.send(ad)
  }
}

module.exports = new AdController()
