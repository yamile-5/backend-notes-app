
const express = require('express')
const cors = require('cors');
const morgan = require('morgan');

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))
app.use(morgan('dev'));

let notes = [
    {
      id: 1,
      content: "HTML is easy",
      important: true
    },
    {
      id: 2,
      content: "Browser can execute only JavaScript",         
      important: false
    },
    {
      id: 3,
      content: "GET and POST are the most important methods of HTTP protocol",
      important: true
    }
]
 
const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id))
    : 0
  return maxId + 1
}

app.get('/api/notes', (request, response)=>{
   response.json(notes)

})
  
app.get('/api/notes/:id',(request, response) =>{
  const id = Number(request.params.id)
  const note = notes.find(note => note.id === id)
   response.json(note)

  })
    
app.post('/api/notes', (request, response) => {
  const body = request.body
  //si los datos resibidos les falta un valor para la propiedad "content" el servidor responde la solicitud
  //con el codigo de estado 400
   if (!body.content || !body.important) {
      //el return es inportante por que de lo contrario el codigo se ejecutará infinitamente y la nota con 
      //formato incorrecto se guarda en la aplicacion y eso estaria mal
   return response.status(400).json({ error: 'content missing' 
      
 })
  }
  
const note = {
  //si content tiene un valor la nota se basara en los datos resibidos
  content: body.content,
//si falta important el valor predeterminado sera false
  important: Boolean(body.important) || false,
    id: generateId(),
    
  }
    notes = notes.concat(note)       
  
    response.json(note)   
  })

app.put('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id);
  const noteIndex = notes.findIndex((note) => note.id === id);
  if (noteIndex === -1) {
    response.status(404).send('note not found');
    return;
  }
  const updatedNote = { ...notes[noteIndex], ...request.body };
  notes[noteIndex] = updatedNote;
  response.json(updatedNote);
});


app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id);
  notes =notes.filter(nota => nota.id !== id)
  response.status(204).end()
});
  
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
   
app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`) 
})    

  