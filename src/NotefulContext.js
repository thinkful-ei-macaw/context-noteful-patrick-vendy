import React from 'react';

const NotefulContext = React.createContext({
    notes: [],
    folders: [],
    deleteNotes: () => {}
})

export default NotefulContext