import { useState, useEffect } from 'react'
import PersonsForm from './components/personForm'
import itemService from './services/personItems'
import PersonLine from './components/personLine'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [personsToShow, setPersonsToShow] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    itemService
      .getAll()
      .then(initialEntries => {
        setPersons(initialEntries)
        setPersonsToShow(initialEntries)
      })
  }, [])
  
  useEffect(() => {
    setPersonsToShow(persons)
  }, [persons])

  const addPerson = (event) => {
    event.preventDefault()
    const entryObject = {
        name: newName,
        number: newNumber
    }
    console.log(persons)
    let doubleEntry = persons.find(person => person.name.toLowerCase() === entryObject.name.toLowerCase())

    if (!doubleEntry) {
      itemService
            .create(entryObject)
            .then(returnedItem => 
              setPersons(persons.concat(returnedItem), 
              setNewName(""),
              setNewNumber(""),
              setSuccessMessage(
                `Added ${entryObject.name} succesfully!`
              ),
              setTimeout(() => {
                setSuccessMessage(null)
              }, 5000)
            ))  
            .catch(error => {
              setErrorMessage(error.response.data.error)
            },
              setTimeout(() => {
                setErrorMessage(null)
              }, 5000)
            )

          } else { 
          
          if (window.confirm(`${entryObject.name} already has an entry in the phonebook. Update number?`)) { 
            itemService
            .update(doubleEntry.id, entryObject)
            .then(returnedItem => 
              setPersons(persons.map(person => (person.id === doubleEntry.id) ? returnedItem : person)), 
              setNewName(""),
              setNewNumber("")
              )
            .catch(error => {
              setErrorMessage(error.response.data.error)
              },
              setTimeout(() => {
                setErrorMessage(null)
              }, 5000)
              )
            } 
          }
    }

  const handleFilterChange = (event) => {

    let _filteredPersons = persons.filter(person => 
      person.name.toLowerCase().includes(event.target.value.toLowerCase())
    )
    setPersonsToShow(_filteredPersons)
  }

  const toggleDeleteOf = (id) => {
    let _Person = persons.find(person => person.id === id)

    if (window.confirm(`Delete the entry for ${_Person.name}?`)) {
      itemService
        .deleteItem(id)
        .then(
          // fix (again..) in section 2 submission?
          setPersons(persons.filter(person => (person.id !== id)))
          )
        .catch(error => {
            setErrorMessage(
              `Information of '${_Person.name}' was already removed from server`
            )
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
        })
      console.log(persons)
    }
  }

  const handleNameChange = (event) => {
    // console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    // console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification.Success message={successMessage} />
      <Notification.Error message={errorMessage} />
      <form >
            <div>
                Filter: <input onChange={handleFilterChange} />
            </div>
        </form>
      <h2>Add a new entry:</h2>
        <PersonsForm 
          addPerson = {addPerson} 
          handleNameChange = {handleNameChange}
          handleNumberChange = {handleNumberChange}
          newName = {newName}
          newNumber = {newNumber}
         /> 
      <h2>Numbers in phonebook</h2>
            <ul>
            {personsToShow.map(
                person => <PersonLine 
                  key={person.id} 
                  person={person} 
                  toggleDelete={() => toggleDeleteOf(person.id)}/>
                )
            }
          </ul>
    </div>
  )
}

export default App