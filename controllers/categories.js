var models = require('../models');
var _ = require('underscore');
var util = require('../utilities');

models.Category.hasMany(models.Post, {as: 'posts', foreignKey: {name: 'category_id', allowNull: false}, onDelete: 'CASCADE'});

module.exports = {
  listAll: function (req, res, callback) {
    models.Category.findAll().success(function (categories) {
      if (callback) {
        callback(categories);
      }
      else {
        res.send(categories);
      }
    });
  },

  getByID: function (req, res) {
    if (req.session.userID === undefined) { return res.send(403); }
    if (!util.isUUID(req.params.id)) { return res.send(401); }

    var options = {where: {id: req.params.id}};
    models.Post.find(options).success(function(category){
      category ? res.send(category) : res.send(404);
    });
  },
  
  create: function (req, res) {
    var category = req.body;
    if (!category.id) { return createCategory(req, res, category); }

    models.Category.find({where: {id: category.id}}).then(function (ret) {
      // returns true if category with id exists
      return !!ret;
    }).then(function (category_exists) {
      if (category_exists){
        // sends 401 if category id exists
        return res.send(401);
      }
      else {
       // creates category otherwise
        createCategory(req, res, category);
      }
    });
  }

};

// Creates user with sepecified fields
function createCategory (req, res, category) {
  if (category.name) {
    models.Category.create(category).then(function(){
      res.status(204).end();
    });
  }
  else {
    res.status(401).end();
  }
}
