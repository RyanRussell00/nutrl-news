console.log("Content script ran");

var html = document.getElementsByTagName("html")[0];
var isDark = html.className.includes("dark-mode");

var lightModeStyles = {
  "post-div":
    "width: 100%; background-color: white; display: block; border-radius: max(0px, min(8px, ((100vw - 4px) - 100%) * 9999)) 8px; box-shadow: rgba(0, 0, 0, 0.2) 0px 1px 2px 0px;",
  "post-title-div": "padding: 12px 16px 0px 16px; margins: 0px 0px 16px 0px",
  "post-h1":
    "font-family: Segoe UI Historic, Segoe UI, Helvetica, Arial, sans-serif; font-size: 20px; color: rgb(5, 5, 5); font-style: bold;",
  "post-span":
    "font-family: Segoe UI Historic, Segoe UI, Helvetica, Arial, sans-serif; font-size: 15px; rgb(5, 5, 5); display: block; padding: 4px 16px 16px 16px;",
};

var darkModeStyles = {
  "post-div":
    "width: 100%; background-color: #242526; display: block; border-radius: max(0px, min(8px, ((100vw - 4px) - 100%) * 9999)) 8px;",
  "post-title-div": "padding: 12px 16px 0px 16px; margins: 0px 0px 16px 0px",
  "post-h1":
    "font-family: Segoe UI Historic, Segoe UI, Helvetica, Arial, sans-serif; font-size: 20px; color: rgb(228, 230, 235); font-style: bold;",
  "post-span":
    "font-family: Segoe UI Historic, Segoe UI, Helvetica, Arial, sans-serif; font-size: 15px; color: rgb(228, 230, 235); display: block; padding: 4px 16px 16px 16px;",
};

var supportedSites = [
  "Fox News",
  "CNN",
  "Donald J. Trump",
  "Joe Biden",
  "USA TODAY",
  "ABC News",
  "Breaking News",
  "CNN International",
  "KIRO 7 News",
  "Insider",
  "Indiatimes",
];

var indexOfNewsArticles = [];

var finalResult = [];

console.log("Start injection");

var theActualFeedElement = document.querySelector('[role="feed"]');

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

  console.log(metadataElements);

  lastFeedIndex = feedElement.length - 1;

  for (i = lastMetadataIndex; i < metadataElements.length - 1; i += 2) {
    let caption;
    if (metadataElements[i + 1].type == "h4") {
      caption = "";
    } else {
      caption = metadataElements[i + 1].innerText;
    }
    let author = metadataElements[i].innerText;
    //console.log("Author: ", author);
    // Not a supported site
    if (!supportedSites.some((a) => author.includes(a) || a.includes(author))) {
      lastMetadataIndex = i + 2;
      if (!caption) lastMetadataIndex--;
      continue;
    }
    insertIntoFeed(metadataElements[i].feedIndex, caption);
    lastMetadataIndex = i + 2;
    if (!caption) lastMetadataIndex--;
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

  console.log(metadataElements);

  lastFeedIndex = feedElement.length - 1;
  for (i = lastMetadataIndex; i < metadataElements.length - 1; i += 2) {
    let caption;
    if (metadataElements[i + 1].type == "h4") {
      caption = "";
    } else {
      caption = metadataElements[i + 1].innerText;
    }
    let author = metadataElements[i].innerText;
    //console.log("Author: ", author);
    // Not a supported site

    if (!supportedSites.some((a) => author.includes(a) || a.includes(author))) {
      lastMetadataIndex = i + 2;
      if (!caption) lastMetadataIndex--;
      continue;
    }
    insertIntoFeed(metadataElements[i].feedIndex, caption);
    lastMetadataIndex = i + 2;
    if (!caption) lastMetadataIndex--;
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
  // feedUnitsElements[index + 1].insertAdjacentHTML(
  //   "afterend",
  //   `<div style="width:100% !important;height: 300px;background-color: red !important;"><h1>${title}</h1></div><br>`
  // );

  if (
    Array.isArray(resp) &&
    resp[0].link &&
    resp[0].title &&
    resp[0].company_name &&
    resp[0].image
  ) {
    feedUnitsElements[index + 1].insertAdjacentHTML(
      "afterbegin",
      `<div style="${
        isDark ? darkModeStyles["post-div"] : lightModeStyles["post-div"]
      }">
    <div style="${
      isDark
        ? darkModeStyles["post-title-div"]
        : lightModeStyles["post-title-div"]
    }">
        <a href="${resp[0].link}"><h1 style="${
        isDark ? darkModeStyles["post-h1"] : lightModeStyles["post-h1"]
      }">${resp[0].company_name}</h1></a>
    </div>
    <span style="${
      isDark ? darkModeStyles["post-span"] : lightModeStyles["post-span"]
    }">${resp[0].title}</span>
    <img src="${resp[0].image}" style="width: 100%;">
    <div style="height: 30px; padding: 10px 0px 10px 0px; margin: 0px 16px 0px 16px;">
       <img src="${chrome.runtime.getURL(
         "./thumbs_up_icon.png"
       )}" style="height: inherit;">
        <img src="${chrome.runtime.getURL(
          "./thumbs_down_icon.png"
        )}" style="height: inherit; margin: 0px 0px 0px 7px;">
           
        
    </div>
  </div><br>`
    );
  }
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

sleep(2000).then(() => {
  onStart();
});
