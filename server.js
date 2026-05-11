const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();

app.use(express.urlencoded({ extended: true }));

// HOME PAGE
app.get("/", (req, res) => {

  res.send(`

  <html>

  <head>

    <title>SEO Analyzer</title>

    <style>

      body{
        font-family: Arial;
        background:#f4f4f4;
        text-align:center;
        padding:50px;
      }

      .box{
        background:white;
        width:500px;
        margin:auto;
        padding:30px;
        border-radius:12px;
        box-shadow:0 0 10px rgba(0,0,0,0.1);
      }

      input{
        width:80%;
        padding:12px;
        margin:10px;
      }

      button{
        padding:12px 20px;
        background:#007bff;
        color:white;
        border:none;
        border-radius:6px;
        cursor:pointer;
      }

      button:hover{
        background:#0056b3;
      }

    </style>

  </head>

  <body>

    <div class="box">

      <h1 seo analyzer
      </h1>

      <form action="/analyze" method="POST">

        <input
          type="text"
          name="url"
          placeholder="Enter Website URL"
          required
        />

        <br>

        <button type="submit">
          Analyze
        </button>

      </form>

    </div>

  </body>

  </html>

  `);

});


// ANALYZE ROUTE
app.post("/analyze", async (req, res) => {

  const url = req.body.url;

  try {

    const response = await axios.get(url);

    const $ = cheerio.load(response.data);

    const title = $("title").text();

    const metaDesc =
      $('meta[name="description"]').attr("content");

    const h1Count = $("h1").length;

    const h2Count = $("h2").length;

    const images = $("img");

    let missingAlt = 0;

    images.each((i, img) => {

      if (!$(img).attr("alt")) {
        missingAlt++;
      }

    });

    const text = $("body").text();

    const wordCount =
      text.trim().split(/\s+/).length;

    const internalLinks =
      $("a[href^='/']").length;

    const externalLinks =
      $("a[href^='http']").length;

    let score = 0;

    if (title) score += 20;

    if (metaDesc) score += 20;

    if (h1Count > 0) score += 20;

    if (h2Count > 0) score += 20;

    if (missingAlt === 0) score += 20;

    let suggestions = [];

    if (!metaDesc) {
      suggestions.push("Add meta description");
    }

    if (h2Count === 0) {
      suggestions.push("Add H2 headings");
    }

    if (missingAlt > 0) {
      suggestions.push("Add ALT tags to images");
    }

    let color = "red";

    if (score >= 80) {
      color = "green";
    }

    else if (score >= 50) {
      color = "orange";
    }

    res.send(`

    <html>

    <head>

      <title>SEO Report</title>

      <style>

        body{
          font-family:Arial;
          background:#f4f4f4;
          padding:40px;
        }

        .report{
          background:white;
          width:700px;
          margin:auto;
          padding:30px;
          border-radius:12px;
          box-shadow:0 0 10px rgba(0,0,0,0.1);
        }

        h1{
          text-align:center;
        }

        .score{
          text-align:center;
          font-size:32px;
          color:${color};
          margin:20px;
        }

        ul{
          color:red;
        }

      </style>

    </head>

    <body>

      <div class="report">

        <h1>📊 SEO REPORT</h1>

        <div class="score">
          ⭐ ${score}/100
        </div>

        <h3>🌐 URL</h3>

        <p>${url}</p>

        <h3>📌 BASIC SEO</h3>

        <p><b>Title:</b> ${title}</p>

        <p>
          <b>Meta Description:</b>
          ${metaDesc || "Missing"}
        </p>

        <p><b>H1 Tags:</b> ${h1Count}</p>

        <p><b>H2 Tags:</b> ${h2Count}</p>

        <h3>🖼️ Images</h3>

        <p><b>Total Images:</b> ${images.length}</p>

        <p>
          <b>Missing ALT Tags:</b>
          ${missingAlt}
        </p>

        <h3>🔗 Links</h3>

        <p>
          <b>Internal Links:</b>
          ${internalLinks}
        </p>

        <p>
          <b>External Links:</b>
          ${externalLinks}
        </p>

        <h3>📝 Content</h3>

        <p>
          <b>Word Count:</b>
          ${wordCount}
        </p>

        <h3>💡 Suggestions</h3>

        <ul>

          ${suggestions
            .map(s => `<li>${s}</li>`)
            .join("")}

        </ul>

        <br>

        <a href="/">
          🔙 Analyze Another Website
        </a>

      </div>

    </body>

    </html>

    `);

  }

  catch (error) {

    res.send(`

      <h1>❌ Error Fetching Website</h1>

      <a href="/">
        Go Back
      </a>

    `);

  }

});


// SERVER
app.listen(3000, () => {

  console.log(
    "Server running at http://localhost:3000"
  );

});