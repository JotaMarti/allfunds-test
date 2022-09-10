import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Col, Container, Row } from "react-bootstrap";
import NewComponent from "./components/NewComponent";
import { useEffect, useState } from "react";
import axios from "axios";
import AlertCustom from "./components/AlertCustom";

const { GET_ALL_NEWS_URL, ARCHIVE_NEW_URL, DELETE_NEW_URL, headers, archivedDateDefaultYear } = require("./util/constants");

function App() {
  // AllNews has this structure: {news: [], archivedNews: []}
  const [allNews, setAllNews] = useState(null);
  const [appState, setAppState] = useState("new");
  const [getAllNewsError, setGetAllNewsError] = useState(false);
  const [archiveNewError, setArchiveNewError] = useState(false);
  const [deleteNewError, setDeleteNewError] = useState(false);
  const [showArchivedSuccess, setArchivedSucces] = useState(false);
  const [showDeleteSucces, setDeleteSucces] = useState(false);

  // API CALLS
  const getAllNews = () => {
    axios
      .get(GET_ALL_NEWS_URL, headers)
      .then((response) => {
        const newsFromBackend = response.data;
        const serializedNews = serializeNews(newsFromBackend);
        let news = serializedNews.filter((newInformation) => {
          const archivedDateYear = newInformation.archiveDate.getFullYear();
          return archivedDateYear > archivedDateDefaultYear;
        });
        let archivedNews = serializedNews.filter((newInformation) => {
          const archivedDateYear = newInformation.archiveDate.getFullYear();
          return archivedDateYear < archivedDateDefaultYear;
        });
        news = shortNewsByDate(news, "news");
        archivedNews = shortNewsByDate(archivedNews, "archivedNews");
        const newState = {
          news,
          archivedNews,
        };
        setAllNews(newState);
      })
      .catch((error) => {
        setGetAllNewsError(true);
      });
  };

  const archiveNew = (idNewToArchive) => {
    const payload = {
      id: idNewToArchive,
      archiveDate: new Date(Date.now()),
    };
    // This endpoint responds with status 200 if the archive is successful and 500 if not
    axios
      .put(ARCHIVE_NEW_URL, payload, headers)
      .then((response) => {
        const responseStatus = response.status.valueOf();
        if (responseStatus === 200) {
          getAllNews();
          showInformation(setArchivedSucces);
        }
        if (responseStatus === 500) {
          showInformation(setArchiveNewError);
        }
      })
      .catch((error) => {
        showInformation(setArchiveNewError);
      });
  };

  const deleteNew = (idNewToRemove) => {
    // This endpoint responds with status 200 if the delete process is successful and 404 if not
    axios
      .delete(DELETE_NEW_URL + idNewToRemove, headers)
      .then((response) => {
        const responseStatus = response.status.valueOf();
        if (responseStatus === 200) {
          removeNewFromState(idNewToRemove);
          showInformation(setDeleteSucces);
        }
        if (responseStatus === 404) {
          showInformation(setDeleteNewError);
        }
      })
      .catch((error) => {
        showInformation(setDeleteNewError);
      });
  };

  // Helper functions
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

  const shortNewsByDate = (newsArray, newsArrayType) => {
    let sortedNewsArray;
    if (newsArrayType === "news") {
      sortedNewsArray = newsArray.sort((a, b) => {
        return b.date - a.date;
      });
    }
    if (newsArrayType === "archivedNews") {
      sortedNewsArray = newsArray.sort((a, b) => {
        return b.archiveDate - a.archiveDate;
      });
    }
    return sortedNewsArray;
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

  const showInformation = (setFunction) => {
    setFunction(true);
    setTimeout(() => {
      setFunction(false);
    }, 5000);
  };

  useEffect(() => {
    getAllNews();
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
            <Button variant={appState === "new" ? "primary" : "secondary"} className="float-end" onClick={() => setAppState("new")}>
              NEWS
            </Button>
          </Col>
          <Col>
            <Button variant={appState !== "new" ? "primary" : "secondary"} onClick={() => setAppState("archive")}>
              ARCHIVED
            </Button>
          </Col>
        </Row>
        {appState === "new"
          ? allNews &&
            allNews.news.map((newObject, index) => {
              const id = `normal-new-${index}`;
              return (
                <NewComponent
                  testId={id}
                  key={newObject._id}
                  newObject={newObject}
                  archiveNew={archiveNew}
                  deleteNew={deleteNew}
                  appState={appState}
                ></NewComponent>
              );
            })
          : allNews &&
            allNews.archivedNews.map((newObject, index) => {
              const id = `archived-new-${index}`;
              return (
                <NewComponent
                  testId={id}
                  key={newObject._id}
                  newObject={newObject}
                  archiveNew={archiveNew}
                  deleteNew={deleteNew}
                  appState={appState}
                ></NewComponent>
              );
            })}
        {getAllNewsError && <AlertCustom variant={"danger"} alertText={"Can't connect to database"}></AlertCustom>}
        {archiveNewError && <AlertCustom variant={"danger"} alertText={"Error archiving the new"}></AlertCustom>}
        {deleteNewError && <AlertCustom variant={"danger"} alertText={"Error deleting the new"}></AlertCustom>}
        {showArchivedSuccess && <AlertCustom variant={"primary"} alertText={"New archived succesfully!"}></AlertCustom>}
        {showDeleteSucces && <AlertCustom variant={"primary"} alertText={"New deleted succesfully!"}></AlertCustom>}
      </Container>
    </div>
  );
}

export default App;
