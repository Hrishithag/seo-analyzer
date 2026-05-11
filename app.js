const axios = require("axios");
const cheerio = require("cheerio");

const url = process.argv[2] || "https://example.com";

async function analyzeSEO() {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const title = $("title").text();
    const description = $('meta[name="description"]').attr("content");

    const h1 = $("h1").length;
    const h2 = $("h2").length;

    const images = $("img");
    let imagesWithoutAlt = 0;

    images.each((i, img) => {
      if (!$(img).attr("alt")) {
        imagesWithoutAlt++;
      }
    });

    // SCORE CALCULATION
    let score = 0;
    if (title) score += 20;
    if (description) score += 20;
    if (h1 > 0) score += 20;
    if (h2 > 0) score += 20;
    if (imagesWithoutAlt === 0 && images.length > 0) score += 20;

    // FINAL REPORT
    console.log("\n==============================");
    console.log("📊 FINAL SEO REPORT");
    console.log("==============================");

    console.log("🌐 URL:", url);
    console.log("⭐ Score:", score + "/100");

    console.log("\n📌 DETAILS");
    console.log("Title:", title || "❌ Missing");
    console.log("Meta Description:", description || "❌ Missing");
    console.log("H1 Tags:", h1);
    console.log("H2 Tags:", h2);
    console.log("Images:", images.length);
    console.log("Images without ALT:", imagesWithoutAlt);

    // SUGGESTIONS
    console.log("\n💡 SUGGESTIONS");

    if (!title) console.log("❌ Add a title tag");
    else console.log("✅ Title is present");

    if (!description) console.log("❌ Add meta description");
    else console.log("✅ Meta description is good");

    if (h1 === 0) console.log("❌ Add at least one H1");
    else console.log("✅ H1 structure is good");

    if (h2 === 0) console.log("❌ Add H2 for better readability");
    else console.log("✅ H2 structure is good");

    if (imagesWithoutAlt > 0)
      console.log("❌ Add ALT text to images");
    else
      console.log("✅ Image SEO looks good");

    console.log("\n==============================\n");

  } catch (error) {
    console.error("Error:", error.message);
  }
}

analyzeSEO();