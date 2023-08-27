import express from 'express';
import userRouter from './routes/userRouter.js';
import { errorResponse } from "./utils/response.js";

const app = express();
const port = 8080;
const host = "localhost";

app.use(express.json())

app.use('/', userRouter)

app.use((error, req, res, next) => {
    const message = "internal server error";
    console.log(error.message);
    errorResponse(res, message, 500)
});

app.listen(port, host, () => {
    console.log(`server berjalan pada http://${host}:${port}`);
})