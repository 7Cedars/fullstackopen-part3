import React from 'react'

const PersonLine  = ({ person, toggleDelete }) => {

    return (
            <p> {person.name}: {person.number} 
            <button onClick={toggleDelete}> delete </button>
            </p>
    )
} 

export default PersonLine