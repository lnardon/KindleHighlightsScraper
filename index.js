const puppeteer = require("puppeteer");
const dotenv = require("dotenv");
dotenv.config();
(async () => {
  // Puppeteer Config
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  const navigationPromise = page.waitForNavigation();
  await page.goto("https://www.goodreads.com/user/sign_in?source=home");
  await page.setViewport({ width: 1272, height: 1281 });
  await navigationPromise;

  // Handle Amazon Signin
  await page.waitForSelector(
    ".contentBox > .column_right > #choices > .third_party_sign_in > .gr-button--amazon"
  );
  const link = await page.$(
    ".contentBox > .column_right > #choices > .third_party_sign_in > .gr-button--amazon"
  );
  page.typ;
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

  // Gets all books
  let booksLength = await page.$eval(
    "body > div.content > div.mainContentContainer > div.mainContent > div.mainContentFloat > div.gr-annotatedBooksLandingPage > div > div > div > div.annotatedBooksPage > div > div.annotatedBooksList",
    (e) => {
      return e.children.length;
    }
  );

  let books = [];
  // CHANGE i FOR booksLength
  for (let i = 0; i < 1; i++) {
    await page.click(
      `.annotatedBookItem:nth-child(${
        i + 1
      }) > .annotatedBookItem__knhLink > .annotatedBookItem__box > .annotatedBookItem__mainColumn > .annotatedBookItem__bookInfo > .annotatedBookItem__bookInfo__bookTitle`
    );
    await page.waitForSelector("#allHighlightsAndNotes");
    let highlights = await page.$eval("#allHighlightsAndNotes", (e) => {
      let aux = [];
      let htmlHighlights = [e.children];
      for (let j = 0; j < e.children.length; j++) {
        aux.push(htmlHighlights[0].item(j).innerText);
      }
      return aux;
    });
    console.log(highlights);
  }

  // await browser.close();
})();
