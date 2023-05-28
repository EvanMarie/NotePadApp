import React from "react";
import { Note } from "../App";
import {
  Navigate,
  Outlet,
  useOutletContext,
  useParams,
} from "react-router-dom";

type NoteLayoutProps = {
  notes: Note[];
};

const NoteLayout = ({ notes }: NoteLayoutProps) => {
  const { id } = useParams<{ id: string }>();
  const note = notes.find((n) => n.id === id);

  /* with replace, if you hit the back button, you won't go back to the
       page that does not exist */
  if (note === null) return <Navigate to="/" replace />;
  return <Outlet context={note} />;
};

export default NoteLayout;

export function useNote() {
  /*  useOutletContext is a hook that returns the context of the nearest 
    ancestor. In this case, it can be used in any of the routes for access
    to all of the context information. This helper function makes that 
    easier. */
  return useOutletContext<Note>();
}
