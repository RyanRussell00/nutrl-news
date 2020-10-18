/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
const request = require("request");

exports.nlp_keywords = (req, res) => {
  res.set("Access-Control-Allow-Origin", "https://www.facebook.com");
  res.set("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    // Send response to OPTIONS requests
    res.set("Access-Control-Allow-Methods", "POST");
    res.set("Access-Control-Allow-Headers", "Content-Type");
    res.set("Access-Control-Max-Age", "3600");
    res.status(204).send("");
  }

  let headlines = req.body.headline;
  let apiKey = "<HIDDEN>";
  let apiEndpoint =
    "https://language.googleapis.com/v1/documents:analyzeEntities?key=" +
    apiKey;

  let content = {
    document: {
      language: "en-us",
      type: "PLAIN_TEXT",
      content: headlines,
    },
    encodingType: "UTF8",
  };

  const options = {
    url: apiEndpoint,
    json: true,
    body: content,
  };

  request.post(options, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      var arr = [];
      for (var i = 0; i < body.entities.length; i++) {
        var test = body.entities[i].name.toLowerCase();
        arr.push(test);
      }
      arr.sort();

      res.set("Access-Control-Allow-Origin", "https://www.facebook.com");
      res.set("Access-Control-Allow-Credentials", "true");

      res.status(200).send(arr);
    } else console.log(error);
  });
};
