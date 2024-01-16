const { Pool } = require('pg');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 8080; 

const pool = new Pool({
  user: 'webblog_user',
  host: 'postgres',
  database: 'webblog',
  password: 'webblog_user',
  port: 5432,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Configuración de CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});

app.get('/', (req, res) => {
  res.send('¡Hola, mundo!');
});

app.get('/api/authentication', async (req, res) => {
  try {
    const { username, password } = req.query;
    const result = await pool.query('SELECT pk, username FROM users WHERE username = $1 AND password = $2', [username, password]);
    if (result.rows.length > 0) {
      const authenticatedUser = result.rows[0];
      console.log('debug authenticatedUser', authenticatedUser);
      res.status(200).json({...authenticatedUser});
    } else {
      res.status(401).json({ message: 'Credenciales inválidas' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

app.post('/api/user', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('req.body', req.body);
    const newUser = await pool.query('INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *', [username, password]);
    res.status(201).json(newUser.rows[0] || {});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

app.get('/api/user', async (req, res) => {
  try {
    const { username, password } = req.query;
    const result = await pool.query('SELECT * FROM users WHERE username = $1 AND password = $2', [username, password]);
    if (result.rows.length > 0) {
      res.status(200).json(newUser.rows[0] || {});
    } else {
      res.status(401).json({ message: 'Credenciales inválidas' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

app.post('/api/posts', async (req, res) => {
  try {
    const { title, author, description, thumbnail, userId } = req.body;
    const thumbnailValue = thumbnail !== undefined ? thumbnail : null;
    const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const result = await pool.query('INSERT INTO posts (title, author, description, thumbnail, created, pk) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [title, author, description, thumbnailValue, currentDate, userId]);
    const newPost = result.rows[0];
    res.status(201).json({ message: 'Post creado exitosamente', post: newPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

app.get('/api/posts', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM posts ORDER BY id DESC');
    const posts = result.rows.map((post) => {
      if (post.thumbnail && post.thumbnail instanceof Buffer) {
        const mimeType = "image/png";
        const base64String = `data:${mimeType};base64,${post.thumbnail.toString('base64')}`;
        post.thumbnail = base64String;
      }
      return post;
    });
    console.log('------ posts:', posts);
    res.status(200).json(posts || []);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo salió mal!');
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
