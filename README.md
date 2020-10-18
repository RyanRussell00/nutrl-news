# neutral-news

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
