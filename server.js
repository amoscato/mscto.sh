const express = require('express');
const next = require('next');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const yup = require('yup');
const { nanoid } = require('nanoid');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  const db = require('monk')('localhost/msctosh');
  const urls = db.get('urls');
  urls.createIndex({ slug: 1 }, { unique: true });

  const schema = yup.object().shape({
    url: yup.string().trim().url().required(),
  });

  server.use(helmet());
  server.use(morgan('tiny'));
  server.use(cors());
  server.use(express.json());

  server.get('/:id', async (req, res) => {
    const { id: slug } = req.params;
    try {
      const url = await urls.findOne({ slug });
      if (url) {
        res.redirect(301, url.url);
      }
      res.redirect(`/?error=${slug} not found`);
    } catch (error) {
      res.redirect(`/?error=Link not found`);
    }
  });

  server.post('/url', async (req, res, next) => {
    let { url } = req.body;
    let slug = nanoid(7).toLowerCase();
    try {
      await schema.validate({ url });
      const newUrl = { url, slug };
      const created = await urls.insert(newUrl);
      res.json(created);
    } catch (error) {
      next(error);
    }
  });

  server.get('*', (req, res) => {
    return handle(req, res);
  });

  const PORT = process.env.PORT || 5000;

  server.listen(PORT, err => {
    if (err) throw err;
    console.log(`Listening at http://localhost:${PORT}`);
  });
});
