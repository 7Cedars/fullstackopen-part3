import React from 'react'

const PersonsForm  = ( props ) => {

    return (
        <form onSubmit={props.addPerson}>
            <div>
            Name: <input
                value={props.newName}
                onChange={props.handleNameChange} 
            />
            </div>
            <div>
            Number: <input
                value={props.newNumber}
                onChange={props.handleNumberChange} 
            />
            </div>
            <button type="submit">save</button>
            </form>
        )
} 

export default PersonsForm