import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const app = express();
app.use(express.json());

function asyncHandler(handler) {
  const newHandler = async function (req, res) {
    try {
      await handler(req, res);
    } catch (e) {
      console.log(e.name);
      console.log(e.message);
      if (e.name === "ValidationError") {
        res.status(400).send({ message: e.message });
      } else if (e.name === "CastError") {
        res.status(404).send({ message: "Cannot find given id." });
      } else {
        res.status(500).send({ message: e.message });
      }
    }
  };

  return newHandler;
}

/*********** users ***********/

app.get('/users', asyncHandler( async (req, res) => {
  const users = await prisma.user.findMany();
  res.send(users);
}));

app.get('/users/:id', asyncHandler( async (req, res) => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({
    where: { id },
  });
  res.send(user);
}));

app.post('/users', asyncHandler( async (req, res) => {
  // 리퀘스트 바디 내용으로 유저 생성
  const user = await prisma.user.create({
    data: req.body,
  });
  res.status(201).send(user);
}));

app.patch('/users/:id', asyncHandler( async (req, res) => {
  const { id } = req.params;
  // 리퀘스트 바디 내용으로 id에 해당하는 유저 수정
  const user = await prisma.user.update({
    where: { id },
    data: req.body,
  })
  res.send(user);
}));

app.delete('/users/:id', asyncHandler( async (req, res) => {
  const { id } = req.params;
  // id에 해당하는 유저 삭제
  await prisma.user.delete({
    where: { id },
  });
  res.sendStatus(204);
}));

/*********** products ***********/

app.get('/products', asyncHandler( async (req, res) => {
  const products = await prisma.product.findMany();
  res.send(products);
}));

app.get('/products/:id', asyncHandler( async (req, res) => {
  const { id } = req.params;
  const product = await prisma.product.findUnique({
    where: { id },
  });
  res.send(product);
}));

app.post('/products', asyncHandler( async (req, res) => {
  const product = await prisma.product.create({
    data: req.body,
  });
  res.status(201).send(product);
}));

app.patch('/products/:id', asyncHandler( async (req, res) => {
  const { id } = req.params;
  const product = await prisma.product.update({
    where: { id },
    data: req.body, 
  });
  res.send(product);
}));

app.delete('/products/:id', asyncHandler( async (req, res) => {
  const { id } = req.params;
  await prisma.product.delete({
    where: { id },
  });
  res.sendStatus(204);
}));

app.listen(process.env.PORT || 3000, () => console.log('Server Started'));