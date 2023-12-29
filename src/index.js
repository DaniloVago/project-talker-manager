const express = require('express');
const crypto = require('crypto');
const { readFile } = require('./fs/readFile');
const { validateEmail, validatePassword } = require('./middlewares/validateLogin');
const { validateToken, validateName, 
  validateAge, validateTalk, validateWatchedAt, validateRate, 
} = require('./middlewares/validateTalker');
const { writeFile } = require('./fs/writeFile');

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = process.env.PORT || '3001';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});

app.get('/talker', async (req, res) => {
  const talkers = await readFile();
  if (talkers.length > 0) {
    return res.status(200).json(talkers);
  }
    return res.status(200).json([]);
});

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const talkers = await readFile();
  const talkerSearch = talkers.find((talker) => talker.id === Number(id));
  if (talkerSearch) {
    return res.status(200).json(talkerSearch);
  } 
  return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
});

app.post('/login', validateEmail, validatePassword, async (req, res) => {
  const { email, password } = req.body;
  if (email && password) {
    const token = crypto.randomBytes(8).toString('hex');
    return res.status(200).json({ token: `${token}` });
  }
});

app.post('/talker', validateToken, validateName, 
validateAge, validateTalk, validateWatchedAt, validateRate, async (req, res) => {
  const { name, age, talk } = req.body;
  const oldTalkers = await readFile();
  const newTalker = {
    id: oldTalkers.length + 1,
    name,
    age,
    talk,
   };
  const allTalkers = JSON.stringify([...oldTalkers, newTalker]);
  await writeFile(allTalkers);
  return res.status(201).json(newTalker);
});

app.put('/talker/:id', validateToken, validateName, 
validateAge, validateTalk, validateWatchedAt, validateRate, async (req, res) => {
  const { name, age, talk } = req.body;
  const { id } = req.params;
  // pegando todos talkers da lista
  const oldTalkers = await readFile();
  // criando o novo talker
  const newTalker = { id: Number(id), name, age, talk };
  // conferindo se existe talker com mesmo id
  const oldTalkerId = oldTalkers.find((talker) => talker.id === Number(id));
  // console.log(oldTalkerId);
  if (!oldTalkerId) {
    return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  } 
  oldTalkers[id] = newTalker;
  const allTalkers = JSON.stringify(oldTalkers);
  await writeFile(allTalkers);
  return res.status(200).json(newTalker);
});

app.delete('/talker/:id', validateToken, async (req, res) => {
  const { id } = req.params;
  const oldTalkers = await readFile();
  const newTalkers = oldTalkers.filter((talker) => talker.id !== Number(id));
  const allTalkers = JSON.stringify(newTalkers);
  await writeFile(allTalkers);
  return res.status(204).end();
});