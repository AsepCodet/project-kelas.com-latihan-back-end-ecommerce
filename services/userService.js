import { successResponse, errorResponse } from "../utils/response.js";
import * as UserRepo from "../repository/user.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

const SECRET_KEY_AT = "kelas.com";
const SECRET_KEY_RT = "AsepCodet";

export const addUser = async (req, res, next) => {
  try {
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;
    let region = req.body.region;
    let userType = req.body.userType;

    const saltRound = 10;
    bcrypt.hash(password, saltRound, async (err, hash) => {
      const result = await UserRepo.createData(
        userType,
        name,
        email,
        hash,
        region
      );
      let id = result[0].insertId;
      let data = await UserRepo.getData(userType, id);
      successResponse(res, "berhasil menambahkan user", data[0]);
    });
  } catch (error) {
    errorResponse(res, "gagal menambahkan user: " + error.message, 500);
    next(error);
  }
};
export const getUser = async (req, res, next) => {
    try{
        let userType = req.body.userType;
        const result = await UserRepo.getData(userType);
        successResponse(res, "success", result[0]);
    } catch(error){
        errorResponse(res, "user tidak ditemukan "+ error.message)
    }
};
export const getProductList = async (req, res, next) => {
    try{
        const result = await UserRepo.getProduct();
        successResponse(res, "success", result[0]);
    } catch(error){
        errorResponse(res, "product tidak ditemukan: "+ error.message)
    }
};
export const getUserById = async (req, res, next) => {
    try{
        let userType = req.body.userType;
        let id = req.query.id;
        const result = await UserRepo.getData(userType, id);
        successResponse(res, "success", result[0]);
    }catch(error){
        errorResponse(res, "user tidak ditemukan "+ error.message)
    }

};
export const deleteUser = async (req, res, next) => {
    try{
        let userType = req.body.userType;
        let id = req.query.id;
        const result = await UserRepo.deleteData(userType, id);
        successResponse(res, "success", result[0]);
    }catch(error){
        errorResponse(res, "user tidak ditemukan "+ error.message)
    }

};
export const updateUser = async (req, res, next) => {
    try{
        let id = req.params.id;
        let userType = req.body.userType;
        let name = req.body.name;
        let email = req.body.email;
        let password = req.body.password;
        let region = req.body.region;
        const saltRound = 10;
        bcrypt.hash(password, saltRound, async (err, hash) => {
            const result = await UserRepo.updateData(
                id,
                userType,
                name,
                email,
                hash,
                region
            );
            if (result[0].affectedRows==0){
                throw new Error(
                    "Ada yang salah, pastikan kembali data id dan userType."
                  );
            }
            successResponse(res, "success", result[0]);
        });                
    }catch(error){
        errorResponse(res, "user tidak ditemukan: " + error.message)
    }

};
export const addProduct = async (req, res, next) => {
    try {
      let product_name = req.body.product_name;
      let description = req.body.description;
      let stock = req.body.stock;
      let price = req.body.price;
      let idSeller = req.params.idSeller;

      const result = await UserRepo.addProductBySeller(product_name, description, stock, price, idSeller);
      listProductSeller(idSeller)
      successResponse(res, "berhasil menambahkan produk", result[0]);
    } catch (error) {
      errorResponse(res, "gagal menambahkan produk: " + error.message, 500);
      next(error);
    }
};
export const deleteProduct = async (req,res,next) => {
    try {
        let product_id = req.body.product_id;
        let idSeller = req.params.idSeller;
        const result = await UserRepo.deleteProductBySeller(product_id);
        listProductSeller(idSeller)
        successResponse(res, "berhasil menghapus produk", result[0]);
    } catch (error) {
        errorResponse(res, "gagal menghapus produk: " + error.message, 500);
        next(error);
    }
}
export const listProductSeller = async (idSeller) => {
    let data = await UserRepo.getSellerListProduct(idSeller);
    await UserRepo.updateSellerListProduct(idSeller, data[0]);
}
export const addCustomerCart= async (req,res,next) => {
    try {
        let id = req.params.id;
        let cart = req.body.cart;
        let data = await UserRepo.getCustomerCart(id);
        let a=data[0][0].cart
        if(a==null){
            let result = await UserRepo.updateCustomerCart(id,[cart]);
            successResponse(res, "berhasil menambahkan ke keranjang", result[0]);
        }else{
            const newArray = a;
            newArray.push(cart)
            let result = await UserRepo.updateCustomerCart(id,newArray)
            successResponse(res, "berhasil menambahkan ke keranjang", result[0]);
        }
    } catch (error) {
        errorResponse(res, "gagal menambahkan ke keranjang: " + error.message, 500);
        next(error);
    }
}
export const createTransactionByCart= async (req,res,next) => {
    const id = req.params.id;
    let usr = await UserRepo.getData("customer", id);
    var cuctomer_region = usr[0][0].region;
    let dt = await UserRepo.getCustomerCart(id);
    let cart = dt[0][0].cart;


    let data = await UserRepo.getProduct();
    var item_bought =[];
    var empty = "Barangnya nggak ada: ";
    var lowStock = "Barang ini stoknya kurang: ";
    cart.forEach(target => { 
        const foundProduct = data[0].find(item => item.product_id === target.product_id);
        if(foundProduct.isNullOrUndefined){
            empty += target.product_id+", ";
        }else{
            if((foundProduct.stock-target.amount)>0){
                item_bought.push(foundProduct);
            }else{
                lowStock += target.product_id+", ";
            }
        }
    })
    // console.log(item_bought);
    const uniqueSellerIds = [...new Set(item_bought.map(seller => seller.id_seller))];
    try {
            uniqueSellerIds.forEach( async seller =>  {
            const d = await UserRepo.getData("seller", seller);
            var filtered = item_bought.filter(item => item.id_seller == seller)
            const prices = filtered.map(item => item.price);
            let reg = d[0][0].region;
            const totalPrice = prices.reduce((total, price) => total + price, 0);
            let result = UserRepo.setTransaction(id, seller, filtered, totalPrice, reg, cuctomer_region)
            successResponse(res, "berhasil menambahkan ke keranjang", result[0]);    
        });
        
    } catch (error) {
        errorResponse(res, "gagal membuat transaksi: " + error.message, 500);
        next(error);
    }
}
export const authUser=async(req,res,next)=>{
    try {
        let userType = req.body.userType;
        let email = req.body.email;
        let password = req.body.password;
        const [result] = await UserRepo.getDataByEmail(userType, email);

        if (result.length > 0) {
            const user = result[0];

            bcrypt.compare(password, user.password, (err, result) => {
                if (result) {
                    if(userType === "seller"){
                        var claims = {
                            id: user.seller_id, 
                            name: user.username, 
                            email: user.email
                        };
                    } else if (userType === "customer") {
                        var claims = {
                            id: user.customer_id, 
                            name: user.username, 
                            email: user.email
                        };
                    } else {
                        throw new Error('Invalid userType. Must be "seller" or "customer".');
                    }
                    

                    const accessToken = jwt.sign(claims, SECRET_KEY_AT, {expiresIn:'15m'});
                    const refreshToken = jwt.sign(claims, SECRET_KEY_RT, {expiresIn:'30m'});
                    let data = {
                        access_token: accessToken, 
                        refresh_token: refreshToken
                    }
                    successResponse(res, "berhasil login", data)
                }
            })
        } else {
            errorResponse(res, "email atau password tidak cocok");
        }
    } catch(error) {
        next(error)
    }
}

