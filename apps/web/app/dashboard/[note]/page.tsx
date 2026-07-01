import React from 'react'

const Note = (params: { noteId: string }) => {
  const { noteId } = params;
  
  return (
    <div>Note: {noteId}</div>
  )
}

export default Note