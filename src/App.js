import React, { useState, useEffect } from "react";
import "./App.css";
import "@aws-amplify/ui-react/styles.css";
import { API, Storage } from 'aws-amplify';
import {
  Button,
  Flex,
  Tabs,
  Image,
  TabItem,
  Text,
  View,
  withAuthenticator,
  Pagination,
  usePagination
} from '@aws-amplify/ui-react';
import { MenuComponent } from './components/menu/MenuComponent';
import { listNotes } from "./graphql/queries";
import {
  deleteNote as deleteNoteMutation,
} from "./graphql/mutations";
import { CreateSlideModal } from "./components/createSlideModal/CreateSlideModal";

const App = ({ signOut }) => {
  const [notes, setNotes] = useState([]);
  const [currentPageIndex, setCurrentPageIndex] = React.useState(1);
  const totalPages = notes.length;
  const [createSlideModalOpen, toggleCreateSlideModal] = useState(false)
  
  useEffect(() => {
    fetchNotes();
  }, []);

  const handleNextPage = () => {
    setCurrentPageIndex(currentPageIndex + 1);
  };
  const handlePreviousPage = () => {
    console.log('handlePreviousPage');
    setCurrentPageIndex(currentPageIndex - 1);
  };
  const handleOnChange = (newPageIndex) => {
    setCurrentPageIndex(newPageIndex);
  };
  
const verifyPage = (currentPageIndex, index) => {
  if(currentPageIndex === index+1) {
    return true
  } else {
    return false
  }
}

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
      {createSlideModalOpen && <CreateSlideModal createSlideModalOpen={createSlideModalOpen} toggleCreateSlideModal={toggleCreateSlideModal} setNotes={setNotes} listNotes={notes}/>}
      <Tabs defaultIndex={1}>
      <MenuComponent createSlideModalOpen={createSlideModalOpen} toggleCreateSlideModal={toggleCreateSlideModal} signOut={signOut}></MenuComponent>
      <TabItem title="Present">
      <View>
      {notes.map((note, index) => (

  <Flex
    key={note.id || note.name}
    direction="column"
    justifyContent="center"
    alignItems="center"
  >
    {note.image && verifyPage(currentPageIndex, index) && (
      <Image
      boxShadow="3px 3px 3px 3px var(--amplify-colors-neutral-60)"
        borderRadius="10px"
        border="1px black"
        width="78%"
        marginTop="10px"
        marginBottom="10px"
        src={note.image}
        alt={`visual aid for ${notes.name}`}
      />
    )}
  </Flex>
))}
        <Pagination
        currentPage={currentPageIndex}
        totalPages={totalPages}
        onNext={handleNextPage}
        onPrevious={handlePreviousPage}
        onChange={handleOnChange}
        />
      </View>

      </TabItem>
      <TabItem title="Organize">
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
        style={{ width: 200 }}
      />
    )}
    <Button variation="link" onClick={() => deleteNote(note)}>
      Delete Slide
    </Button>
  </Flex>
))}
      </View>
      </TabItem>
      </Tabs>
      
      
    </View>
  );
};

export default withAuthenticator(App);