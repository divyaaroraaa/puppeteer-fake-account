const express = require("express");
const puppeteer = require("puppeteer");
const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

const firstNames = ["Riya", "Monu", "Anjali", "Rahul"];
const lastNames = ["Yadav", "Sharma", "Singh"];

function rand(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomData() {
  const name = `${rand(firstNames)} ${rand(lastNames)}`;
  const email = name.toLowerCase().replace(" ", "") + Math.floor(1000 + Math.random() * 9000) + "@gmail.com";
  const phone = "99" + Math.floor(10000000 + Math.random() * 90000000);
  const password = name.split(" ")[0] + "@123456";
  return { name, email, phone, password };
}

app.post("/start", async (req, res) => {
  const user = randomData();
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();

  try {
    await page.goto("https://cryptosalary.in/reg/RF82BFF688E2F", { timeout: 60000 });
    await page.type("#userFName", user.name);
    await page.type("#userPhone", user.phone);
    await page.type("#userEmail", user.email);
    await page.type("#userPass", user.password);
    await page.type("#CaptchaCode2", "1234"); // Placeholder
    await page.click("#userRegister");
    await page.waitForTimeout(3000);

    const html = await page.content();
    const success = html.toLowerCase().includes("created successfully");

    await browser.close();
    res.json({ success, ...user });
  } catch (e) {
    await browser.close();
    res.json({ success: false, error: e.message });
  }
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.listen(process.env.PORT || 3000);
