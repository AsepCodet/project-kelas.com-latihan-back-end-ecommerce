import  express  from "express";
import * as UserService from '../services/userService.js'

const userRouter = express();

userRouter.get('/users', (req, res) => {
    const id = req.query.id;
    if (!id) {
        UserService.getUser(req, res);
    } else {
        UserService.getUserById(req, res);
    }
});
userRouter.get('/users/product', UserService.getProductList);
userRouter.post('/reg', UserService.addUser);
userRouter.delete('/users', UserService.deleteUser);
userRouter.put('/users/:id/', UserService.updateUser);
userRouter.post('/seller/:idSeller/', UserService.addProduct);
userRouter.delete('/seller/:idSeller/', UserService.deleteProduct);
userRouter.post('/users/:id/cart', UserService.addCustomerCart);
userRouter.post('/users/:id/buy', UserService.createTransactionByCart);
userRouter.post('/login', UserService.authUser);

export default userRouter;