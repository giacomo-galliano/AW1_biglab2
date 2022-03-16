
import dayjs from 'dayjs';

var database;

const getData = async () => {
  const response = await fetch('/api/retrieve/2');
  const dati = await response.json();
  return dati;
};


database = getData();

export { database };

