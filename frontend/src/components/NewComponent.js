import React from "react";
import { Button, Col, Container, Row, Fade } from "react-bootstrap";

const {TYPE_NEW, TYPE_ARCHIVED } = require("../util/constants");

function newComponent({ newObject, archiveNew, deleteNew, appState, testId }) {
  const extractDate = (date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const dateCreated = `${day}-${month}-${year}`;
    return dateCreated;
  };

  const { _id, author, date, title, content, description, archiveDate } = newObject;
  const dateCreated = extractDate(date);
  const dateArchived = extractDate(archiveDate);

  return (
    <Fade in={true} appear={true}>
      <div className="New-component mb-3 p-3" data-testid={testId}>
        <Container>
          <Row>
            <Col>
              <p>Author: {author || "Missing Author"}</p>
            </Col>
            <Col>
              <p className="Date">Date: {dateCreated || "Missing date"}</p>
            </Col>
          </Row>
          <Row>
            <Col>
              <h2>{title || "Missing title"}</h2>
            </Col>
            {appState === TYPE_ARCHIVED ? (
              <Col>
                <p className="Date">Archived on: {dateArchived || "Missing date"}</p>
              </Col>
            ) : null}
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
              {appState === TYPE_NEW ? (
                <Button className="float-end" onClick={() => archiveNew(_id)}>
                  ARCHIVE
                </Button>
              ) : (
                <Button variant="danger" className="float-end" onClick={() => deleteNew(_id)}>
                  REMOVE
                </Button>
              )}
            </Col>
          </Row>
        </Container>
      </div>
    </Fade>
  );
}

export default newComponent;
