import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";


dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());


app.listen(process.env.PORT || 5000, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});