const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());

app.get('/api/korunma', async (req, res) => {
  try {
    const url = 'https://www.derikanseri.org/deri-kanseri-riskinizi-belirleyin';
    const {data} = await axios.get(url);
    const $ = cheerio.load(data);


    const text = $('article').text().trim();

    res.json({content: text});
  } catch (error) {
    console.error('Kazıma hatası:', error);
    res.status(500).json({error: 'Veri çekilemedi.'});
  }
});

app.listen(PORT, () => {
  console.log(`Sunucu çalışıyor: http://localhost:${PORT}`);
});
