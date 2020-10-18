# neutral-news

## PLEASE NOTE: The APIs have been disabled for this project to prevent unsolicited use. If you wish to use the APIs please contact Ryan Russell and he can reenable them.

## Pictures of it in action

The original post is the Fox News post, and our extension added the ABC7 Chicago story. As you can see it got the same news story from 2 different companies.
![ABC7 Article recommended on Fox News post](https://media.discordapp.net/attachments/764178749306306591/767375910751961138/unknown.png?width=583&height=702)

The original post is Donald J. Trump's text post, and our extension found the related story from the Washington Post and displayed it alongside the post.
![Donald J. Trump tweet with Washington Post article overlayed](https://media.discordapp.net/attachments/764178749306306591/767377204346355742/unknown.png?width=625&height=703)

## Inspiration

Debates are long. Reading reports are boring.  In a time when we are bombarded with constant information, reading summaries and highlights are the easiest way to get quick news updates. The problem is, when we let other people interpret events for us, they highlight the information they think is most relevant, inadvertently adding their own biases to our news. Various news networks can conclude different outcomes of the same information. Unless we are aware of what political leaning a network has, we will not know the full story.

Out of all online news platforms, 43% of Americans get their online news from Facebook. If you are someone who is looking to diversify your news sources or want to have a better understanding of the political leanings of different news networks, Nutrl News provides you with quick access to news events taken from a different perspective.

**There are always two sides to every story.**

## What it does
Our goal is to help introduce another point of view to provide you with a better understanding of current events. 
While scrolling through Facebook, you encounter various news articles either by companies you follow or suggested companies based on your user information. Upon viewing a news article on your feed, Nutrl News will find a similar article from another company based on similar keywords to the original news article title. You can view the suggested article and rate whether you think this article is a "good" or "bad" alternative suggestion to the original news post. 

## How we built it
- We used Google Cloud functions (Node.js) and AWS Lambda Functions (Python and DynamoDB) to build a serverless backend for the chrome extension
    - One cloud function to return high-value keywords from a news headline using the Google Cloud NLP API
    - One cloud function to find similar news stories from keywords using the Google CustomSearch JSON API
    - Two lambda function to read and write to a database so we can return results faster than querying Google every time for the same request
- The chrome extension also has a few different tasks
     - Access site data on Facebook to retrieve headlines from popular news sources (much harder than it sounds due to how hard Facebook makes scraping)
     - Make the required API calls to find similar news stories 
     - Inject our own UI into the Facebook News Feed to place news stories from different news sources close to the ones in your newsfeed

## Challenges we ran into
- Facebook randomly generates their HTML elements classes and ids which made it **very** difficult to parse. We overcame this issue by finding a pattern in the selectors and using regex and jQuery to get the posts and their metadata. This proved to be a very challenging theoretical and technical problem. We wanted to prioritize Facebook due to it being the most popular social media news source for adults in the US
- This was our first time working with Cloud Functions, so learning about the quirks and bugs we faced while debugging the cloud functions
- We had some first-time hackers on the team who learned a lot of various skills - Python, DynamoDB, Cloud Functions, Lambda Functions, etc. to build the hack

## Accomplishments that we're proud of
- It actually works!
- We were able to get the CORS things figured out fairly quickly
- The team worked together flawlessly and spent time guiding and explaining concepts to each other to make sure everyone was learning and making progress to finishing the project!
- Incorporated 3 different services into one extension: Google NLP, Google Custom Search, AWS DynamoDB

## What we learned
We all learned a good amount about interacting with APIs and Lambdas on both Google Cloud and AWS. It was also the first time creating a Chrome extension for many of the team members. Although we faced many hurdles when it came to keeping track of the elements and updating the news feed, we persevered and were able to overcome it!
Key takeaways: Serverless computing, working with CORS, Chrome extensions, perseverance, and dedication!

## What's next for Nutrl News
There are a few features that we've set up in the application that aren't fully implemented. These features are:
- Post ordering based on the number of likes and dislikes from the suggested news articles
- Viewing all suggested news articles about a given story. Currently, the user can only see one story but we have loaded up to ten different news stories per Facebook post. 
- Algorithm efficiency. We'd also like to increase the efficiency of the algorithm by incorporating some lazy loading where it only loads the posts that are currently in the viewport.

This idea has the potential to develop into a business. Our revenue steam would come from donations and sponsored articles (ie. a News company can buy the top spot on the most relevant news to the original news article category). We also want to expand our product and make it compatible with Firefox and other browsers as well as Youtube and other online news platforms.

## How to install the extension locally (takes less than 30 seconds!)

1. Download this repo as a .zip file or clone it
2. If necessary, extract the files
3. Follow [this tutorial](https://www.cnet.com/how-to/how-to-install-chrome-extensions-manually/) to load the extension as an "unpacked extension". Note that your UI may look different, but ultimately, it's the same instructions:
   https://www.cnet.com/how-to/how-to-install-chrome-extensions-manually/

## The Flow of Our Tech

1. Extension sees Facebook post on browser and checks if it's from one of our supported authors (note you can change this list to your liking in the code):
   - Fox News
   - CNN
   - Donald J. Trump
   - Joe Biden
   - USA TODAY
   - ABC News
   - Breaking News
   - CNN International
2. Extension takes the caption of the post, runs it through Google Natural Language Processing and uses the result as the query for the NoSQL DynamoDB.
   - If the database contains that query, return that value and skip to Step 4
   - If the database doesn't contain that query, continue to Step 3
3. Extension requests Google Custom search results given that query (up to 10 results) and saves them in the Database to prevent future lookups
4. Display the result on the Facebook feed on top of the desired post
5. Wait for new posts to be loaded into the Facebook feed then repeat from Step 1.
