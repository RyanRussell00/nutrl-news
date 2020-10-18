window.onload = () => {
    // Select the node that will be observed for mutations
    const targetNode = document.querySelector('[role=feed]');

    // Options for the observer (which mutations to observe)
    const config = { childList: true };

    // Loop through any posts already there from load and add the icon
    var children = targetNode.children    
    for (var i = 0; i < children.length; i++) {
        if (children[i].hasAttribute("data-pagelet") && children[i].getAttribute("data-pagelet").includes("FeedUnit")) {
            addIcon(children[i])
        }
    }

    // Callback function to execute when mutations are observed
    const callback = function(mutationsList, observer) {
        for(const mutation of mutationsList) {
            if (mutation.addedNodes[0] && mutation.addedNodes[0].hasAttribute("data-pagelet") && mutation.addedNodes[0].getAttribute("data-pagelet").includes("FeedUnit")) {
                addIcon(mutation.addedNodes[0])
            }
        }
    }

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);
}

const addIcon = (post) => {
    // Get and set thumbs up/down icons
    var thumbsUpDownIcons = createAndGetIcons()
    var thumbsUp = thumbsUpDownIcons[0]
    var thumbsDown = thumbsUpDownIcons[1]

    var thumbsUpDownIconSection = document.createElement("div")
    thumbsUpDownIconSection.appendChild(thumbsUp)
    thumbsUpDownIconSection.appendChild(thumbsDown)

    // Get like, comment, share Facebook section (div)
    var likeCommentShareSection = post.getElementsByClassName("a8nywdso e5nlhep0 rz4wbd8a ecm0bbzt dhix69tm oygrvhab wkznzc2l kvgmc6g5 k7cz35w2 jq4qci2q j83agx80")[0]

    // Append
    likeCommentShareSection.appendChild(thumbsUpDownIconSection)
}

const createAndGetIcons = () => {
    // Thumbs up/down icon divs
    var thumbsUpIconSection = document.createElement("div")
    var thumbsDownIconSection = document.createElement("div")

    // Thumbs up/down icons
    var thumbsUpImg = document.createElement("img")
    var thumbsDownImg = document.createElement("img")

    // Set src on imgs
    var thumbsUpImgURL = chrome.extension.getURL("thumbs_up_icon.png")
    var thumbsDownImgURL = chrome.extension.getURL("thumbs_down_icon.png")

    // Set img srcs
    thumbsUpImg.src = thumbsUpImgURL
    thumbsDownImg.src = thumbsDownImgURL

    // Set img sizes
    thumbsUpImg.style.width = "20px"
    thumbsDownImg.style.width = "20px"

    // Append
    thumbsUpIconSection.appendChild(thumbsUpImg)
    thumbsDownIconSection.appendChild(thumbsDownImg)

    return [thumbsUpIconSection, thumbsDownIconSection]
}