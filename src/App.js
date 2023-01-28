import React, { useState, useEffect } from "react";
import "./App.css";
import "@aws-amplify/ui-react/styles.css";
import { API, Storage } from 'aws-amplify';
import {
  Button,
  Flex,
  Heading,
  Image,
  Text,
  View,
  withAuthenticator,
} from '@aws-amplify/ui-react';
import { MenuComponent } from './components/menu/MenuComponent';
import { listNotes } from "./graphql/queries";
import {
  deleteNote as deleteNoteMutation,
} from "./graphql/mutations";
import { CreateSlideModal } from "./components/createSlideModal/CreateSlideModal";

const App = ({ signOut }) => {
  const [notes, setNotes] = useState([]);
  const [createSlideModalOpen, toggleCreateSlideModal] = useState(false)
  
  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    const apiData = await API.graphql({ query: listNotes });
    const notesFromAPI = apiData.data.listNotes.items;
    await Promise.all(
      notesFromAPI.map(async (note) => {
        if (note.image) {
          const url = await Storage.get(note.name);
          note.image = url;
        }
        return note;
      })
    );
    setNotes(notesFromAPI);
  }


  async function deleteNote({ id, name }) {
    const newNotes = notes.filter((note) => note.id !== id);
    setNotes(newNotes);
    await Storage.remove(name);
    await API.graphql({
      query: deleteNoteMutation,
      variables: { input: { id } },
    });
  }
  return (
    <View className="App">
      <MenuComponent createSlideModalOpen={createSlideModalOpen} toggleCreateSlideModal={toggleCreateSlideModal} signOut={signOut}></MenuComponent>
      {createSlideModalOpen && <CreateSlideModal createSlideModalOpen={createSlideModalOpen} toggleCreateSlideModal={toggleCreateSlideModal}/>}
      <Heading level={1}>My Notes App</Heading>
      <Heading level={2}>Current Notes</Heading>
      <View margin="3rem 0">
      {notes.map((note) => (
  <Flex
    key={note.id || note.name}
    direction="row"
    justifyContent="center"
    alignItems="center"
  >
    <Text as="strong" fontWeight={700}>
      {note.name}
    </Text>
    <Text as="span">{note.description}</Text>
    {note.image && (
      <Image
        src={note.image}
        alt={`visual aid for ${notes.name}`}
        style={{ width: 400 }}
      />
    )}
    <Button variation="link" onClick={() => deleteNote(note)}>
      Delete note
    </Button>
  </Flex>
))}
      </View>
      
    </View>
  );
};

export default withAuthenticator(App);