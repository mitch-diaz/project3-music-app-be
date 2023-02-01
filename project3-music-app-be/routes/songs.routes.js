const express = require("express");
const router = express.Router();
const Song = require("../models/Song.model");
const User = require("../models/User.model");
const fileUploader = require('../config/cloudinary.config');


// ============ CREATE SONG ============
// multi-part form with upload to Cloudinary

router.post('/add-song', fileUploader.single("songFile"), (req, res, next) => {
    User.findById(req.session.currentlyLoggedIn._id)
    .then((theUser) => {

        const songObj = {
        songTitle: req.body.songTitle,
        user: theUser
        } 
        if (req.file) {
            songObj.songFile = req.file.path
        }
                
        Song.create(songObj)
        .then(() => {
            if (!req.file) {
              next(new Error("No file uploaded!"));
              return;
            }
            res.json({ songUpload: req.file.path });
            console.log('songUpload IS -->', songUpload)
          })

            User.findByIdAndUpdate(req.session.currentlyLoggedIn._id, {
                $push: {songs: newlyCreatedSong}
            })
            .then((newUserSong) => {
                res.json(newUserSong)
            })
            .catch((err) => {
                res.json(err)
            });
    })
        .catch((err) => {console.log(err)})
});


// ============ READ A LIST OF SONGS ============

router.get("/songs-list", (req, res, next) => {
    Song.find()
	.then((theSongs) => {
        res.json(theSongs);
        console.log('ALL THE SONGS LIST--->', theSongs);
	})
	.catch((err) => {
        res.json(err);
	});
});


// ============ DISPLAY ONE SONG ============


router.get("/:songId", (req, res, next) => {
	Song.findById(req.params.songId)
	.then((songFromDb) => {
        console.log('THE ONE SONG--->', songFromDb)
		res.json(songFromDb);
	})
	.catch((err) => {
		res.json(err);
	});
});


// ============ UPDATE A SONG (just the song title) ============
    
router.put('/update/:songId', (req, res ,next) => {      
    Song.findByIdAndUpdate(req.params.songId, {
        songTitle: req.body.songTitle
    })
    .then((response) => {
        res.json(response)
    })
    .catch((err) => {
        console.log(err)
    });
});


// ============ ✅ DELETE A SONG ============

router.delete('/delete', (req, res ,next) => {       
    Song.findByIdAndDelete(req.body.songId)
    .then((theDeletedSong) => {
        console.log('DELETED SONG --->', theDeletedSong)
        console.log('REQ.SESSION.CURR-LOG-IN --->', req.session.currentlyLoggedIn)
        User.findByIdAndUpdate(req.session.currentlyLoggedIn._id, {
            $pull: {songs: req.body.songId}
        })
        .then((updatedUserSonglist) => {
            res.json(updatedUserSonglist)
        })
        .catch((err) => {
            console.log(err);
            res.json(err);
        });
    })
    .catch((err) => {console.log(err)})
});


module.exports = router;
