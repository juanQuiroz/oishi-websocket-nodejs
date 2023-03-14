require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
// Para el socket
const http = require('http');
const servidor = http.createServer(app);
const socketio = require('socket.io');
const io = socketio(servidor);
const axios = require('axios');

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://www.oishi.pe');
  res.header(
    'Access-Control-Allow-Headers',
    'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method',
  );
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Ruta de prueba
app.get('*/', (req, res) => {
  res.json({
    message: 'it works fine too!',
  });
});

// Crear pedido pasando primero por el backend PHP para luego enviar el pedido por socket
app.post('*/crearpedido', async (req, res) => {
  try {
    // const resServer = await enviarBackendPHP(req.body);
    const resApiPhp = await axios.post(
      'https://api-oishi.projectsdevmiller.website/api/v2/orders',
      req.body,
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      },
    );

    // Propagar datos mediante el socket
    await io.emit('pedidosSocket', resApiPhp.data.data.order);

    await res.status(200).json(resApiPhp.data);
  } catch (e) {
    console.log(e.response.data);
    res.send('error al crear pedido', e);
  }
});

servidor.listen(4000, () => console.log('Servidor inicializado'));
