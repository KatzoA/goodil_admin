var mongoose = require('mongoose');
var formidable = require('formidable');
var path = require('path');
var fs = require('fs');

var dealSchema = new mongoose.Schema({
  name: String,
  description: String,
  term: String,
  start_date: {
    type: String,
    required: [true, 'start_date required']
  },
  end_date: {
    type: String,
    required: [true, 'end_date required']
  },
  image: String,
  subCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubCategory'
  },
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop'
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: Date

});

var Deal = {

  model: mongoose.model('Deal', dealSchema),

  uploadDealImage: function(req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
      var file = files.file;
      var tempPath = file.path;
      var targetPath = path.resolve('./public/assets/deals/' + file.name);
      fs.rename(tempPath, targetPath, function(err) {
        if (err) {
          throw err;
        }
        console.log("upload complete for deal: " + file.name);
        return res.json({
          path: 'assets/deals/' + file.name
        });
      });
    });
  },

  createDeal: function(req, res) {
    console.log(req.body);
    Deal.model.create(
      req.body,
      function(err) {
        if (err) {
          res.send(err);
        } else {
          res.sendStatus(200);
        }
      });
  },
  findAllDeals: function(req, res) {
    Deal.model
      .find()
      .populate('shop')
      .populate({
        path: 'subCategory',
        // Get friends of friends - populate the 'friends' array for every friend
        populate: {
          path: 'category'
        }
      })
      // .populate('subCategory')
      .exec(function(err, deal) {
        if (!err) {
          res.send(deal);
        } else {
          res.send(err);
        }
      });
  },
  findAllDealsInSubCategory: function(req, res) {
    Deal.model
      .find({
        subCategory: req.params.subCategory
      }, function(err, deal) {
        if (!err) {
          res.send(deal);
        } else {
          res.send(err);
        }
      });
  },
  findAllDealsInShop: function(req, res) {
    Deal.model
      .find({
        shop: req.params.shop
      }, function(err, deal) {
        if (!err) {
          console.log(deal);
          res.send(deal);
        } else {
          res.send(err);
        }
      });
  },
  updateDeal: function(req, res) {
    console.log(req.body);
    Deal.model.findByIdAndUpdate(req.params.id, {
      $set: req.body
    }, function(err) {
      if (err) {
        res.send(err);
      } else {
        res.sendStatus(200);
      }
    });
  },
  deleteDeal: function(req, res) {
    Deal.model.findByIdAndRemove(req.params.id, function(err) {
      if (err) {
        res.send(err);
      } else {
        res.sendStatus(200);
      }
    });
  }
};
module.exports = Deal;
