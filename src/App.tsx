import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import { Navigate, Route, Routes } from "react-router-dom";
import NewNote from "./components/NewNote";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { useMemo } from "react";
import { v4 as uuidV4 } from "uuid";
import NoteList from "./NoteList";
import NoteLayout from "./components/NoteLayout";
import Note from "./components/Note";
import EditNote from "./components/EditNote";

/* Types:
        - Note is an object with an id and NoteData
        - NoteData is an object with a title, markdown, and tags
        - Tag is an object with an id and label
        - RawNote is an object with an id and RawNoteData, use for keeping
          track of the IDs of notes.
        - RawNoteData is an object with a title, markdown, and tagIds
        - The purpose of RawNote and RawNoteData is when we change 
          any tag, then we will not have to change all the notes, rather
          the change will be propagated to all the notes
    */

export type Note = {
  id: string;
} & NoteData;

export type RawNote = {
  id: string;
} & RawNoteData;

export type RawNoteData = {
  title: string;
  markdown: string;
  tagIds: string[];
};

export type NoteData = {
  title: string;
  markdown: string;
  tags: Tag[];
};

export type Tag = {
  id: string;
  label: string;
};

/* 
Use Local Storage:
  - This hook is used to store data in the browser's local storage
  - The NOTES and TAGS are capitalized as not to conflict with the
    notes and tags variables on local host.

Routes:
  - path: string with the path to match
  - element: the element to render when the path matches
  - children: nested routes - example: /:id below
  - index: nested route that matches the parent route
  - path = "*" is a catch-all route and in this case navigates to the home page
    if the user navigates to a non-existent route
    - this must go at the end of the Routes component, or it will match all 
    routes
*/

const App = () => {
  const [notes, setNotes] = useLocalStorage<RawNote[]>("NOTES", []);
  const [tags, setTags] = useLocalStorage<Tag[]>("TAGS", []);

  /* Loops through all the notes, and for each one, keep all the info about
      the notes, but also get the tags that have the associated ids inside
      the note being stored. 
      - runs every time the notes or tags change
  */
  const notesWithTags = useMemo(() => {
    return notes.map((note) => {
      return {
        ...note,
        tags: tags.filter((tag) => note.tagIds.includes(tag.id)),
      };
    });
  }, [notes, tags]);

  /* takes in note data, sets notes based on previous notes, returns an array
  with all previous notes, also gets the note data, and sets the id to a
  random uuid, and sets the tagIds to the ids of the tags that are passed in,
  gets the tags from the tags array, and maps over them, returning the ids
  of the tags. This creates a note, saves it to the notes array, and saves
  all of that to local storage.
  */

  function onCreateNote({ tags, ...data }: NoteData) {
    setNotes((prevNotes) => {
      return [
        ...prevNotes,
        { ...data, id: uuidV4(), tagIds: tags.map((tag) => tag.id) },
      ];
    });
  }

  function onUpdateNote(id: string, { tags, ...data }: NoteData) {
    setNotes((prevNotes) => {
      return prevNotes.map((note) => {
        if (note.id === id) {
          return { ...note, ...data, tagIds: tags.map((tag) => tag.id) };
        } else {
          return note;
        }
      });
    });
  }

  function onDeleteNote(id: string) {
    setNotes((prevNotes) => {
      return prevNotes.filter((note) => note.id !== id);
    });
  }

  function addTag(tag: Tag) {
    setTags((prev) => [...prev, tag]);
  }

  return (
    <Container className="my-4">
      <Routes>
        <Route
          path="/"
          element={<NoteList notes={notesWithTags} availableTags={tags} />}
        />
        <Route
          path="/new"
          element={
            <NewNote
              onSubmit={onCreateNote}
              onAddTag={addTag}
              availableTags={tags}
            />
          }
        />

        <Route path="/:id" element={<NoteLayout notes={notesWithTags} />}>
          <Route index element={<Note onDelete={onDeleteNote} />} />
          <Route
            path="edit"
            element={
              <EditNote
                onSubmit={onUpdateNote}
                onAddTag={addTag}
                availableTags={tags}
              />
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Container>
  );
};

export default App;
