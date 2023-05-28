import { Badge, Button, Col, Row, Stack } from "react-bootstrap";
import { useNote } from "./NoteLayout";
import styles from "../NoteList.module.css";
import { Link, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
// "https://esm.sh/react-markdown@7"

type NoteProps = {
  onDelete: (id: string) => void;
};

const Note = ({ onDelete }: NoteProps) => {
  const note = useNote();
  const navigate = useNavigate();

  return (
    <div>
      <Row className="align-items-center mb-4">
        <Col>
          <h1>{note.title}</h1>
          {note.tags.length > 0 && (
            <Stack gap={1} direction="horizontal" className="flex-wrap">
              {note.tags.map((tag) => (
                <Badge
                  className={`text-truncate ${styles.badgetag}`}
                  key={tag.id}
                >
                  {tag.label}
                </Badge>
              ))}
            </Stack>
          )}
        </Col>
        <Col xs="auto">
          <Stack gap={2} direction="horizontal">
            <Link to={`/${note.id}/edit`}>
              <Button variant="primary">Edit</Button>
            </Link>

            <Button
              onClick={() => {
                onDelete(note.id);
                navigate("/");
              }}
            >
              Delete
            </Button>
            <Link to="/">
              <Button variant="outline-secondary">Back</Button>
            </Link>
          </Stack>
        </Col>
      </Row>
      <ReactMarkdown>{note.markdown}</ReactMarkdown>
    </div>
  );
};

export default Note;
