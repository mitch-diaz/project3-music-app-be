const express = require("express");
const router = express.Router();
const Video = require("../models/Video.model");
const User = require("../models/User.model");


// ============ ✅ CREATE A VIDEO ============

router.post('/add-video', (req, res ,next) => {
    User.findById(req.session.currentlyLoggedIn._id)
    .then((theUser) => {

        const videoToCreate = {
            videoUrl: req.body.videoUrl,
            videoTitle: req.body.videoTitle,
            user: theUser
        }
        
        console.log({body: req.body, videoToCreate});
        
        Video.create(videoToCreate)
        .then((newlyCreatedVideo) => {
            console.log('NEW VIDEO --->', newlyCreatedVideo)
            User.findByIdAndUpdate(req.session.currentlyLoggedIn._id, {
                $push: {videos: newlyCreatedVideo}
            })
            .then((userVideoList) => {
                res.json(userVideoList)
            })
            .catch((err) => {
                res.json(err)
            });
        })
        .catch((err) => {console.log(err)})
    })
});


// ============ ✅ READ A LIST OF VIDEOS ============

router.get("/video-list", (req, res, next) => {
    Video.find()
	.then((theVideos) => {
        res.json(theVideos);
        console.log('ALL THE SONGS LIST--->', theVideos);
	})
	.catch((err) => {
        res.json(err);
	});
});


// ============ ✅ DISPLAY ONE VIDEO ============

router.get("/:videoId", (req, res, next) => {
	Video.findById(req.params.videoId)
	.then((videoFromDb) => {
        console.log('THE ONE VIDEO--->', videoFromDb)
		res.json(videoFromDb);
	})
	.catch((err) => {
		res.json(err);
	});
});


// ============ ✅ UPDATE A VIDEO ============
    
router.put('/update/:videoId', (req, res ,next) => {      
    Video.findByIdAndUpdate(req.params.videoId, {
        videoTitle: req.body.videoTitle,
        videoUrl: req.body.videoUrl
    })
    .then((response) => {
        res.json(response)
    })
    .catch((err) => {
        console.log(err)
    });
});


// ============ ✅ DELETE A VIDEO ============

router.delete('/delete', (req, res ,next) => {       
    Video.findByIdAndDelete(req.body.videoId)
    .then((theDeletedVideo) => {
        console.log('DELETED VIDEO --->', theDeletedVideo)
        console.log('REQ.SESSION.CURR-LOG-IN --->', req.session.currentlyLoggedIn)
        User.findByIdAndUpdate(req.session.currentlyLoggedIn._id, {
            $pull: {videos: req.body.videoId}
        })
        .then((deleted) => {
            res.json({success: true, res: `Your video has been deleted.`});
            console.log('DELETED-->', deleted);
        })
        .catch((err) => {
            console.log(err);
            res.json(err);
        });
    })
    .catch((err) => {console.log(err)})
});


module.exports = router;
