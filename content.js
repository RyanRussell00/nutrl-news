window.onload = () => {
    var html = document.getElementsByTagName("html")[0]
    var isDark = html.className.includes("dark-mode")

    var lightModeStyles = {
        "post-div": "width: 100%; background-color: white; display: block; border-radius: max(0px, min(8px, ((100vw - 4px) - 100%) * 9999)) 8px; box-shadow: rgba(0, 0, 0, 0.2) 0px 1px 2px 0px;",
        "post-title-div": "padding: 12px 16px 0px 16px; margins: 0px 0px 16px 0px",
        "post-h1": "font-family: Segoe UI Historic, Segoe UI, Helvetica, Arial, sans-serif; font-size: 20px; color: rgb(5, 5, 5); font-style: bold;",
        "post-span": "font-family: Segoe UI Historic, Segoe UI, Helvetica, Arial, sans-serif; font-size: 15px; rgb(5, 5, 5); display: block; padding: 4px 16px 16px 16px;"
    }

    var darkModeStyles = {
        "post-div": "width: 100%; background-color: #242526; display: block; border-radius: max(0px, min(8px, ((100vw - 4px) - 100%) * 9999)) 8px;",
        "post-title-div": "padding: 12px 16px 0px 16px; margins: 0px 0px 16px 0px",
        "post-h1": "font-family: Segoe UI Historic, Segoe UI, Helvetica, Arial, sans-serif; font-size: 20px; color: rgb(228, 230, 235); font-style: bold;",
        "post-span": "font-family: Segoe UI Historic, Segoe UI, Helvetica, Arial, sans-serif; font-size: 15px; color: rgb(228, 230, 235); display: block; padding: 4px 16px 16px 16px;"
    }

    const createPost = () => {
        var post = 
        `<div style="${isDark ? darkModeStyles["post-div"] : lightModeStyles["post-div"]}">
            <div style="${isDark ? darkModeStyles["post-title-div"] : lightModeStyles["post-title-div"]}">
                <h1 style="${isDark ? darkModeStyles["post-h1"] : lightModeStyles["post-h1"]}">Title</h1>
            </div>
            <span style="${isDark ? darkModeStyles["post-span"] : lightModeStyles["post-span"]}">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</span>
            <img src="https://www.extremetech.com/wp-content/uploads/2019/12/SONATA-hero-option1-764A5360-edit.jpg" style="width: 100%;">
            <div style="height: 30px; padding: 10px 0px 10px 0px; margin: 0px 16px 0px 16px;">
                <img src="${chrome.extension.getURL("thumbs_up_icon.png")}" style="height: inherit;">
                <img src="${chrome.extension.getURL("thumbs_down_icon.png")}" style="height: inherit; margin: 0px 0px 0px 7px;">
            </div>
        </div><br>`
        if (document.querySelector("[data-pagelet=FeedUnit_0]")) {
            document.querySelector("[data-pagelet=FeedUnit_0]").insertAdjacentHTML("afterend", post)
        }
    }

    createPost()
}