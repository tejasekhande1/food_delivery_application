var db = require("./../helpers/db_helpers");

module.exports.controller = (app) => {
  app.post("/api/cart", (req, res) => {
    const {
      user_id,
      restaurant_id,
      menu_item_id,
      portion_id,
      ingredient_id,
      qty,
    } = req.body;

    const sql = `
          INSERT INTO cart_detail (user_id, restaurant_id, menu_item_id, portion_id, ingredient_id, qty, create_date, update_date, status)
          VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW(), 1)`;

    const values = [
      user_id,
      restaurant_id,
      menu_item_id,
      portion_id,
      ingredient_id,
      qty,
    ];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error("Error executing SQL query:", err);
        res.status(500).json({ error: "Failed to add item to cart" });
      } else {
        console.log("New item added to cart successfully");
        res
          .status(200)
          .json({
            message: "Item added to cart successfully",
            cart_id: result.insertId,
          });
      }
    });
  });

  app.get('/api/cart', (req, res) => {
    const user_id = req.query.user_id;
    
    const sql = `
      SELECT c.cart_id, 
             c.restaurant_id, r.name as restaurent_name,
             c.menu_item_id, m.name as menu_item_name,
             c.portion_id, p.name as portion_name,
             c.ingredient_id, i.name as ingredient_name,
             c.qty
      FROM cart_detail c
      LEFT JOIN restaurant_detail r ON c.restaurant_id = r.restaurant_id
      LEFT JOIN menu_item_detail m ON c.menu_item_id = m.menu_item_id
      LEFT JOIN portion_detail p ON c.portion_id = p.portion_id
      LEFT JOIN ingredient_detail i ON c.ingredient_id = i.ingredient_id
      WHERE c.user_id = ?
        AND c.status = 1`;     
    db.query(sql, [user_id], (err, results) => {
      if (err) {
        console.error("Error executing SQL query:", err);
        res.status(500).json({ error: "Failed to fetch user's cart" });
      } else {
        res.status(200).json({ cart: results });
      }
    });
  });

  app.delete('/api/cart/:cart_id', (req, res) => {
    const cart_id = req.params.cart_id;
    
    const sql = `
      DELETE FROM cart_detail
      WHERE cart_id = ?`;
    
    db.query(sql, [cart_id], (err, result) => {
      if (err) {
        console.error("Error executing SQL query:", err);
        res.status(500).json({ error: "Failed to delete cart item" });
      } else {
        if (result.affectedRows > 0) {
          res.status(200).json({ message: "Cart item deleted successfully" });
        } else {
          res.status(404).json({ error: "Cart item not found" });
        }
      }
    });
  });
};
