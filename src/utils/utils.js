/*----------------MULTER------------------------------*/

import multer from 'multer';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'public'));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

export const uploader = multer({ storage });
/*----------------------Validate numbre-----------------*/
const validateNumber = (number) => {
    return number && !isNaN(number) && number > 0;
  };
  
  export { validateNumber };

//----------------MONGO------------------------------
import { connect, model, Schema, mongoose } from 'mongoose';

export async function connectMongo() {
  try {
    await connect(
      "mongodb+srv://martinwittmann90:iC00uo5o@projectmartinwittmann.l8a7l5b.mongodb.net/ecommerce?retryWrites=true&w=majority"
    );
    console.log("Connected succesfuly");
  } catch (e) {
    console.log(e);
    throw "Can not connect to mongo";
  }
}

