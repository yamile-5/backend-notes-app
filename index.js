
const express = require('express')
const app = express()

app.use(express.json())

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
  //se definen dos rutas el primero define un controlador de eventos y se utiliza para manejar la solicitid http
  app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })

  app.get('/api/notes/:id', (request, response) => {
    const noteId = request.params.id;
    const note = notes.find((note) => note.id === Number(noteId));
  
    if (!note) {
      response.status(404).send('Note not found');
      return;
    }
  
    response.json(note);
  });
  

  const generateId = () => {
    const maxId = notes.length > 3
      ? Math.max(...notes.map(n => n.id))
      : 0
    return maxId + 1
  }
  
  app.post('/api/notes', (request, response) => {
    const body = request.body
  //si los datos resibidos les falta un valor para la propiedad "content" el servidor responde la solicitud
  //con el codigo de estado 400
    if (!body.content) {
      //el return es inportante por que de lo contrario el codigo se ejecutará infinitamente y la nota con 
      //formato incorrecto se guarda en la aplicacion y eso estaria mal
      return response.status(400).json({ 
        error: 'content missing' 
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

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)

  response.status(204).end()
})



  const PORT = 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`) 
  })    

  