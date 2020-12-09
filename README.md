# Kindle Highlights Scraper

A scraper to extract all your kindle highlights from the goodreads website using puppeteer

## ATTENTION

- This scraper only works if you sign in to goodreads with an amazon account.

- If you use it with a lot of frequency amazon will ask for a password confirmation and a captcha verification, this will result the scraper to stop working. To fix it run the scraper with the headless option as false (as shown on the extra option section), manually confirm the password and enter the captcha inside the scraper's browser.

## Usage
Clone the repository and run the command below on the root folder

```bash
node index.js <AMAZONEMAIL> <AMAZONPASSWORD>
```

## Extra option

If you want to see the scraper in action you can pass an optional third parameter with the boolean value to control the headless option

```bash
node index.js <AMAZONEMAIL> <AMAZONPASSWORD> false
```

## License

MIT © [lnardon](https://github.com/lnardon)
