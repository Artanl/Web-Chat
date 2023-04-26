const asyncHandler = require("express-async-handler");
const User = require("../Models/userModel");
const generateToken = require("../config/generateToken");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Complete Todos os Campos");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("Usuário já existe");
  }

  const user = await User.create({
    name,
    email,
    password,
    pic,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Falha ao Criar o Usuário");
  }
});

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  console.log("Em asyncHandler");
  console.log("Procurando usuario:");

  console.log(req.body);
  const user = await User.findOne({ email });

  console.log(user);
  res.set("Access-Control-Allow-Origin", "*");

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  }
  return res.json({
    mensagem: "Os dados de acesso estão incorretos.",
  });
});

module.exports = { registerUser, authUser };
