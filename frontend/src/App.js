import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Alert, Button, Col, Container, Row } from "react-bootstrap";
import NewComponent from "./components/NewComponent";
import { useEffect, useState } from "react";
import axios from "axios";
import AlertCustom from "./components/AlertCustom";

const BASE_URL = "http://127.0.0.1:3050/v1";
const archivedDateDefaultYear = 9000;

function App() {

  // AllNews has this structure: {news: [], archivedNews: []}
  const [allNews, setAllNews] = useState(null);
  const [appState, setAppState] = useState("new");
  const [getAllNewsError, setGetAllNewsError] = useState(false)
  const [archiveNewError, setArchiveNewError] = useState(false)
  const [deleteNewError, setDeleteNewError] = useState(false)

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

  const archiveNew = (idNewToArchive) => {
    const payload = {
      id: idNewToArchive,
      archiveDate: new Date(Date.now()),
    };
    axios.put(BASE_URL + "/archive-new", payload).then((response) => {
      getAllNews();
    }).catch(error => {
      setArchiveNewError(true);
    });
  };

  const deleteNew = (idNewToRemove) => {
    axios.delete(BASE_URL + `/delete-new/${idNewToRemove}`).then((response) => {
      const responseStatus = response.status.valueOf();
      if (responseStatus === 200) {
        removeNewFromState(idNewToRemove);
      } else {
        setDeleteNewError(true);
      }
    }).catch(error => {
      setDeleteNewError(true);
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
        {getAllNewsError && <AlertCustom variant={"danger"} alertText={"Can't connect to database"}></AlertCustom>}
        {archiveNewError && <AlertCustom variant={"danger"} alertText={"Error archiving the new"}></AlertCustom>}
        {deleteNewError && <AlertCustom variant={"danger"} alertText={"Error deleting the new"}></AlertCustom>}
      </Container>
    </div>
  );
}

export default App;
