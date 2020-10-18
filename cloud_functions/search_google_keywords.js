/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
const querystring = require("querystring");
const request = require("request");

exports.searchGoogle = (req, res) => {
  res.set("Access-Control-Allow-Origin", "https://www.facebook.com");
  res.set("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    // Send response to OPTIONS requests
    res.set("Access-Control-Allow-Methods", "POST");
    res.set("Access-Control-Allow-Headers", "Content-Type");
    res.set("Access-Control-Max-Age", "3600");
    res.sendStatus(204);
  }

  let baseSearchURL = "https://www.googleapis.com/customsearch/v1";
  let keywords = req.body.keywords;
  let queryObject = {
    key: "<HIDDEN>",
    cx: "50d0a446864aefe7d",
    q: keywords.join("+"),
  };

  let searchURL = `${baseSearchURL}?${querystring.stringify(queryObject)}`;

  const returnItems = [];
  request.get(searchURL, (err, resp, body) => {
    let jsonBody = JSON.parse(body);
    for (let item of jsonBody.items) {
      let tempReturnItem = {};

      tempReturnItem.link = item.link;

      tempReturnItem.fb_app_id = item.pagemap.metatags[0]["fb:app_id"] || null;

      tempReturnItem.title =
        item.pagemap.metatags[0]["twitter:title"] ||
        item.pagemap.metatags[0]["og:title"] ||
        null;

      tempReturnItem.company_name =
        item.pagemap.metatags[0]["og:site_name"] ||
        item.pagemap.metatags[0]["al:iphone:app_name"] ||
        item.pagemap.metatags[0]["al:android:app_name"] ||
        null;

      tempReturnItem.image =
        item.pagemap.metatags[0]["twitter:image"] ||
        item.pagemap.metatags[0]["og:image"] ||
        null;

      returnItems.push(tempReturnItem);
    }

    if (returnItems.length > 0) {
      res.set("Access-Control-Allow-Origin", "https://www.facebook.com");
      res.set("Access-Control-Allow-Credentials", "true");

      res.status(200).send(returnItems);
    } else {
      res.sendStatus(500);
    }
  });
};
