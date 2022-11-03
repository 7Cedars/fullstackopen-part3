require('dotenv').config()
const express = require('express')
// const morgan = require('morgan')
const app = express()
const Item = require('./models/item')

// morgan.token('body', function getId (request) {
//   return request.body
// })

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

// app.use(requestBody)
// app.use(morgan(':method :url :response-time :body'))
app.use(express.static('build'))
app.use(express.json())
app.use(requestLogger)


app.get('/info', (request, response) => {
  Item.find({}).then(items => {
    response.send( {
      message: `<h3>Phonebook has entries for ${items.length} people.</h3> 
      <br /> 
      <h4>The date today is ${new Date()} people.</h4>`
    })
  })
})

app.get('/api/persons', (request, response) => {
  Item.find({}).then(items => {
    response.json(items)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Item.findById(request.params.id)
    .then(item => {
      if (item) {
        response.json(item)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  const item = new Item({
    name: body.name,
    number: body.number
  })

  item.save()
    .then(savedItem => {
      response.json(savedItem)
    })
    .catch(error => next(error))
})


app.delete('/api/persons/:id', (request, response, next) => {
  Item.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end(result)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const item = {
    name: body.name,
    number: body.number
  }

  Item.findByIdAndUpdate(request.params.id, item, { new: true, runValidators: true  })
    .then(updatedItem => {
      response.json(updatedItem)
    })
    .catch(error => next(error))
})


// function requestBody (request, response, next) {
//   request.body = JSON.stringify(request.body)
//   next()
// }

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'This is not a correct id!' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)