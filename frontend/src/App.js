import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Alert, Button, Col, Container, Row } from "react-bootstrap";
import NewComponent from "./components/NewComponent";
import { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = "http://127.0.0.1:3050/v1";
const archivedDateDefaultYear = 9000;

function App() {

  // AllNews has this structure: {news: [], archivedNews: []}
  const [allNews, setAllNews] = useState(null);
  const [appState, setAppState] = useState("new");
  const [getAllNewsError, setGetAllNewsError] = useState(false)

  const getAllNews = () => {
    axios.get(BASE_URL + "/get-all-news").then((response) => {
      const newsFromBackend = response.data;
      const serializedNews = serializeNews(newsFromBackend);
      const news = serializedNews.filter((newInformation) => {
        const archivedDateYear = newInformation.archiveDate.getFullYear();
        return archivedDateYear > archivedDateDefaultYear;
      });
      const archivedNews = serializedNews.filter((newInformation) => {
        const archivedDateYear = newInformation.archiveDate.getFullYear();
        return archivedDateYear < archivedDateDefaultYear;
      });
      const newState = {
        news,
        archivedNews
      };
      setAllNews(newState);
    }).catch(error => {
      setGetAllNewsError(true);
    }
    );
  };

  const serializeNews = (newsFromBackend) => {
    const serializedNews = newsFromBackend.map((newObject) => {
      const tempNew = {
        ...newObject,
        date: new Date(newObject.date),
        archiveDate: new Date(newObject.archiveDate),
      };
      return tempNew;
    });
    return serializedNews;
  };

  const archiveNew = (idNew) => {
    const payload = {
      id: idNew,
      archiveDate: new Date(Date.now()),
    };
    axios.put(BASE_URL + "/archive-new", payload).then((response) => {
      console.log("Archive Response", response);
      getAllNews();
    });
  };

  const deleteNew = (idNew) => {
    axios.delete(BASE_URL + `/delete-new/${idNew}`).then((response) => {
      const responseStatus = response.status.valueOf();
      console.log("El status", typeof responseStatus);
      if (responseStatus === 200) {
        removeNewFromState(idNew);
      } else {
        // Avisa al usuario del fallo
      }
    });
  };

  const removeNewFromState = (idNewToRemove) => {
    const newArchivedNewsState = allNews.archivedNews.filter((newObject) => {
      return newObject._id !== idNewToRemove;
    });
    const newNewsState = {
      news: [...allNews.news],
      archivedNews: newArchivedNewsState,
    };
    setAllNews(newNewsState);
  };

  useEffect(() => {
    return () => {
      getAllNews();
    };
  }, []);

  return (
    <div className="App">
      <Container>
        <Row className="mb-3">
          <Col>
            <h1 className="text-center">Allfunds News</h1>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <Button className="float-end" onClick={() => setAppState("new")}>
              NEWS
            </Button>
          </Col>
          <Col>
            <Button onClick={() => setAppState("archive")}>ARCHIVED</Button>
          </Col>
        </Row>
        {appState === "new"
          ? allNews &&
            allNews.news.map((newInformation) => {
              return (
                <NewComponent
                  key={newInformation._id}
                  newInformation={newInformation}
                  archiveNew={archiveNew}
                  deleteNew={deleteNew}
                  appState={appState}
                ></NewComponent>
              );
            })
          : allNews &&
            allNews.archivedNews.map((newInformation) => {
              return (
                <NewComponent
                  key={newInformation._id}
                  newInformation={newInformation}
                  archiveNew={archiveNew}
                  deleteNew={deleteNew}
                  appState={appState}
                ></NewComponent>
              );
            })}
        {getAllNewsError && <Alert variant="danger">Can't connect to database</Alert>}
      </Container>
    </div>
  );
}

export default App;
