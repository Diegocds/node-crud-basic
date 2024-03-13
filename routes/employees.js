const employeesRouter = (app, client) => {
  app.get("/employees", async (req, res) => {
    const response = await client.query("SELECT * FROM employees");

    res.json(response.rows);
  });

  app.get("/employees/:id", async (req, res) => {
    const response = await client.query(
      "SELECT * FROM employees WHERE id = $1",
      [req.params.id]
    );

    res.json(response.rows);
  });

  app.post("/create/employee", async (req, res) => {
    const response = await client.query(
      "INSERT INTO employees (name, date, email, phone, office, status, salary) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      [
        req.body.name,
        req.body.date,
        req.body.email,
        req.body.phone,
        req.body.office,
        req.body.status,
        req.body.salary,
      ]
    );

    res.status(201).json({ message: "Funcionário criado com sucesso" });
  });

  app.put("/update/employee", async (req, res) => {
    if (req.body.id) {
      const id = Number(req.body.id);
      const userExists = await client.query(
        "SELECT * FROM employees WHERE id = $1",
        [id]
      );
      if (userExists.rows.length === 0) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }
      const response = await client.query(
        "UPDATE employees SET name = $1, date = $2, email = $3, phone = $4, office = $5, status = $6, salary = $7 WHERE id = $8",
        [
          req.body.name,
          req.body.date,
          req.body.email,
          req.body.phone,
          req.body.office,
          req.body.status,
          req.body.salary,
          id,
        ]
      );
      return res
        .status(200)
        .json({ message: "Funcionário atualizado com sucesso" });
    } else {
      const response = await client.query(
        "INSERT INTO employees (name, date, email, phone, office, status, salary) VALUES ($1, $2, $3, $4, $5, $6, $7)",
        [
          req.body.name,
          req.body.date,
          req.body.email,
          req.body.phone,
          req.body.office,
          req.body.status,
          req.body.salary,
        ]
      );
      return res
        .status(201)
        .json({ message: "Funcionário criado com sucesso" });
    }
  });

  app.delete("/delete/employee/:id", async (req, res) => {
    const response = await client.query("DELETE FROM employees WHERE id = $1", [
      req.params.id,
    ]);
    res.status(200).json({ message: "Funcionário deletado com sucesso" });
  });
};

module.exports = employeesRouter;
