var db = require("./../helpers/db_helpers");

module.exports.controller = (app) => {
  app.put("/api/user/:user_id", (req, res) => {
    const { name, email, mobile, address, password, confirmedPassword } =
      req.body;

    const userId = req.params.user_id;

    if (password !== confirmedPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    const sql = `
    UPDATE user_detail
    SET name = ?,
        email = ?,
        mobile = ?,
        address = ?,
        password = ?
    WHERE user_id = ?
`;

    const values = [name, email, mobile, address, password, userId];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Internal server error" });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({ message: "User profile updated successfully" });
    });
  });
};
