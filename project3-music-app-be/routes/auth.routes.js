const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const bcryptjs = require('bcryptjs');
const fileUploader = require('../config/cloudinary.config');


// =============== ✅ SIGNUP ===============

router.post('/signup', (req, res, next)=>{
  const saltRounds = 12;
  bcryptjs
  .genSalt(saltRounds)
  .then(salt => bcryptjs.hash(req.body.password, salt))
  .then(hashedPassword => {
    User.create({
      email: req.body.email,
      password: hashedPassword,
    })
    .then((newUser)=>{
      res.json({message: "Successfully signed up new account"});
    })
    .catch((err)=>{
      res.json(err)
    })
  })
});


// ============= ✅ LOGIN =============

router.post('/login', (req, res, next) => {
  if (req.body.email === '' || req.body.password === '') {
    res.json({error: "fields cannot be left blank"})
    return;
  }
 
  User.findOne({ email: req.body.email })
    .then(resultFromDB => {
      if (!resultFromDB) {
        res.json({error: "Your email or password is not correct"});
        return;
      } else if (bcryptjs.compareSync(req.body.password, resultFromDB.password)) {
        req.session.currentlyLoggedIn = resultFromDB;
        res.json({message: "Successfully logged in"});
        return;
      } else {
        res.json({error: "Your email or password is not correct"});
      }
    })
    .catch(error => console.log(error));
});


function serializeTheUserObject(userObj){
  let result = {};
  if(userObj.email) result.email = userObj.email;
  if(userObj._id) result._id = userObj._id;
  return result;
}

router.get('/serializeuser', (req, res, next)=>{
  console.log(req.session);
  console.log(req.session.currentlyLoggedIn);

  if(!req.session.currentlyLoggedIn) 
    res.json(null);
  
    User.findById(req.session.currentlyLoggedIn._id)
    .then((theUser)=>{
      res.json(serializeTheUserObject(theUser))
    })
    .catch((err)=>{
      console.log(err)
    })
})


// ============= ✅ LOGOUT =============

router.post('/logout', (req, res, next) =>{
  req.session.destroy(err => {
    if (err) console.log(err);
    res.json({message: "Successfully logged out"});
  });
})






// ============ ✅ USER PROFILE PAGE ============

router.get('/user-profile', (req, res, next) => {
  User.findById(req.session.currentlyLoggedIn)
  .then(userFromDB => {
      res.json(userFromDB);
      console.log('The User Profile--->', userFromDB);
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
    updateObj.imageFile = req.file.path
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
