window.onload = () => {
    // Select the node that will be observed for mutations
    const targetNode = document.querySelector('[role=feed]');

    // Options for the observer (which mutations to observe)
    const config = { childList: true };

    // Loop through any posts already there from load and add the icon
    var children = targetNode.children    
    for (var i = 0; i < children.length; i++) {
        if (children[i].hasAttribute("data-pagelet") && children[i].getAttribute("data-pagelet").includes("FeedUnit")) {
            posts.push(children[i])
        }
    }

    // Callback function to execute when mutations are observed
    const callback = function(mutationsList, observer) {
        for(const mutation of mutationsList) {
            if (mutation.addedNodes[0].getAttribute("data-pagelet") === "FeedUnit_{n}") {
                console.log(mutation.addedNodes[0])
                posts.push(mutation.addedNodes[0])
            }
        }
    }

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);
}