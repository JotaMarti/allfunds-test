import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Col, Container, Row } from "react-bootstrap";
import NewComponent from "./components/NewComponent";
import { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = "http://127.0.0.1:3050/v1";

function App() {
  const [allNews, setAllNews] = useState(null);
  const [appState, setAppState] = useState("new");

  const getAllNews = () => {
    axios.get(BASE_URL + "/get-all-news").then((response) => {
      const newsFromBackend = response.data;
      const serializedNews = serializeNews(newsFromBackend);
      const news = serializedNews.filter((newInformation) => {
        return newInformation.archiveDate.getFullYear() > 9000;
      });
      const archivedNews = serializedNews.filter((newInformation) => {
        return newInformation.archiveDate.getFullYear() < 9000;
      });
      const newState = {
        news,
        archivedNews
      };
      setAllNews(newState);
    });
  };

  const serializeNews = (newsFromBackend) => {
    const serializedNews = [];
    newsFromBackend.map((newInformation) => {
      const tempNew = {
        ...newInformation,
        date: new Date(newInformation.date),
        archiveDate: new Date(newInformation.archiveDate),
      };
      serializedNews.push(tempNew);
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
        {allNews && appState === "new"
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
      </Container>
    </div>
  );
}

export default App;
