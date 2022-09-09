import React from "react";
import { Button, Col, Container, Row } from "react-bootstrap";

function newComponent({ newInformation, archiveNew, deleteNew, appState }) {
  const extractDate = (date) => {
    const day = date.getDay().toString();
    const month = date.getDay().toString();
    const year = date.getFullYear().toString();
    const dateCreated = `${day}-${month}-${year}`;
    return dateCreated;
  };

  const { _id, author, date, title, content, description } = newInformation;
  const dateCreated = extractDate(date);

  return (
    <div className="New-component mb-3">
      <Container>
        <Row>
          <Col>
            <p>{author || "Missing Author"}</p>
          </Col>
          <Col>
            <p className="Date-created">{dateCreated || "Missing date"}</p>
          </Col>
        </Row>
        <Row>
          <Col>
            <h2>{title || "Missing title"}</h2>
          </Col>
        </Row>
        <Row>
          <Col>
            <h6>{description || "Missing description"}</h6>
          </Col>
        </Row>
        <Row>
          <Col>
            <p>{content || "Content"}</p>
          </Col>
          <Col>
            {appState === "new" ? (
              <Button className="float-end" onClick={() => archiveNew(_id)}>
                ARCHIVE
              </Button>
            ) : (
              <Button className="float-end" onClick={() => deleteNew(_id)}>
                DELETE
              </Button>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default newComponent;
