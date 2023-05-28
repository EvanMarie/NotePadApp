import React, { FormEvent, useRef, useState } from "react";
import { Button, Col, Form, Row, Stack } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import CreatableReactSelect from "react-select/creatable";
import { NoteData, Tag } from "../App";
import { v4 as uuid4 } from "uuid";

type NoteFormProps = {
  onSubmit: (data: NoteData) => void;
  onAddTag: (tag: Tag) => void;
  availableTags: Tag[];
};

export function NoteForm({ onSubmit, onAddTag, availableTags }: NoteFormProps) {
  /* useRef:
        - useRef is a hook that returns a mutable ref object whose .current property
            is initialized to the passed argument (initialValue)
        - The returned object will persist for the full lifetime of the component
        - useRef() will not cause a component to re-render when the value of the ref
            object changes
        
    handleSubmit:
        - FormEvent is a type that represents the event object passed to the
            onSubmit handler of a form
        - e.preventDefault() prevents the default action of the event from being
            triggered
        - e.g. prevents the form from being submitted and the page from reloading

            */

  const titleRef = useRef<HTMLInputElement>(null);
  const markdownRef = useRef<HTMLTextAreaElement>(null);
  // Tags will start as an empty array of Tag objects
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const navigate = useNavigate();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    /* ! is a non-null assertion operator which tells TypeScript that the 
    value will not be null or undefined, since it is required below, this 
    is safe. */

    onSubmit({
      title: titleRef.current!.value,
      markdown: markdownRef.current!.value,
      tags: selectedTags,
    });

    // upon submission, navigate to the previous page
    navigate("..");
  }

  /* Form and Stack are bootstrap components
        - Form is a wrapper for forms
        - Stack is a wrapper for a group of elements
        - gap={4} is the space between elements in the stack

    React-Select:
        - CreatableReactSelect is a component that allows users to create 
            their own options
        - the value prop is an array of Tag objects with a label and id,
            which is what React-Select expects
        - tags are mapped so that they are converted from a label and a value
            to a label and an id
        - this converts from the value that React Select expects to the value
            that we want to store in our state
    */

  return (
    <Form onSubmit={handleSubmit}>
      <Stack gap={4}>
        <Row>
          <Col>
            <Form.Group className="mb-3" controlId="title">
              <Form.Label className="my_label">Title</Form.Label>
              <Form.Control
                ref={titleRef}
                className="form_field"
                required
                type="text"
                placeholder="Enter title"
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3" controlId="tags">
              <Form.Label className="my_label">Tags</Form.Label>
              <CreatableReactSelect
                onCreateOption={(label) => {
                  const newTag = { id: uuid4(), label: label };
                  onAddTag(newTag);
                  setSelectedTags((prev) => [...prev, newTag]);
                }}
                value={selectedTags.map((tag) => {
                  return { label: tag.label, value: tag.id };
                })}
                options={availableTags.map((tag) => {
                  return { label: tag.label, value: tag.id };
                })}
                onChange={(tags) => {
                  setSelectedTags(
                    tags.map((tag) => {
                      return { label: tag.label, id: tag.value };
                    })
                  );
                }}
                isMulti
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Form.Group className="mb-3" controlId="markdown">
            <Form.Label className="my_label">Note</Form.Label>
            <Form.Control
              ref={markdownRef}
              className="form_field"
              required
              as="textarea"
              rows={15}
              placeholder="Enter title"
            />
          </Form.Group>
          <Stack direction="horizontal" gap={2} className="justify-content-end">
            <Button type="submit">Save</Button>
            <Link to="..">
              <Button type="button" variant="outline-secondary">
                Cancel
              </Button>
            </Link>
          </Stack>
        </Row>
      </Stack>
    </Form>
  );
}

export default NoteForm;
