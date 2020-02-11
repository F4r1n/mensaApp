const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const webpush = require("web-push");

const app = express();

app.use(cors());
app.use(bodyParser.json());

webpush.setVapidDetails(
  "mailto: contact@my-site.com",
  "BEhOyo5iaKX74IAYmz4YiF31EIchLRxZuv2KRqTW2YuN_PSE5TnnCurp7y7E2EZf-45IVeYfuQDG2p3MSg_-fH0",
  "l0XDyNrE59SVFSDv76A3obrS13yn5Drc_a4sUCXYIq4"
);

// app.get("/", (req, res) => {
//   res.send("Hello world!");
// });

function postMsg() {
    app.post("/notifications/subscribe", (req, res) => {
      const subscription = req.body;

      console.log(subscription);

      const payload = JSON.stringify({
        title: "Neuer Speiseplan verfügbar",
        body: "Besuchen sie jetzt die App um den neuen Speiseplan einzusehen."
      });

      webpush
        .sendNotification(subscription, payload)
        // .then(result => console.log(result))
        .catch(e => console.log(e.stack));

      res.status(200).json({ success: true });
    });
}

setInterval(postMsg, 1000);

app.listen(9000, () =>
  console.log("The server has been started on the port 9000")
);
