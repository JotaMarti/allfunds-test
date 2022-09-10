function getRandomDate() {
  const maxDate = Date.now();
  const timestamp = Math.floor(Math.random() * maxDate);
  return new Date(timestamp);
}

const notArchivedDate = new Date(9999, 1, 1, 1, 1);

// new Date(year-monthIndex-day-hours-minutes)
module.exports = [
  {
    title: "New 3",
    description: "This is the description of the new 3",
    date: getRandomDate(),
    content: "This is the content of the new 3",
    author: "JotaMarti",
    archiveDate: notArchivedDate,
  },
  {
    title: "New 4",
    description: "This is the description of the new 4",
    date: getRandomDate(),
    content: "This is the content of the new 4",
    author: "JotaMarti",
    archiveDate: getRandomDate(),
  },
  {
    title: "New 1",
    description: "This is the description of the new 1",
    date: getRandomDate(),
    content: "This is the content of the new 1",
    author: "JotaMarti",
    archiveDate: notArchivedDate,
  },
  {
    title: "New 2",
    description: "This is the description of the new 2",
    date: getRandomDate(),
    content: "This is the content of the new 2",
    author: "JotaMarti",
    archiveDate: getRandomDate(),
  },
  {
    title: "New 5",
    description: "This is the description of the new 5",
    date: getRandomDate(),
    content: "This is the content of the new 5",
    author: "JotaMarti",
    archiveDate: notArchivedDate,
  },
  {
    title: "New 6",
    description: "This is the description of the new 6",
    date: getRandomDate(),
    content: "This is the content of the new 6",
    author: "JotaMarti",
    archiveDate: getRandomDate(),
  },
  {
    title: "New 7",
    description: "This is the description of the new 7",
    date: getRandomDate(),
    content: "This is the content of the new 7",
    author: "JotaMarti",
    archiveDate: notArchivedDate,
  },
  {
    title: "New 8",
    description: "This is the description of the new 8",
    date: getRandomDate(),
    content: "This is the content of the new 8",
    author: "JotaMarti",
    archiveDate: getRandomDate(),
  },
  {
    title: "New 9",
    description: "This is the description of the new 9",
    date: getRandomDate(),
    content: "This is the content of the new 9",
    author: "JotaMarti",
    archiveDate: notArchivedDate,
  },
  {
    title: "New 10",
    description: "This is the description of the new 10",
    date: getRandomDate(),
    content: "This is the content of the new 10",
    author: "JotaMarti",
    archiveDate: getRandomDate(),
  },
];
