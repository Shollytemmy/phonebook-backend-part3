const express = require("express");
const app = express()
const morgan = require("morgan");
const cors = require("cors");
const PORT = process.env.PORT || 4000;



app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())




let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/info', (req, res) => {
    const info = `Phonebook has info for ${persons.length} people`
    const date = new Date()
    res.send(`${info} <br> ${date}`)
})

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    const person = persons.find((p) => p.id === id);

    if (person) {
        res.json(person);
    } else {
        res.status(404).send({ error: "Person not found" });
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    console.log(id);
    
    persons = persons.filter((p) => p.id !== id);
    res.status(204).end();
})

app.post("/api/persons", (req, res) => {
  const { name, number } = req.body;
  

  if (!name || !number) {
    return res.status(400).json({ error: "Name and number are required" });
    }
    
     const cleanName = name.trim();
     const cleanNumber = number.trim();

  const nameExists = persons.find(
    (p) => p.name.toLowerCase() === cleanName.toLowerCase(),
  );

  if (nameExists) {
    return res.status(400).json({ error: "name must be unique" });
  }

   

  const person = {
    id: Math.floor(Math.random() * 1000000),
    name: cleanName,
    number: cleanNumber,
  };

  persons = persons.concat(person);

    res.status(201).json(person);
    
});

morgan.token("body", (req) => JSON.stringify(req.body));

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body"),
);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})