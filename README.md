# rotate-ip-addresses-test

This code is a Node.js server application that uses the Express framework to create an HTTP server.

1. Required modules and libraries are imported, such as dotenv, express, parse5 and fs.

2. The settings are loaded from the .env file using dotenv.config().

3. The Express application is instantiated and port 3000 is set.

4. Variables parsedData, foundEmails, foundPhones and counter are defined. parsedData will store the parsed data, foundEmails and foundPhones will be used to store the found email addresses and phone numbers, and counter will be used to count the parsed records.

5. A GET route / method handler is defined that will be called when accessing the root URL. Inside the handler, data is parsed from the web page.

6. The variable page is created and the initial value is set to 0. Then the final page lastPage is defined.

7. Set the URL url to download data from the web page.

8. The rotateWithBrightData(url) function is called, which performs an obstacle avoidance when parsing the web page and returns the page data.

9. The parse5 library is used to parse the HTML code of the page and create a DOM tree.

10. The findHref function is defined, which recursively traverses the DOM tree and finds all references to companies, saving them to the hrefs array.

11. The findData, findDivWithClass, findFirstH1, findSubSpecialities, findEmail, and findPhone functions are defined, which recursively traverse the DOM tree and extract data about the name, subspecialties, email address, and phone number of the company.

12. The findHref(document) function is called to find all links to firms on the current page.

13. Inside the while loop, the pages are processed sequentially. For each link in the hrefs array, the rotateWithBrightData(nextUrl) function is called to get the company data. The data is then parsed using parse5 and the findData function is called to retrieve the firm data.

[![trophy](https://github-profile-trophy.vercel.app/?username=Vladimir0657305)]([https://github.com/ryo-ma/github-profile-trophy](https://github.com/Vladimir0657305))

[![Ashutosh's github activity graph](https://github-readme-activity-graph.cyclic.app/graph?username=Vladimir0657305&theme=react)](https://github.com/ashutosh00710/github-readme-activity-graph)

![](https://github-profile-summary-cards.vercel.app/api/cards/profile-details?username=Vladimir0657305&theme=solarized_dark)

![](https://github-profile-summary-cards.vercel.app/api/cards/most-commit-language?username=Vladimir0657305&theme=solarized_dark)
![](https://github-profile-summary-cards.vercel.app/api/cards/stats?username=Vladimir0657305&theme=solarized_dark)

![](https://komarev.com/ghpvc/?username=Vladimir0657305)
