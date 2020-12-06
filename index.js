const puppeteer = require("puppeteer");
const fs = require("fs");
const dotenv = require("dotenv");
const myArgs = process.argv.slice(2);
dotenv.config();
(async () => {
  // Puppeteer Config
  const browser = await puppeteer.launch({
    headless: myArgs[0] === "true" ? true : false,
  });
  const page = await browser.newPage();
  await page.goto("https://www.goodreads.com/user/sign_in?source=home");
  await page.setViewport({ width: 1272, height: 1281 });

  // Handle Amazon Signin
  await page.waitForSelector(
    ".contentBox > .column_right > #choices > .third_party_sign_in > .gr-button--amazon"
  );
  const link = await page.$(
    ".contentBox > .column_right > #choices > .third_party_sign_in > .gr-button--amazon"
  );
  const newPagePromise = new Promise((x) => page.once("popup", x));
  await link.click();
  const newPage = await newPagePromise;
  await newPage.waitForSelector(
    ".a-section > .a-spacing-none > .a-section > .a-box > .a-box-inner"
  );
  await newPage.type(".a-section #ap_email", process.env.EMAIL, 3000);
  await newPage.waitForSelector(".a-section #ap_password");
  await newPage.click(".a-section #ap_password");
  await newPage.type(".a-section #ap_password", process.env.PASS);
  await newPage.click(
    ".a-section > .a-spacing-none > .a-section > .a-box > .a-box-inner"
  );

  // Open highlights page
  await page.waitForSelector(
    ".siteHeader__contents > .siteHeader__primaryNavInline > .siteHeader__menuList > .siteHeader__topLevelItem:nth-child(2) > .siteHeader__topLevelLink"
  );
  await page.click(
    ".siteHeader__contents > .siteHeader__primaryNavInline > .siteHeader__menuList > .siteHeader__topLevelItem:nth-child(2) > .siteHeader__topLevelLink"
  );
  await page.waitForSelector(
    "#leftCol > #sidewrapper > #side > #toolsSection > .annotatedBooksPageLink"
  );
  await page.click(
    "#leftCol > #sidewrapper > #side > #toolsSection > .annotatedBooksPageLink"
  );
  await page.waitForSelector(
    "body > div.content > div.mainContentContainer > div.mainContent > div.mainContentFloat > div.gr-annotatedBooksLandingPage > div > div > div > div.annotatedBooksPage > div > div.annotatedBooksList"
  );

  // Gets all books and highlights
  let booksLength = await page.$eval(
    "body > div.content > div.mainContentContainer > div.mainContent > div.mainContentFloat > div.gr-annotatedBooksLandingPage > div > div > div > div.annotatedBooksPage > div > div.annotatedBooksList",
    (e) => {
      return e.children.length;
    }
  );
  let books = [];
  for (let i = 0; i < booksLength; i++) {
    await page.click(
      `.annotatedBookItem:nth-child(${
        i + 1
      }) > .annotatedBookItem__knhLink > .annotatedBookItem__box > .annotatedBookItem__mainColumn > .annotatedBookItem__bookInfo > .annotatedBookItem__bookInfo__bookTitle`
    );
    await page.waitForSelector("#allHighlightsAndNotes");
    let bookTitle = await page.$eval(
      "body > div.content > div.mainContentContainer > div.mainContent > div.mainContentFloat > div.readingNotesMainContainer > div.readingNotesMainContainer__rightColumn > div.readingNotesBookDetailsContainer > div.gr-h2.gr-h2--serif > span > a",
      (e) => {
        return e.innerText;
      }
    );
    let highlights = await page.$eval("#allHighlightsAndNotes", (e) => {
      let aux = [];
      let htmlHighlights = [e.children];
      for (let j = 0; j < e.children.length; j++) {
        let highlight = htmlHighlights[0].item(j).innerText.split("\n");
        aux.push(highlight[1]);
      }
      return aux;
    });
    books.push({ title: bookTitle, highlights: highlights });
    await page.goBack();
  }

  // Save as txt
  let txtContent = "";
  for (let i = 0; i < books.length; i++) {
    txtContent += `${books[i].title}\n\n`;
    books[i].highlights.forEach((highlight) => {
      txtContent += `- ${highlight}\n`;
    });
    txtContent += "\n\n\n";
  }
  fs.writeFile("./kindleHighlights.txt", txtContent, (err) => {
    if (err) console.log(err);
  });

  // Close browser
  await browser.close();
})();
