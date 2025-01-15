//#region Setando
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const corsConfig = {
    origin: ["http://localhost:3000"],
    method: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const saltRounds = parseFloat(process.env.SALT_ROUNDS);

const session = require("express-session");
const cookieParser = require("cookie-parser");

const { Sequelize, DataTypes } = require("sequelize");

const app = express();

app.use(cors(corsConfig));
app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}));

const sequelize = new Sequelize(
    process.env.DB_NAME, 
    process.env.DB_USER,
    process.env.DB_PASSWORD || "",
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        port: process.env.DB_PORT,
    }
)

const usuario = sequelize.define("usuario", 
    {
        id_user: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        nome: {
            type: DataTypes.STRING(100),
            defaultValue: null,
            allowNull: true,
        },
        email: {
            type: DataTypes.STRING(200),
            allowNull: false,
            unique: true,
        },
        senha: {
            type: DataTypes.STRING(300),
            allowNull: false,
        },
    },
    {
        timestamps: false,
    }
);

//#endregion

app.post("/register", (req, res) => {
    const { nome, email, senha } = req.body;
    
    if (!nome || !email || !senha) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios." });
    }

    bcrypt.genSalt(saltRounds, (err, salt) => {
        if (err) {
            console.error(`Erro ao gerar o salt: ${err}`);
            return res.status(500).json({ message: "Erro interno ao gerar o salt." });
        }
        
        bcrypt.hash(senha, salt, async (err, hashedSenha) => {
            if (err) {
                console.error(`Erro ao gerar o hash: ${err}`);
                return res.status(500).json({ message: "Erro interno ao gerar o hash da senha." });
            }

            await usuario.create({
                nome,
                email,
                senha: hashedSenha
            });
            return res.status(201).json({ message: "Login realizado com sucesso." });
        })
    });
})

app.post("/login", async (req, res) => {
    const {email, senha} = req.body;

    if (!email || !senha) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios!" });
    }

    try {
        const user = await usuario.findOne({
            where: {
                email
            }
        });
    
        const senhaHashed = user.senha;

        bcrypt.compare(senha, senhaHashed, (err, match) => {
            if (err) {
                console.error(`Erro ao comparar senhas: ${err}`);
                return res.status(500).json({ message: "Erro interno ao validar a senhas" });
            }
            if (!match) {
                return res.status(401).json({ message: "Senha incorreta.", Login: false });
            }
    
            req.session.username = user.nome;
            return res.status(200).json({ message: "Login bem-sucedido!", Login: true });
        });
    } catch (err) {
        return res.status(401).json({ message: "Usuario não encontrado" })
    }
});

app.post("/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: "Erro ao tentar deslogar." });
        }

        res.clearCookie("connect.sid");
        return res.status(200).json({ message: "Deslogado com sucesso!" })
    });
});

app.get("/check-session", (req, res) => {
    console.log(req)
    if (req.session.username) {
        return res.status(200).json({ valid: true });
    } else {
        return res.status(401).json({ valid: false });
    }
});




const port = process.env.SERVER_PORT;

sequelize.sync({ force: false })
    .then(() => {
        app.listen(port, () => {
            console.log(`Server running at ${port} port`);
        });
    });