import express from "express";
import dotenv from "dotenv";
import path from "path"; 
import { fileURLToPath } from "url"; 
import connectdb from "./config/db.js";
import animeroute from "./routes/animeRoutes.js";
import errorhandler from "./middlewares/errorHandler.js";
import userroute from "./routes/userroutes.js";
import favroute from "./routes/favRoute.js";
import CommentRoute from "./routes/commentRoutes.js";
import likeRoutes from "./routes/likeRoutes.js";
import ratingRoutes from './routes/ratingRoutes.js';
import cors from 'cors';
dotenv.config();
connectdb();

const app = express();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());

app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
}));


app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.use("/api/anime", animeroute);
app.use("/api/user", userroute);
app.use("/api/fav", favroute);
app.use("/api/comments",CommentRoute);
app.use("/api/likes", likeRoutes);
app.use('/api/ratings', ratingRoutes);

app.use(errorhandler);

const Port = process.env.PORT || 5000;


app.listen(Port, "0.0.0.0", () => {
    console.log(`server is listening in port ${Port}`);
});
