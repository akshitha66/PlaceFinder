const express =  require("express");
const router = express.Router({mergeParams : true});
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const{listingSchema} = require("../schema.js");
const Review = require("../models/review.js");
const {validateReview, isLoggedIn, isreviewAuthor} = require("../middleware.js");

//require for Review controller
const reviewController = require("../controllers/reviews.js");

//REVIEWS
//POST Route for reviews
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

// Delete Route for reviews
router.delete("/:reviewId", isLoggedIn, isreviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;