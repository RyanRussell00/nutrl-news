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
// theActualFeedElement.addEventListener(
//   "DOMSubtreeModified",
//   contentChanged,
//   false
// );
// });

var lastFeedIndex = 0; // Index used for pagination
var lastMetadataIndex = 0;

var metadataElements = [];
function onStart() {
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
      metadataElements.push({
        type: "div",
        innerText: e.innerText,
        feedIndex: i,
        e: e,
      });
    }
    if (e.localName == "h4") {
      metadataElements.push({
        type: "h4",
        innerText: e.innerText,
        feedIndex: i,
        e: e,
      });
    }
  }

  // console.log(metadataElements);

  lastFeedIndex = feedElement.length - 1;

  for (i = lastMetadataIndex; i < metadataElements.length - 1; i += 2) {
    let caption = metadataElements[i + 1].innerText;
    // Not a supported site
    // if (!supportedSites.includes(text)) {
    //   continue;
    // }
    insertIntoFeed(metadataElements[i].feedIndex, caption);
    lastMetadataIndex = i + 2;
  }

  sleep(5000).then(() => {
    theActualFeedElement.addEventListener(
      "DOMSubtreeModified",
      contentChanged,
      false
    );
  });
}

// Function to run when the feed gets updated with more content
async function contentChanged() {
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
      metadataElements.push({
        type: "div",
        innerText: e.innerText,
        feedIndex: i,
        e: e,
      });
    }
    if (e.localName == "h4") {
      metadataElements.push({
        type: "h4",
        innerText: e.innerText,
        feedIndex: i,
        e: e,
      });
    }
  }

  // console.log(metadataElements);

  lastFeedIndex = feedElement.length - 1;
  for (i = lastMetadataIndex; i < metadataElements.length - 1; i += 2) {
    let caption = metadataElements[i + 1].innerText;
    // Not a supported site
    // if (!supportedSites.includes(text)) {
    //   continue;
    // }
    await insertIntoFeed(metadataElements[i].feedIndex, caption);
    lastMetadataIndex = i + 2;
  }

  sleep(5000).then(() => {
    theActualFeedElement.addEventListener(
      "DOMSubtreeModified",
      contentChanged,
      false
    );
  });
}

async function insertIntoFeed(index, caption) {
  //   console.log("insert index: " + index);
  var feedUnitsElements = document.querySelectorAll(
    '[data-pagelet^="FeedUnit_"] [id^="jsc_c_"]'
  );
  if (index >= feedUnitsElements.length) {
    return;
  }

  const resp = await buildPost(caption);
  let title = "No Title Found";

  if (resp && resp[0] && resp[0].title) {
    title = resp[0].title;
  }
  console.log("Attempting to build post for " + caption);

  console.log(
    "Found title " + title + " for caption " + caption + " at index " + index
  );
  feedUnitsElements[index + 1].insertAdjacentHTML(
    "afterend",
    `<div style="width:100% !important;height: 300px;background-color: red !important;"><h1>${title}</h1></div><br>`
  );
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function buildPost(caption) {
  try {
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
      url:
        "https://h985rroh38.execute-api.us-west-2.amazonaws.com/dev/get-news",
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

      await axios({
        method: "post",
        url: "https://h985rroh38.execute-api.us-west-2.amazonaws.com/dev",
        data: {
          headline: nlpKeywords.data,
          articles: searchGoogleResults.data,
        },
      });
      return searchGoogleResults.data;
    } else {
      return dbResult.data.data;
    }
  } catch (e) {
    return null;
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

sleep(2000).then(() => {
  onStart();
});
