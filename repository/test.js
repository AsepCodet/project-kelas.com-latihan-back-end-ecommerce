import { isNull, isNullOrUndefined } from "util";
import dbPool from "../utils/db.js";
import * as UserRepo from "./user.js";

// let data = await UserRepo.getProduct();
// const target = [{"amount": 10, "product_id": 9}, 
//                 {"amount": 10, "product_id": 10},
//                 {"amount": 11, "product_id": 1},
//                 {"amount": 5, "product_id": 2},
//                 ]

// var total_price = 0;
// var item_bought =[];
// var empty = "Barangnnya nggak ada: ";
// var lowStock = "Barang ini stoknya kurang: ";
// target.forEach(target => { 
//     const foundProduct = data[0].find(item => item.product_id === target.product_id);
//     if(foundProduct.isNullOrUndefined){
//         empty += target.product_id+", ";
//     }else{
//         if((foundProduct.stock-target.amount)>0){
//             item_bought.push(foundProduct);
//         }else{
//             lowStock += target.product_id+", ";
//         }
//     }
// })
// console.log(item_bought);

// const uniqueSellerIds = [...new Set(item_bought.map(seller => seller.id_seller))];

// uniqueSellerIds.forEach( async seller =>  {

//     let d = await UserRepo.getData("seller",seller);
//     let reg = d[0].region;
//     const filtered = item_bought.filter(item => item.seller_id === seller)
    

// });


const d = await UserRepo.getData("seller", 1);

let a = d[0][0]
console.log(a.region)
