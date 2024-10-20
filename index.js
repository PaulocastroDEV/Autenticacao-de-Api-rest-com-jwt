const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const auth = require("./autenticacao");

const JWTSecret = require("./Secret");
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//banco de dados falso

const db = {
  games: [
    {
      id: 1,
      title: "Call of duty MW",
      year: 2019,
      price: 60,
    },
    {
      id: 2,
      title: "Sea of thieves",
      year: 2018,
      price: 40,
    },
    {
      id: 3,
      title: "Minecraft",
      year: 2012,
      price: 20,
    },
  ],
  users: [
    {
      id: 1,
      name: "Paulo",
      email: "Ppp@gmail.com",
      password: "nodejs",
    },
    {
      id: 2,
      name: "Joao",
      email: "Joao@gmail.com",
      password: "java12",
    },
  ],
};

let idGenerate = db.games[db.games.length - 1].id;
app.get("/games", auth, (req, res) => {
  res.status(200).json(db.games);
});

app.get("/game/:id", (req, res) => {
  if (isNaN(req.params.id)) {
    res.sendStatus(400);
  } else {
    const id = parseInt(req.params.id);
    const game = db.games.find((g) => g.id == id);
    if (game !== undefined) {
      res.status(200).json(game);
    } else {
      res.sendStatus(404);
    }
  }
});
app.post("/game", (req, res) => {
  const { title, price, year } = req.body;
  if (isNaN(price) || isNaN(year) || typeof title !== "string") {
    res.sendStatus(400);
  } else {
    const game = req.body;
    db.games.push({
      id: ++idGenerate,
      title,
      price,
      year,
    });
    res.status(200).json(game);
  }
});

app.delete("/game/:id", (req, res) => {
  if (isNaN(req.params.id)) {
    res.sendStatus(400);
  } else {
    const id = parseInt(req.params.id);

    const index = db.games.findIndex((g) => g.id === id);

    if (index === -1) {
      res.sendStatus(404);
    } else {
      db.games.splice(index, 1);
      res.sendStatus(200);
    }
  }
});
app.put("/game/:id", (req, res) => {
  if (isNaN(req.params.id)) {
    res.sendStatus(400);
  } else {
    const id = parseInt(req.params.id);

    const game = db.games.find((g) => g.id === id);

    if (game !== undefined) {
      const { title, price, year } = req.body;

      if (title !== undefined) {
        game.title = title;
      }
      if (price !== undefined) {
        game.price = price;
      }
      if (year !== undefined) {
        game.year = year;
      }

      res.status(200).json(game);
    } else {
      res.sendStatus(404);
    }
  }
});

app.post("/auth", (req, res) => {
  const { email, password } = req.body;

  if (email !== undefined) {
    const user = db.users.find((u) => u.email === email);

    if (user !== undefined) {
      if (user.password === password) {
        jwt.sign(
          { id: user.id, email: user.email },
          JWTSecret,
          { expiresIn: "48h" },
          (err, token) => {
            if (err) {
              res.status(400);
              res.json({ err: "Falha interna" });
            } else {
              res.status(200);
              res.json({ token: token });
            }
          }
        );
      } else {
        res.status(401);
        res.json({ err: "Credenciais inválidas" });
      }
    } else {
      res.status(404);
      res.json({ err: "O E-mail enviado não existe na base de dados!" });
    }
  } else {
    res.status(400);
    res.json({ err: "O E-mail enviado é invalido" });
  }
});

app.listen(3000, () => {
  console.log("Api rodando");
});
