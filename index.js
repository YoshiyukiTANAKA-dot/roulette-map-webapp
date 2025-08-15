const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from docs (for GitHub Pages compatibility)
app.use(express.static(path.join(__dirname, 'docs')));

// Serve images and CSV for local development
app.use('/pic', express.static(path.join(__dirname, 'pic')));
app.use('/csv', express.static(path.join(__dirname, 'csv')));

// Fallback to index.html for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'docs', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
