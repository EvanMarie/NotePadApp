import React from "react";
import { Note } from "../App";
import { Navigate, Outlet, useParams } from "react-router-dom";

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
