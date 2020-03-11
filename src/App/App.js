import React, {Component} from 'react';
import {Route, Link} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import NoteListNav from '../NoteListNav/NoteListNav';
import NotePageNav from '../NotePageNav/NotePageNav';
import NoteListMain from '../NoteListMain/NoteListMain';
import NotePageMain from '../NotePageMain/NotePageMain';
import dummyStore from '../dummy-store';
import NotefulContext from '../NotefulContext';
import {getNotesForFolder, findNote, findFolder} from '../notes-helpers';
import './App.css';
import config from '../config';

class App extends Component {
    state = {
        notes: [],
        folders: []
    };


    deleteNotes = noteId =>{
        const newNotes = this.state.notes.filter(n => n.id !== noteId)
        this.setState({
            notes:newNotes
        })
    }
    handleFolderFetch = ()=>{
        fetch(config.API_ENDPOINT + `/folders`)
        .then(res=>{
            if(!res.ok){
                return res.json().then(error=>{
                  throw error
                })
              }
              return res.json()
            })
            .then(data =>{
              console.log(data)
              this.setState({folders: data})
            //   data.map(folder =>{
            //     return folder.id
            //     })
            })
            .catch(error =>{
              console.error(error)
            })
    }

    handleNoteFetch = ()=>{
        fetch(config.API_ENDPOINT + `/notes`)
        .then(res=>{
            if(!res.ok){
                return res.json().then(error=>{
                  throw error
                })
              }
              return res.json()
            })
            .then(data =>{
              console.log(data)
              this.setState({notes: data})
            //   data.map(folder =>{
            //     return folder.id
            //     })
            })
            .catch(error =>{
              console.error(error)
            })
    }
    componentDidMount() {
        // fake date loading from API call
        this.handleFolderFetch();
        this.handleNoteFetch();
        
    }

    renderNavRoutes() {
        const {notes, folders} = this.state;
        return (
            <>
                {['/', '/folder/:folderId'].map(path => (
                    <Route
                        exact
                        key={path}
                        path={path}
                        render={routeProps => (
                            <NoteListNav
                                folders={folders}
                                notes={notes}
                                {...routeProps}
                            />
                        )}
                    />
                ))}
                <Route
                    path="/note/:noteId"
                    render={routeProps => {
                        const {noteId} = routeProps.match.params;
                        const note = findNote(notes, noteId) || {};
                        const folder = findFolder(folders, note.folderId);
                        return <NotePageNav {...routeProps} folder={folder} />;
                    }}
                />
                <Route path="/add-folder" component={NotePageNav} />
                <Route path="/add-note" component={NotePageNav} />
            </>
        );
    }

    renderMainRoutes() {
        const {notes, folders} = this.state;
        return (
            <>
                {['/', '/folder/:folderId'].map(path => (
                    <Route
                        exact
                        key={path}
                        path={path}
                        render={routeProps => {
                            const {folderId} = routeProps.match.params;
                            const notesForFolder = getNotesForFolder(
                                notes,
                                folderId
                            );
                            return (
                                <NoteListMain
                                    {...routeProps}
                                    notes={notesForFolder}
                                />
                            );
                        }}

                        // component = {NoteListMain}
                    />
                ))}
                <Route
                    path="/note/:noteId"
                    render={routeProps => {
                        const {noteId} = routeProps.match.params;
                        const note = findNote(notes, noteId);
                        return <NotePageMain {...routeProps} note={note} />;
                    }}
                    // component={NotePageMain}
                />
            </>
        );
    }

    render() {
        const contextValue ={ 
            folders: this.state.folders, 
            notes: this.state.notes,
            deleteNotes: this.deleteNotes }

        return (
            
            <div className="App">
                <NotefulContext.Provider value={contextValue}>
                <nav className="App__nav">{this.renderNavRoutes()}</nav>
                </NotefulContext.Provider>
                <header className="App__header">
                    <h1>
                        <Link to="/">Noteful</Link>{' '}
                        <FontAwesomeIcon icon="check-double" />
                    </h1>
                </header>
                <main className="App__main">{this.renderMainRoutes()}</main>
            </div>
        );
    }
}

export default App;
