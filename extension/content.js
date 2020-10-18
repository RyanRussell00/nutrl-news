console.log("Content script ran");

var supportedSites = ["Fox News", "CNN", "Donald J. Trump", "Joe Biden"];

var indexOfNewsArticles = [];

var finalResult = [];

console.log("Start injection");

var theActualFeedElement = document.querySelector('[role="feed"]');

// sleep(2000).then(() => {
theActualFeedElement.addEventListener(
  "DOMSubtreeModified",
  contentChanged,
  false
);
// });

var lastFeedIndex = 0; // Index used for pagination
var lastMetadataIndex = 0;

var metadataElements = [];

// Function to run when the feed gets updated with more content
function contentChanged() {
  theActualFeedElement.removeEventListener(
    "DOMSubtreeModified",
    contentChanged,
    false
  );

  //   console.log("feed changed!");

  // Get total number of div inside main feed
  var feedElement = document.querySelectorAll(
    '[data-pagelet^="FeedUnit_"] [id^="jsc_c_"]'
  );

  // loop over feedelements
  for (i = lastFeedIndex; i < feedElement.length; i++) {
    let e = feedElement[i];
    if (
      i >= 2 &&
      feedElement[i - 2].localName == "h4" &&
      e.localName == "div"
    ) {
      metadataElements.push(e);
    }
    if (e.localName == "h4") {
      metadataElements.push(e);
    }
  }

  lastFeedIndex = feedElement.length;

  for (i = lastMetadataIndex; i < metadataElements.length - 1; i += 2) {
    let text = metadataElements[i].innerText;
    // Not a supported site
    // if (!supportedSites.includes(text)) {
    //   continue;
    // }
    insertIntoFeed(Math.floor((i + 2) / 2), metadataElements[i + 1].innerText);
  }

  lastMetadataIndex = metadataElements.length;

  sleep(1000).then(() => {
    theActualFeedElement.addEventListener(
      "DOMSubtreeModified",
      contentChanged,
      false
    );
  });
}

function insertIntoFeed(index, caption) {
  //   console.log("insert index: " + index);
  var feedUnitsElements = document.querySelectorAll(
    '[data-pagelet^="FeedUnit_"]'
  );
  if (index >= feedUnitsElements.length) {
    return;
  }

  buildPost(caption).then((resp) => {
    if (finalResult.length < 1) {
      return;
    }
    let title = finalResult[0].title || "No Title Found";
    console.log(finalResult[0].title);
    feedUnitsElements[index].insertAdjacentHTML(
      "afterend",
      `<div style="width:100% !important;background-color: red !important;"><h1>${title}</h1></div><br>`
    );
  });

  //   let keywords = getKeywords(caption);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function buildPost(caption) {
  // First make request for NLP keywords
  axios({
    method: "post",
    url:
      "https://us-central1-neutral-news-292821.cloudfunctions.net/nlp_keywords",
    data: { headline: caption },
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      //   console.log("Success getting keywords");
      //   console.log(response);

      if (response["data"].length < 1) {
        return false;
      }

      axios({
        method: "post",
        url:
          "https://h985rroh38.execute-api.us-west-2.amazonaws.com/dev/get-news",
        data: { headline: response["data"] },
      })
        .then((response2) => {
          //   console.log(response2);
          if (
            response2["data"] != null &&
            response2["data"]["statusCode"] != null &&
            response2["data"]["statusCode"] == "404"
          ) {
            // Make a post request to populate DB
            // First make get request
            axios({
              method: "post",
              url:
                "https://us-central1-neutral-news-292821.cloudfunctions.net/search-google-keywords",
              data: { keywords: response["data"] },
            })
              .then((response3) => {
                // console.log(response3);
                finalResult = response3["data"];
                // Save to database
                axios({
                  method: "post",
                  url:
                    "https://h985rroh38.execute-api.us-west-2.amazonaws.com/dev",
                  data: {
                    headline: response["data"],
                    articles: response3["data"],
                  },
                })
                  .then((response4) => {
                    // console.log("Save to database");
                    // console.log(response4);
                  })
                  .catch((error4) => console.error(error4));
              })
              .catch((error3) => {
                console.log(error3);
              });
          } else {
            //If already exists in DB
            finalResult = response2["data"];
          }
        })
        .catch((error2) => console.error(error2));
    })
    .catch((error) => console.error(error));
}

// function getKeywords(caption) {
//   console.log("Entered axios");

//   const body = {
//     headline: caption,
//   };

//   axios({
//     method: "post",
//     url:
//       "https://us-central1-neutral-news-292821.cloudfunctions.net/nlp_keywords",
//     data: body,
//     headers: {
//       "Content-Type": "application/json",
//     },
//   })
//     .then((response) => {
//       console.log("Response");
//       console.log(response);
//       return response;
//     })
//     .catch((error) => console.error(error));
// }
