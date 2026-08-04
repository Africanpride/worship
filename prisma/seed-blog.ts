import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const posts = [
  {
    title: "Recovering the Altar of David",
    slug: "recovering-the-altar-of-david",
    category: "Devotional",
    excerpt:
      "Why Davidic worship removes every veil and opens continuous access to God's manifested presence.",
    content: `<p>The Tabernacle of David was unlike any other worship structure in Scripture. While the Tabernacle of Moses placed barriers between God's presence and His people — courts, veils, and restricted access — David's tabernacle removed every barrier.</p>
<p>David understood something profound: worship is not an activity reserved for special occasions. It is a lifestyle, a rhythm, a continuous offering before the Lord. He appointed musicians, singers, and gatekeepers to minister before the Ark continually — not for an hour, not for a day, but perpetually.</p>
<h3>Why This Matters Today</h3>
<p>In our generation, the call to recover the Tabernacle of David is not about recreating a physical tent. It is about restoring the heart of worship — a heart that longs for God's presence above all else, that offers praise not because of circumstances but because of who He is.</p>
<p>When we worship continuously, we align ourselves with what is already happening in heaven. Revelation 4:8 declares that the living creatures never cease saying, "Holy, holy, holy is the Lord God Almighty." The Non-Stop Series exists to reflect that heavenly pattern on earth.</p>
<h3>A Prayer</h3>
<p>Lord, restore in us the heart of David. Let our worship not be confined to Sunday mornings or special events, but let it become the rhythm of our lives. May praise, prayer, and Your Word flow continuously from our hearts, our homes, and our communities.</p>`,
    image: "/nonstop/nonstop-003.jpg",
    author: "The Non-Stop Series Team",
    featured: true,
    published: true,
    publishedAt: new Date("2026-07-01"),
  },
  {
    title: "The Mystery of the Night Watch",
    slug: "the-mystery-of-the-night-watch",
    category: "Teaching",
    excerpt:
      "Understanding the spiritual power of standing before the Lord during the midnight and early morning hours.",
    content: `<p>Throughout Scripture, the night watches hold special spiritual significance. It was during the night that God spoke to Jacob, gave dreams to Joseph, delivered Israel from Egypt, and revealed His purposes to prophets.</p>
<p>Psalm 63:6 declares: "On my bed I remember you; I think of you through the watches of the night." David understood that the night hours are not merely for sleep — they are moments of spiritual encounter.</p>
<h3>Why the Night Watches Matter</h3>
<p>In the ancient world, the night was divided into four watches. Each watch was a period of alertness, prayer, and spiritual vigilance. The midnight watch, in particular, was associated with divine intervention.</p>
<p>When Paul and Silas were imprisoned, they prayed and sang hymns at midnight — and God shook the foundations of the prison (Acts 16:25-26). The midnight hour carries prophetic weight.</p>
<h3>The Night Watches in the Non-Stop Series</h3>
<p>During the 144 hours, the night watches become moments of deep consecration. As the world sleeps, worshippers and intercessors stand before the Lord, carrying the needs of nations and families. These are the hours when heaven draws near, when spiritual breakthroughs are birthed, when the fire on the altar burns brightest.</p>
<h3>A Prayer</h3>
<p>Lord, teach us to watch and pray. May the night hours become moments of encounter with You. Raise up watchmen who will not be silent, who will stand on the walls until You establish praise in the earth.</p>`,
    image: "/nonstop/nonstop-006.jpg",
    author: "The Non-Stop Series Team",
    featured: false,
    published: true,
    publishedAt: new Date("2026-07-03"),
  },
  {
    title: "Why 144 Hours? Scriptural Completion",
    slug: "why-144-hours-scriptural-completion",
    category: "Vision",
    excerpt:
      "Exploring the biblical number symbolism of 24 elders, 120 priests, and 144 hours of unbroken ministry.",
    content: `<p>The number 144 is rich with biblical significance. It is the sum of 24 and 120 — two numbers that carry profound meaning in Scripture.</p>
<h3>24: The Elders in Heaven</h3>
<p>Revelation 4:4 describes 24 elders surrounding God's throne, leading continuous worship. The number 24 represents the completeness of heavenly worship — an unbroken cycle of adoration before the Lord.</p>
<h3>120: Priesthood and Restoration</h3>
<p>The number 120 appears throughout Scripture in contexts of priesthood, restoration, and divine timing:</p>
<ul>
<li>120 days of grace given for man to repent before the flood (Genesis 6:3)</li>
<li>120 priests assigned to lead worship when the Ark returned to Jerusalem (2 Chronicles 5:12)</li>
<li>120 believers who waited for the Holy Spirit after Jesus' ascension (Acts 1:15)</li>
</ul>
<h3>144: The Ultimate Outcome</h3>
<p>When you add 24 (heavenly worship) and 120 (earthly priesthood), you get 144. The Non-Stop Series represents the ultimate desired outcome: priesthood on earth that mirrors heavenly worship. For 144 hours — one full week — the altar remains active, reflecting the continuous worship of heaven.</p>
<h3>A Prayer</h3>
<p>Lord, as we offer 144 hours of continuous worship, may heaven and earth join together. Let our praise mirror the sound of Your throne room. Let our prayers rise as incense before You. Let Your Word go forth with power across the nations.</p>`,
    image: "/nonstop/nonstop-017.jpg",
    author: "The Non-Stop Series Team",
    featured: false,
    published: true,
    publishedAt: new Date("2026-07-05"),
  },
];

async function main() {
  for (const post of posts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: post,
      create: post,
    });
    console.log(`✓ Upserted: ${post.title}`);
  }
  console.log("Blog seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
