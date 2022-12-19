const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const Song = require("../models/Song.model")
const Video = require("../models/Video.model")
const fileUploader = require('../config/cloudinary.config');


// ============ ✅ USER PROFILE PAGE ============

router.get('/user-profile', (req, res, next) => {
    User.findById(req.session.currentlyLoggedIn._id)
    .populate('songs')
    .populate('videos')
    .then(response => {
        res.json(response);
        console.log('The User Profile--->', response);
    })
    .catch(err => {
        console.log({err});
    });
  });
  
  
  // ============ ✅ UPDATE USER PROFILE (text info only) =============
  
  // router.put('/update/:userId', (req, res, next) => {
  //     User.findByIdAndUpdate(req.params.userId, {
  //         firstName: req.body.firstName,
  //         lastName: req.body.lastName,
  //         creatorTitle: req.body.creatorTitle,
  //         creatorProfile: req.body.creatorProfile,
  //         // imageUrl: req.body.imageUrl,
  //     })
  //     .then((updatedUserProfile) => {
  //         res.json(updatedUserProfile);
  //         console.log('UPDATED USER PROFILE --> ', updatedUserProfile);
  //     })
  //     .catch((err) => {
  //       console.log({err});
  //     })
  // })
  
  // ============ ✅ USER PROFILE + FILE UPLOAD FOR PICTURE ===========
  // PUT "/update/:userId" => Route that receives the image, sends it to Cloudinary via the fileUploader and returns the image URL
  router.put('/update/:userId', fileUploader.single("imageFile"), (req, res, next) => {
    console.log("FILE UPLOAD IS -->", req.file)
    const updateObj = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      creatorTitle: req.body.creatorTitle,
      creatorProfile: req.body.creatorProfile,
    } 
    if (req.file) {
      updateObj.imageUrl = req.file.path
    }
    
    User.findByIdAndUpdate(req.params.userId, updateObj)
    .then(() => {
      if (!req.file) {
        next(new Error("No file uploaded!"));
        return;
      }
      res.json({ theImageUrl: req.file.path });
      console.log('theImageFile IS -->', theImageFile)
    })
    .catch((err) => {
      console.log({err});
    })
  });
  
  
  // ============ ✅ DELETE USER PROFILE/ACCT =============
  
  router.delete('/delete', (req, res, next) => {
      User.findByIdAndDelete(req.body.userId)
      .then((deletedUser) => {
          res.json({success: true, res: `Your account has been deleted permenently!`});
          console.log('DELETED USER -->', deletedUser);
      }).catch(err => {
          res.json({success: false, res: err});
      })
  });


  module.exports = router;
