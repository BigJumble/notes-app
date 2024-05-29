const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

// let serverRestarted = true;
// app.get('/api/refresh-status', (req, res) => {
//   res.json({ restarted: serverRestarted });
//   serverRestarted = false;
// });

app.use(express.static(path.join(__dirname, 'docs')));

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});