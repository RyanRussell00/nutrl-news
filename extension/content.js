console.log("Content script ran");

var supportedSites = ["Fox News", "CNN", "Donald J. Trump", "Joe Biden"];

var indexOfNewsArticles = [];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
sleep(10000);
console.log("Start injection");

// Get total number of div inside main feed
var feedElement = document.querySelector('[role="feed"]');
var lastIx = 0; // Index used for pagination

// Get the element that has the post author
var authorListElements = [];

var captionListElements = [];

// console.log(posts);
feedElement.addEventListener("DOMSubtreeModified", contentChanged, false);

// Function to run when the feed gets updated with more content
function contentChanged() {
  //   console.log("feed changed!");

  authorListElements = document.getElementsByClassName(
    "oajrlxb2 g5ia77u1 qu0x051f esr5mh6w e9989ue4 r7d6kgcz rq0escxv nhd2j8a9 nc684nl6 p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso i1ao9s8h esuyzwwr f1sip0of lzcic4wl oo9gr5id gpro0wi8 lrazzd5p"
  );

  captionListElements = document.getElementsByClassName(
    "d2edcug0 hpfvmrgz qv66sw1b c1et5uql gk29lw5a a8c37x1j keod5gw0 nxhoafnm aigsh9s9 d9wwppkn fe6kdd0r mau55g9w c8b282yb hrzyx87i jq4qci2q a3bd9o3v knj5qynh oo9gr5id hzawbc8m"
  );

//   console.log();

  for (i = lastIx; i < authorListElements.length; i++) {
    let childrenAuthors = authorListElements[i].childNodes;
    // let childrenCaptions = captionListElements[i].childNodes;
    for (j = 0; j < childrenAuthors.length; j++) {
      let authorElement = childrenAuthors[j];
    //   let captionElement = childrenCaptions[j];
    // Grab caption if author is what we want
      if (
        authorElement.innerText != null &&
        authorElement.innerText != undefined &&
        authorElement.innerText != ""
      ) {
        // showNewsArticle(authorElement, captionElement, i);
      }
    }
  }
  lastIx = authorListElements.length;
}

function showNewsArticle(authorElement, captionElement, index) {
  console.log(authorElement.innerText + " : : " + captionElement.innerText);
  if (supportedSites.includes(authorElement.innerText) == false) {
    return;
  }

  console.log("Supported Site: " + authorElement.innerText);
}
