import dbPool from "../utils/db.js";

export const getData = async (userType, id) => {
  if (!userType) {
    throw new Error("All parameters (id & userType) are required.");
  }
  let sql, value;
  if (!id) {
    if (userType === "seller") {
      sql =
        "SELECT seller_id, username, email, password, region, created_at FROM sellers";
    } else if (userType === "customer") {
      sql =
        "SELECT customer_id, username, email, password, region, created_at FROM customers";
    } else {
      throw new Error('Invalid userType. Must be "seller" or "customer".');
    }
    return await dbPool.query(sql);
  } else {
    if (userType === "seller") {
      sql =
        "SELECT seller_id, username, email, password, region, created_at FROM sellers WHERE seller_id=?";
    } else if (userType === "customer") {
      sql = "SELECT customer_id, username, email, password, region, created_at FROM customers WHERE customer_id=?";
    } else {
      throw new Error('Invalid userType. Must be "seller" or "customer".');
    }
    value = [id];
    return await dbPool.query(sql, value);
  }
};

export const getDataByEmail = (userType, email) => {
    let sql, value;
    if (userType === "seller") {
        sql =
          "SELECT seller_id, username, email, password, region, created_at FROM sellers WHERE email=?";
      } else if (userType === "customer") {
        sql = "SELECT customer_id, username, email, password, region, created_at FROM customers WHERE email=?";
      } else {
        throw new Error('Invalid userType. Must be "seller" or "customer".');
      }
    value = [email];
    return dbPool.query(sql, value)
}

export const getProduct = async () => {
    let sql = "SELECT * FROM products"
    const result = await dbPool.query(sql);
    return result;
};

export const createData = ( userType, name, email, password, region) => {
  if (!name || !email || !password || !region || !userType) {
    throw new Error(
      "All parameters (name, email, password, region, userType) are required."
    );
  }

  let sql, value;
  if (userType === "seller") {
    sql =
      "INSERT INTO sellers (username, email, password, region, created_at) VALUES (?, ?, ?, ?, ?)";
  } else if (userType === "customer") {
    sql =
      "INSERT INTO customers (username, email, password, region, created_at) VALUES (?, ?, ?, ?, ?)";
  } else {
    throw new Error('Invalid userType. Must be "seller" or "customer".');
  }

  const createdAt = new Date();
  value = [name, email, password, region, createdAt];

  const result = dbPool.query(sql, value);
  return result;
};

export const updateData = (id, userType, name, email, password, region) => {
  if (!id || !userType) {
    throw new Error("All parameters (id & userType) are required.");
  }

  let sql, value;
  if (userType === "seller") {
    sql =
      "UPDATE sellers SET username=?, password=?, email=?, region=?, update_at=? WHERE seller_id=?";
  } else if (userType === "customer") {
    sql =
      "UPDATE customers SET username=?, password=?, email=?, region=?, update_at=? WHERE customer_id=?";
  } else {
    throw new Error('Invalid userType. Must be "seller" or "customer".');
  }

  const updateAt = new Date();
  value = [name, password, email, region, updateAt, id];
  const result = dbPool.query(sql, value);

  return result;
};
export const deleteData = (userType, id) => {
  if (!id || !userType) {
    throw new Error("All parameters (id & userType) are required.");
  }

  let sql, value;
  if (userType === "seller") {
    sql = "DELETE FROM sellers WHERE seller_id=?";
  } else if (userType === "customer") {
    sql = "DELETE FROM customers WHERE customer_id=?";
  } else {
    throw new Error('Invalid userType. Must be "seller" or "customer".');
  }
  value = [id];
  const result = dbPool.query(sql, value);
  return result;
};

export const addProductBySeller = (product_name, description, stock, price, idSeller) => {
    if (!product_name || !price || !idSeller ) {
        throw new Error(
          "All parameters (product_name, price, idSeller) are required."
        );
    }
    let sql = "INSERT INTO products (product_name, description, stock, price, id_seller, created_at) VALUES (?, ?, ?, ?, ?, ?)";
    const createdAt = new Date();
    let value = [product_name, description, stock, price, idSeller, createdAt];

    const result = dbPool.query(sql, value);
    return result;
}
export const deleteProductBySeller = (product_id) => {
    if (!product_id) {
        throw new Error(
          "All parameters (product_id) are required."
        );
    }
    let sql = "DELETE FROM products WHERE product_id=?";
    let value = [product_id];
    const result = dbPool.query(sql, value);
    return result;
}
export const getSellerListProduct = async(idSeller) =>{
    if (!idSeller) {
        throw new Error(
          "All parameters (idSeller) are required."
        );
    }
    let sql = "SELECT product_id FROM products WHERE id_seller=?";
    let value = [idSeller];
    const result = await dbPool.query(sql, value);
    return result;
}
export const updateSellerListProduct = async(idSeller,data) =>{
    if (!idSeller) {
        throw new Error(
          "All parameters (idSeller) are required."
        );
    }
    let sql = "UPDATE sellers SET products=? WHERE seller_id=?"
    let value = [JSON.stringify(data), idSeller];
    const result = await dbPool.query(sql, value);
    return result;
}
export const getCustomerCart = async(id) =>{
    if (!id) {
        throw new Error(
          "All parameters (idSeller) are required."
        );
    }
    let sql = "SELECT cart FROM customers WHERE customer_id=?";
    let value = [id];
    const result = await dbPool.query(sql, value);
    return result;
}
export const updateCustomerCart = (id,data) => {
    if (!id) {
        throw new Error(
          "All parameters (idSeller) are required."
        );
    }
    let sql = "UPDATE customers SET cart=? WHERE customer_id=?"
    let value = [JSON.stringify(data), id];
    const result = dbPool.query(sql, value);
    return result;
}
export const setTransaction =  async (customer_id, seller_id, product_list, total_price,sender_region, reciever_region) => {
    let sql = "INSERT INTO transactions (id_customer, id_seller, product_list, total_price, sender_region, receiver_region, create_time) VALUES (?, ?, ?, ?, ?, ?, now())";
    let value = [customer_id, seller_id, JSON.stringify(product_list), total_price, sender_region, reciever_region];

    const result = await dbPool.query(sql, value);
    return result;
}
