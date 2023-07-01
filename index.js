require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
// Para el socket
const http = require("http");
const servidor = http.createServer(app);
const socketio = require("socket.io");
const io = socketio(servidor);
const axios = require("axios");

// "https://www.oishi.pe"

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://www.oishi.pe");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("*/", (req, res) => {
  res.json({
    message: "it works fine too!",
  });
});

app.post("*/crearpedido", async (req, res) => {
  try {
    // const resServer = await enviarBackendPHP(req.body);
    const resApiPhp = await axios.post(
      "https://api-backend-oishi.com/api/v2/orders",
      req.body,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    // resServer.then(resp => io.emit("pedidosSocket", resp.data));
    await io.emit("pedidosSocket", resApiPhp.data.data.order);
    await res.status(200).json(resApiPhp.data);
  } catch (e) {
    console.log(e.response.data);
    res.send("error al crear pedido", e);
  }
});

servidor.listen(80,34.193.194.176, () => console.log("Servidor inicializado"));
