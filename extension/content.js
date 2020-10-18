console.log("Content script ran");

var supportedSites = ["Fox News", "CNN", "Donald J. Trump", "Joe Biden"];

var indexOfNewsArticles = [];

console.log("Start injection");

var theActualFeedElement = document.querySelector('[role="feed"]');

sleep(2000).then(() => {
  theActualFeedElement.addEventListener(
    "DOMSubtreeModified",
    contentChanged,
    false
  );
});

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

  for (i = lastMetadataIndex; i < metadataElements.length; i += 2) {
    let text = metadataElements[i].innerText;
    // Not a supported site
    // if (!supportedSites.includes(text)) {
    //   continue;
    // }
    insertIntoFeed(Math.floor((i + 2) / 2));
  }

  lastMetadataIndex = metadataElements.length;

  //   sleep(10000).then(() => {
  //     return;
  //   });
  theActualFeedElement.addEventListener(
    "DOMSubtreeModified",
    contentChanged,
    false
  );
}

function insertIntoFeed(index) {
  //   console.log("insert index: " + index);
  var feedUnitsElements = document.querySelectorAll(
    '[data-pagelet^="FeedUnit_"]'
  );
  //   console.log(feedUnitsElements);
  if (index >= feedUnitsElements.length) {
    return;
  }
  feedUnitsElements[index].insertAdjacentHTML(
    "afterend",
    `<div style="width:100% !important;background-color: red !important;"><h1>HELLO</h1></div><br>`
  );
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Get the element that has the post author
//   var authorListElements = [];

//   var captionListElements = [];

//   // console.log(posts);

//   function showNewsArticle(authorElement, captionElement, index) {
//     console.log(authorElement.innerText + " : : " + captionElement.innerText);
//     if (supportedSites.includes(authorElement.innerText) == false) {
//       return;
//     }

//     console.log("Supported Site: " + authorElement.innerText);

// sleep(5000).then(() => {}
