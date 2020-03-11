import React, { useCallback } from 'react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './Note.css'
import NotefulContext from '../NotefulContext'
import config from '../config';

export default function Note(props) {

  const handleDeleteRequest = (noteId,cb) => {
    fetch(config.API_ENDPOINT + `/notes/${props.id}`, {
    method: 'DELETE',
    headers: {
      'content-type': 'application/json'
    },
  })
  .then(res => {
    if(!res.ok){
      return res.json().then(error=>{
        throw error
      })
    }
    return res.json()
  })
  .then(() =>{
    cb(noteId)
  })
  .catch(error =>{
    console.error(error)
  })
}
  

  return (
    <NotefulContext.Consumer>
      {(context)=> (
    <div className='Note'>
      <h2 className='Note__title'>
        <Link to={`/note/${props.id}`}>
          {props.name}
        </Link>
      </h2>
      <button onClick={()=>{
        handleDeleteRequest(
          props.id,
          context.deleteNote
        )
      }}
      className='Note__delete' type='button'>
        <FontAwesomeIcon icon='trash-alt' />
        {' '}
        remove
      </button>
      <div className='Note__dates'>
        <div className='Note__dates-modified'>
          Modified
          {' '}
          <span className='Date'>
            {format(props.modified, 'Do MMM YYYY')}
          </span>
        </div>
      </div>
    </div>
    )}
    </NotefulContext.Consumer>
  )
}

//hello test git
