const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./db/connect');

const port = process.env.PORT || 8080;
const app = express();

app
  .use(bodyParser.json())
  .use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
  })
  .use('/', require('./routes'));
  

mongodb.initDb((err, mongodb) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port);
    console.log(`Connected to DB and listening on ${port}`);
  }
});




app.get('/contacts', async (req, res) => {
  try {
    // Read the contents of the contacts.json file
    const data = await fs.readFile('contacts.json', 'utf-8');

    // Parse the JSON data
    const contacts = JSON.parse(data);

    // Send the contacts as a JSON response
    res.json(contacts);
  } catch (error) {
    // Handle errors, e.g., file not found or invalid JSON format
    console.error('Error reading contacts.json:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// New route to retrieve a single contact by ID
app.get('/contacts/:id', async (req, res) => {
  try {
    const data = await fs.readFile('contacts.json', 'utf-8');
    const contacts = JSON.parse(data);

    // Find the contact with the specified ID
    const contactId = req.params.id;
    const contact = contacts.find(c => c.id === contactId);

    if (!contact) {
      // If contact is not found, return a 404 Not Found response
      res.status(404).json({ error: 'Contact not found' });
    } else {
      // If contact is found, return it as a JSON response
      res.json(contact);
    }
  } catch (error) {
    console.error('Error reading contacts.json:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});