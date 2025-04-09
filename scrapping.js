const axios = require("axios");
const cheerio = require("cheerio");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const urls = [
  {
    url: "https://new-fik.upnvj.ac.id/dosen-tetap-s1-informatika/",
    jurusan: "S1 Informatika",
  },
  {
    url: "https://new-fik.upnvj.ac.id/dosen-tetap-s1-sistem-informasi/",
    jurusan: "S1 Sistem Informasi",
  },
  {
    url: "https://new-fik.upnvj.ac.id/dosen-tetap-d3-sistem-informasi/",
    jurusan: "D3 Sistem Informasi",
  },
  {
    url: "https://new-fik.upnvj.ac.id/dosen-tetap-sains-data-s-1/",
    jurusan: "S1 Sains Data",
  },
];

const scrapeDosen = async (url) => {
  try {
    const res = await axios.get(url);
    const $ = cheerio.load(res.data);

    const dosenList = new Set();

    $(".elementor-widget-container").each((i, el) => {
      $(el)
        .find("h2, h3, h4, strong")
        .each((j, tag) => {
          const name = $(tag).text().trim();
          if (name && name.length > 5 && name.includes(".")) {
            dosenList.add(name.replace(/\s+/g, " ").trim());
          }
        });
    });

    return Array.from(dosenList);
  } catch (err) {
    console.error("❌ Error scraping:", url);
    return [];
  }
};

const main = async () => {
  for (const { url, jurusan } of urls) {
    console.log("\n📥 Scraping:", jurusan);
    const dosen = await scrapeDosen(url);

    for (let i = 0; i < dosen.length; i++) {
      const name = dosen[i];
      try {
        await prisma.dosentetapfik.create({
          data: {
            nama_lengkap: name,
            jurusan,
            order: i + 1,
          },
        });
        console.log(`✅ Inserted: ${name}`);
      } catch (err) {
        console.error(`❌ Gagal insert ${name}:`, err.message);
      }
    }
  }

  console.log("\n🎉 Done inserting all dosen!");
  await prisma.$disconnect();
};

main();
