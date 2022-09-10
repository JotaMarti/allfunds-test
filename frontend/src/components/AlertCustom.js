import React from "react";
import { Alert, Container } from "react-bootstrap";

function AlertCustom({ variant, alertText }) {
  return (
    <Container className="d-flex justify-content-center position-fixed fixed-bottom">
      <Alert className="w-75" variant={variant}>
        {alertText}
      </Alert>
    </Container>
  );
}

export default AlertCustom;
