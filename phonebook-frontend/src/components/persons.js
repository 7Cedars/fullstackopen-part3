import PersonLine from './personLine';

const Persons  = ({ persons }) => {

    return (
        <div>
            <ul>     
            {persons.map(
                // part => console.log(part.name)
                person => <PersonLine key={person.id} person={person} />
                )
            }
            </ul>
        </div>
    )
} 

export default Persons