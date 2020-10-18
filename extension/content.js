console.log("Content script ran");

var supportedSites = [
  "Fox News",
  "CNN",
  "Donald J. Trump",
  "Joe Biden",
  "Canadian Memes and Jokes",
  "USA TODAY",
  "ABC News",
  "Breaking News",
  "CNN International",
  "KIRO 7 News",
  "Insider",
];

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
  var len = document.querySelectorAll('[data-pagelet^="FeedUnit_"]').length;
  for (i = lastMetadataIndex; i < len - 1; i += 2) {
    let text = metadataElements[i].innerText;
    // Not a supported site
    // if (!supportedSites.includes(text)) {
    //   continue;
    // }
    console.log("Found: " + text);
    insertIntoFeed(i, metadataElements[i + 1].innerText);
  }
  lastMetadataIndex = len;

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
    console.log(resp);
    if (resp == null || resp.length < 1) {
      return;
    }
    let title = "No Title Found";
    if (resp[0] != null) {
      title = resp[0].title;
    }
    console.log(title);
    feedUnitsElements[index].insertAdjacentHTML(
      "afterend",
      `<div style="width:100% !important;height: 300px;background-color: red !important;"><h1>${title}</h1></div><br>`
    );
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function buildPost(caption) {
  const nlpKeywords = await axios({
    method: "post",
    url:
      "https://us-central1-neutral-news-292821.cloudfunctions.net/nlp_keywords",
    data: { headline: caption },
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (nlpKeywords.data.length < 1) return false;

  const dbResult = await axios({
    method: "post",
    url: "https://h985rroh38.execute-api.us-west-2.amazonaws.com/dev/get-news",
    data: { headline: nlpKeywords.data },
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (dbResult.data.statusCode && dbResult.data.statusCode == "404") {
    const searchGoogleResults = await axios({
      method: "post",
      url:
        "https://us-central1-neutral-news-292821.cloudfunctions.net/search-google-keywords",
      data: { keywords: nlpKeywords.data },
    });

    const saveToDb = await axios({
      method: "post",
      url: "https://h985rroh38.execute-api.us-west-2.amazonaws.com/dev",
      data: {
        headline: nlpKeywords.data,
        articles: searchGoogleResults.data,
      },
    });
    return searchGoogleResults.data;
  } else {
    return dbResult.data;
  }
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
