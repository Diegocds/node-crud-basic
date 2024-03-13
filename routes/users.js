const usersRouter = (app, client) => {
  app.get("/users", async (req, res) => {
    const response = await client.query("SELECT * FROM users");

    res.json(response.rows);
  });

  app.get("/users/:id", async (req, res) => {
    const response = await client.query("SELECT * FROM users WHERE id = $1", [
      req.params.id,
    ]);

    res.json(response.rows);
  });

  app.post("/create/user", async (req, res) => {
    const response = await client.query(
      "INSERT INTO users (name, email, phone, password) VALUES ($1, $2, $3, $4) RETURNING *",
      [req.body.name, req.body.email, req.body.phone, req.body.password]
    );

    res
      .status(201)
      .json({ message: "Usuario criado com sucesso", user: response.rows[0] });
  });

  app.put("/update/user", async (req, res) => {
    // Verificar se o ID do usuário já existe nos dados do corpo da solicitação
    if (req.body.id) {
      const id = Number(req.body.id);
      // Verificar se o ID do usuário existe na base de dados
      const userExists = await client.query(
        "SELECT * FROM users WHERE id = $1",
        [id]
      );
      if (userExists.rows.length === 0) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }
      // Atualizar os dados do usuário existente
      const response = await client.query(
        "UPDATE users SET name = $1, email = $2, phone = $3 WHERE id = $4",
        [req.body.name, req.body.email, req.body.phone, id]
      );
      return res
        .status(200)
        .json({ message: "Usuário atualizado com sucesso" });
    } else {
      // Criar um novo usuário
      const response = await client.query(
        "INSERT INTO users (name, email, phone, password) VALUES ($1, $2, $3, $4)",
        [req.body.name, req.body.email, req.body.phone, req.body.password]
      );
      return res.status(201).json({ message: "Usuário criado com sucesso" });
    }
  });

  app.delete("/delete/user/:id", async (req, res) => {
    const response = await client.query("DELETE FROM users WHERE id = $1", [
      req.params.id,
    ]);
    res.status(200).json({ message: "Usuario deletado com sucesso" });
  });
};

module.exports = usersRouter;
