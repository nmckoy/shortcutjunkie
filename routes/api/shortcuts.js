var express = require('express');
var router = express.Router();

//Set up Mongo
var Mongoose = require('mongoose');
var db = Mongoose.createConnection('localhost', 'mytestapp');

var ShortcutSchema = require('../../models/Shortcut.js').ShortcutSchema;
var Shortcut = db.model('shortcut', ShortcutSchema);


/* GET all shortcut listings. */
router.get('/', function(req, res) {
    Shortcut.find({}, function(error, shortcuts) {
        res.send({
            title: 'shortcut page',
            shortcuts: shortcuts
        });
    });
});

/* POST new shortcut. listing */
router.post('/', function(req, res) {
    var newShortcut = new Shortcut(req.body);
    newShortcut.save(function(error, newShortcut) {
        if (error || !newShortcut) {
            res.json({
                error: error
            });
        } else {
            res.send(newShortcut);
        }
    })
});

/* PUT update shortcut listing. */
router.put('/', function(req, res) {
    var requestShortcut = req.body;
    Shortcut.findOne({
        _id: req.param('id')
    }, function(error, shortcut) {
        if (error || !shortcut) {
            res.json({
                error: error
            });
        } else {
            shortcut.application = requestShortcut.application,
            shortcut.operatingSystem = requestShortcut.operatingSystem,
            shortcut.keyset = requestShortcut.keyset,
            shortcut.description = requestShortcut.description
            shortcut.save(function(error, shortcut) {
                if (error || !shortcut) {
                    res.json({
                        error: error
                    });
                } else {
                    res.send(shortcut);
                }
            })
        }
    })
});

/* DELETE shortcut listing. */
router.delete('/', function(req, res) {
    var requestShortcut = req.body;
    Shortcut.findOne({
        _id: req.param('id')
    }, function(error, shortcut) {
        if (error || !shortcut) {
            res.json({
                error: error
            });
        } else {
            shortcut.remove(function(error, shortcut) {
                if (error || !shortcut) {
                    res.json({
                        error: error
                    });
                } else {
                	//TODO add a message for successfully deleting the shortcut 
                    res.send('successfully deleted shortcut');
                }
            })
        }
    })
});


module.exports = router;