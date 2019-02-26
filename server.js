const express = require("express");
const path = require("path");
const cors = require("cors");
const port = 3005;
const parser = require("body-parser");
const axios = require("axios");

let globalID = null;

const app = express();
app.use(parser.json());
app.use(parser.urlencoded({ extended: true }));

app.use(cors());
app.post("/randomID", (req, resp) => {
  globalID = Math.ceil(Math.random() * 19);
  console.log(globalID);
  resp.end();
});
app.use(express.static(path.resolve(__dirname, "./public")));

app.post("/random/:id", (req, resp) => {
  let { id } = req.params;
  globalID = id;
  resp.end();
});

app.get("/suggestions", (req, response) => {
  axios
    .get(`http://18.216.95.88:3004/suggestions/${globalID}`)
    .then(res => {
      response.status(200).send(res.data);
    })
    .catch(err => console.log(err));
});

app.get("/search/:keyword", (req, response) => {
  let { keyword } = req.params;
  axios
    .get(`http://107.23.168.202:3001/search/${keyword}`)
    .then(res => {
      response.status(200).send(res.data);
    })
    .catch(err => console.log(err));
});

app.get("/reviews/", (req, res) => {
  axios
    .get(`http://18.191.191.154:3003/${globalID}`)
    .then(({ data }) => res.send(JSON.stringify(data)))
    .catch(err => res.send(err));
});

app.get("/reviews/stats", (req, res) => {
  axios
    .get(`http://18.191.191.154:3003/${globalID}/stats`)
    .then(({ data }) => res.send(JSON.stringify(data)))
    .catch(err => res.send(err));
});

app.listen(port, () => console.log("App is listening on port: ", port));
