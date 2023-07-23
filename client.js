import axios from "axios";

const initIterator = async () => {
  const payload = {
    airplane: "Boeing 747",
    n: 100,
  };

  const { data } = await axios.post("http://localhost:3000/flights", payload);
  //  schema: {
  //     "next": "5c6874da-01a0-4160-8ffc-2347ad4e1855_|_1",
  //     "iterationNumber": 1,
  //     "detail": "starting post request"
  // }
  return data;
};

const iterate = async (res) => {
  let result = [];

  let next = res.next;
  while (next) {
    const { data } = await axios.get(`http://localhost:3000/${next}`);
    next = data.next;
    result.push(...data.result);
  }
  return result;
};

const start = async () => {
  const next = await initIterator();
  const result = await iterate(next);

  console.log(result);
};

start();
