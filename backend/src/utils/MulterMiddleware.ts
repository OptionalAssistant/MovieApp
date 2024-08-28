import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
      cb(null, "uploads");
    },
    filename: (_, file, cb) => {
      const date = new Date();
      const formattedDate = date
        .toISOString()
        .replace(/[:T]/g, "-")
        .split(".")[0]; // Format date as YYYY-MM-DD-HH-MM-SS
      const ext = path.extname(file.originalname);
  
      const newFilename = `${formattedDate}${ext}`;
      cb(null, newFilename); // Pass the new filename
    },
  });
  
  export const upload = multer({ storage });

  export const conditionalImageUpload = (req, res, next) => {
    // Apply upload middleware first
    upload.single('image')(req, res, (err) => {
      if (err) {
        // Handle multer-specific errors
        return res.status(400).json({ message: 'Multer error occurred', error: err.message });
      }
  
      // Check if an image was provided
      if (req.file) {
        console.log("Image was provided:", req.file);
      } else {
        console.log("No image was provided.");
      }
  
      next(); // Proceed to the next middleware or route handler
    });
  };