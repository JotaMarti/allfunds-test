import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import NewComponent from "./components/NewComponent";
import AlertCustom from "./components/AlertCustom";
import { Button, Col, Container, Row } from "react-bootstrap";

const { archivedDateDefaultYear, APP_TITLE, TYPE_NEW, TYPE_ARCHIVED } = require("./util/constants");
const { getAllNewsFromApi, archiveNewFromApi, deleteNewFromApi } = require("./api/news");

function App() {
  // AllNews has this structure: {news: [], archivedNews: []}
  const [allNews, setAllNews] = useState(null);
  const [appState, setAppState] = useState(TYPE_NEW);
  const [getAllNewsError, setGetAllNewsError] = useState(false);
  const [archiveNewError, setArchiveNewError] = useState(false);
  const [deleteNewError, setDeleteNewError] = useState(false);
  const [showArchivedSuccess, setArchivedSucces] = useState(false);
  const [showDeleteSucces, setDeleteSucces] = useState(false);

  // API CALLS
  const getAllNews = () => {
    getAllNewsFromApi()
      .then((newsFromBackend) => {
        const serializedNews = serializeNews(newsFromBackend);

        let news = serializedNews.filter((newInformation) => {
          const archivedDateYear = newInformation.archiveDate.getFullYear();
          return archivedDateYear > archivedDateDefaultYear;
        });

        let archivedNews = serializedNews.filter((newInformation) => {
          const archivedDateYear = newInformation.archiveDate.getFullYear();
          return archivedDateYear < archivedDateDefaultYear;
        });

        news = shortNewsByDate(news, TYPE_NEW);
        archivedNews = shortNewsByDate(archivedNews, TYPE_ARCHIVED);

        const newState = {
          news,
          archivedNews,
        };
        setAllNews(newState);
      })
      .catch((error) => {
        showInformation(setGetAllNewsError);
      });
  };

  const archiveNew = (idNewToArchive) => {
    archiveNewFromApi(idNewToArchive)
      .then((response) => {
        getAllNews();
        showInformation(setArchivedSucces);
      })
      .catch((error) => {
        showInformation(setArchiveNewError);
      });
  };

  const deleteNew = (idNewToRemove) => {
    deleteNewFromApi(idNewToRemove)
      .then((response) => {
        removeNewFromState(idNewToRemove);
        showInformation(setDeleteSucces);
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
    if (newsArrayType === TYPE_NEW) {
      sortedNewsArray = newsArray.sort((a, b) => {
        return b.date - a.date;
      });
    }
    if (newsArrayType === TYPE_ARCHIVED) {
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
            <h1 className="text-center">{APP_TITLE}</h1>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <Button variant={appState === TYPE_NEW ? "primary" : "secondary"} className="Main-button float-end" onClick={() => setAppState(TYPE_NEW)}>
              NEWS
            </Button>
          </Col>
          <Col>
            <Button variant={appState !== TYPE_NEW ? "primary" : "secondary"} className="Main-button" onClick={() => setAppState(TYPE_ARCHIVED)}>
              ARCHIVED
            </Button>
          </Col>
        </Row>
        {appState === TYPE_NEW
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
