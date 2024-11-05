const express =  require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const{reviewSchema} = require("../schema.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });


//require for Listing controller
const ListingController = require("../controllers/listing.js");

//Restructuring routes
//combining index and create routes since they start "/"
router
 .route("/")
 .get(wrapAsync(ListingController.index))
 .post(isLoggedIn, upload.single('listing[image]'),  validateListing, wrapAsync(ListingController.createListing)
 );

 //New Route
router.get("/new", isLoggedIn, ListingController.renderNewForm);

 //combining show, update, delte routes since they start "/:id"
 router
 .route("/:id")
 .get(wrapAsync(ListingController.showListing))
 .put(isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(ListingController.updateListing))
 .delete(isLoggedIn, isOwner, wrapAsync(ListingController.destroyListing)
);
//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(ListingController.renderEditForm));

module.exports = router;

//Index route
/*router.get("/", wrapAsync(ListingController.index) );*/

//Show Route
/*router.get("/:id", wrapAsync(ListingController.showListing));*/

//Create Route
/*router.post("/", isLoggedIn, validateListing, wrapAsync(ListingController.createListing));*/

//Update Route
/*router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(ListingController.updateListing));*/

//Delete Route
/*router.delete("/:id", isLoggedIn, isOwner, wrapAsync(ListingController.destroyListing));*/



// Create Route
/*app.post("/listings", validateListing,
    wrapAsync(async (req, res, next) => { 
      // Extract listing data from the form
      const listingData = req.body.listing;
      
      // Update the image field to be an object with filename and URL
      listingData.image = {
        filename: listingData.imageFilename || 'default-filename.jpg',  // Use form input or default
        url: listingData.imageUrl || 'default-url.jpg'  // Use form input or default
      };
  
      const newListing = new Listing(listingData); // Create new listing with updated image field
      await newListing.save(); // Save to the database
  
      res.redirect("/listings");
    })
  );*/
  

 


// Update Route
/*app.put("/listings/:id", validateListing, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listingData = req.body.listing;
    
    // Update the image field to be an object with filename and URL
    listingData.image = {
      filename: listingData.imageFilename || 'default-filename.jpg',  // Use form input or default
      url: listingData.imageUrl || 'default-url.jpg'  // Use form input or default
    };

    await Listing.findByIdAndUpdate(id, listingData); // Update listing in the database
    res.redirect(`/listings/${id}`);
}));*/

