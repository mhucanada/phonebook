import React, { useState, useEffect } from 'react'
//import axios from 'axios'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personService from './services/persons'

const App = () => {
    const [persons, setPersons] = useState([])
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState([])
    const [filter, setFilter] = useState('')
    const [notification, setNotification] = useState(null)
    const [errorMessage, setErrorMessage] = useState(null)



    useEffect(() => {
        personService
            .getAll()
            .then(response => {
                console.log(response)
                console.log("promise fulfilled")
                setPersons(response)
            })
    }, [])

    const addPerson = (event) => {
        event.preventDefault()

        const dupe = persons.filter(person => {
            var personName = person.name.toLowerCase()
            return personName === newName
        })

        const personObject = {
            name: newName,
            number: newNumber,
            id: newName
        }

        if (dupe.length === 0) {
            personService
                .create(personObject)
                .then(returnedPerson => {
                    setPersons(persons.concat(returnedPerson))
                    setNewName('')
                    setNewNumber('')
                    setNotification(`Added ${newName}`)
                    setTimeout(() => {
                        setNotification(null)
                    }, 5000)
                })
                .catch(error => {
                    console.log(error.response.data)
                    setErrorMessage(
                        `${error.response.data.error}`
                    )
                    setTimeout(() => {
                        setErrorMessage(null)
                    }, 5000);
                })
        } else {
            if (window.confirm(`${newName} is already in the phonebook. Would you like to update ${newName}'s number?`)) {
                const person = persons.find(p => p.id === dupe[0].id)
                const updatedNumber = { ...person, number: newNumber }

                personService
                    .update(dupe[0].id, updatedNumber)
                    .then(returnedPerson => {
                        setPersons(persons.map(person => person.id !== dupe[0].id ? person : updatedNumber))
                    })
                    .catch(error => {
                        setErrorMessage(
                            `${newName} has already been removed from the phonebook`
                        )
                        setTimeout(() => {
                            setErrorMessage(null)
                        }, 5000);
                    })
                setNewName("")
                setNewNumber('')
            } else {
                setNewName('')
                setNewNumber('')
            }
            console.log(dupe)
        }


    }


    const handleNameChange = (event) => {
        console.log(event.target.value)
        setNewName(event.target.value)
    }

    const handleNumberChange = (event) => {
        console.log(event.target.value)
        setNewNumber(event.target.value)
    }

    const handleFilterChange = (event) => {
        console.log(event.target.value)
        setFilter(event.target.value)
    }

    const personsToShow = (filter === '')
        ? persons
        : persons.filter(person => {
            var personName = person.name.toLowerCase()
            return personName.includes(filter)
        })

    const deleteNumberOf = (id) => {

        if (window.confirm("Do you really want to delete this person?")) {
            personService
                .deletePerson(id)
            setPersons(persons.filter(person => person.id !== id))
        }
    }

    const ErrorNotification = ({ message }) => {
        if (message === null) {
            return null
        }

        return (
            <div className="error">
                {message}
            </div>
        )
    }

    const NonErrorNotification = ({ message }) => {
        if (message === null) {
            return null
        }

        return (
            <div className="notification">
                {message}
            </div>
        )
    }

    return (
        <div>
            <h2>Phonebook</h2>
            <NonErrorNotification message={notification} />
            <ErrorNotification message={errorMessage} />
            <Filter filter={filter} handleFilterChange={handleFilterChange} />
            <h2>Add New Person</h2>
            <PersonForm addPerson={addPerson}
                newName={newName}
                newNumber={newNumber}
                handleNameChange={handleNameChange}
                handleNumberChange={handleNumberChange} />
            <h2>Numbers</h2>
            <ul>
                {personsToShow.map((person, i) =>
                    <Persons
                        key={i}
                        person={person}
                        deleteNumber={() => deleteNumberOf(person.id)}
                    />
                )}
            </ul>

        </div>
    )
}

export default App