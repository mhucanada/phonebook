import React from 'react';

const Persons = ({ person, deleteNumber }) => {
    return (
        <div>
            <li>
                Name: {person.name}<br/>Number: {person.number}
                <button onClick={deleteNumber}>delete</button>
            </li>
        </div>
    );
};

export default Persons;