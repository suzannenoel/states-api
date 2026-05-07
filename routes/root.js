
const express = require('express');
const router = express.Router();

router.get('^/$|/index(.html)?', (req, res) => {
    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>US States REST API</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 0 20px; color: #333; }
    h1 { color: #2c5f8a; }
    h2 { color: #444; margin-top: 30px; }
    code { background: #f4f4f4; padding: 2px 6px; border-radius: 3px; }
    ul { line-height: 1.8; }
  </style>
</head>
<body>
  <h1>US States REST API</h1>
  <p>Welcome! This REST API provides data about all 50 US states.</p>
  <h2>Available Endpoints</h2>
  <ul>
    <li><code>GET /states/</code> — All state data</li>
    <li><code>GET /states/?contig=true</code> — Contiguous states only</li>
    <li><code>GET /states/?contig=false</code> — Non-contiguous states (AK, HI)</li>
    <li><code>GET /states/:state</code> — Data for a specific state</li>
    <li><code>GET /states/:state/funfact</code> — Random fun fact</li>
    <li><code>GET /states/:state/capital</code> — Capital city</li>
    <li><code>GET /states/:state/nickname</code> — Nickname</li>
    <li><code>GET /states/:state/population</code> — Population</li>
    <li><code>GET /states/:state/admission</code> — Admission date</li>
    <li><code>POST /states/:state/funfact</code> — Add fun facts</li>
    <li><code>PATCH /states/:state/funfact</code> — Update a fun fact</li>
    <li><code>DELETE /states/:state/funfact</code> — Delete a fun fact</li>
  </ul>
</body>
</html>`);
});

module.exports = router;




