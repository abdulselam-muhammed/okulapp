/**
 * Seed script for projects + articles.
 *
 * Usage: npx tsx scripts/seed-projects-articles.ts
 *
 * Creates 4 sample projects (with cover + gallery images) and 6 articles
 * linked to those projects. Uses Unsplash photo URLs so no upload required.
 */
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3307,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "okulapp",
  waitForConnections: true,
  connectionLimit: 5,
});

const projects = [
  {
    title: "Winter Shelter Drive",
    description:
      "Building insulated outdoor shelters for stray cats and dogs across campus during the coldest months. Our volunteers construct, place, and maintain these shelters in strategic spots where animals naturally gather. Each shelter is weatherproofed, lined with straw, and inspected weekly.",
    cover_image_url: "https://images.unsplash.com/photo-1583511655826-05700d52f4d9?w=1200&q=80",
    start_date: "2026-01-15",
    end_date: "2026-04-30",
    status: "active",
    donation_goal: 5000,
    donation_raised: 1850,
    gallery: [
      "https://images.unsplash.com/photo-1517423568366-8b83523034fd?w=800&q=80",
      "https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=800&q=80",
      "https://images.unsplash.com/photo-1494256997604-768d1f608cac?w=800&q=80",
    ],
  },
  {
    title: "Spay & Neuter Clinic Days",
    description:
      "Monthly free spay & neuter clinics for campus strays in partnership with the veterinary faculty. We schedule trap-neuter-return (TNR) days for feral colonies and adoption preparation surgeries for socialized animals. Each clinic also includes vaccinations, microchipping, and basic health screening.",
    cover_image_url: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=1200&q=80",
    start_date: "2026-02-01",
    end_date: null,
    status: "active",
    donation_goal: 8000,
    donation_raised: 3200,
    gallery: [
      "https://images.unsplash.com/photo-1612531822050-f6927d8f7cd9?w=800&q=80",
      "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&q=80",
    ],
  },
  {
    title: "Campus Feeding Stations Expansion",
    description:
      "Doubling the number of automated feeding & water stations across campus from 12 to 24. Each new station includes a weather-resistant feeder, a fresh water dispenser with a filter, and a small shelter overhang. Volunteers refill stations daily and the smart sensors alert us when supplies run low.",
    cover_image_url: "https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?w=1200&q=80",
    start_date: "2025-11-01",
    end_date: "2026-06-30",
    status: "active",
    donation_goal: 12000,
    donation_raised: 9750,
    gallery: [
      "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=800&q=80",
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&q=80",
      "https://images.unsplash.com/photo-1444212477490-ca407925329e?w=800&q=80",
      "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&q=80",
    ],
  },
  {
    title: "Adoption Awareness Week",
    description:
      "A week-long campaign each spring to connect rescued campus animals with loving homes. We host meet-and-greet events at the student union, partner with local vets for free check-ups for new adopters, and share success stories on social media. Completed in spring 2025 with 23 adoptions.",
    cover_image_url: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=1200&q=80",
    start_date: "2025-04-10",
    end_date: "2025-04-17",
    status: "completed",
    donation_goal: 2000,
    donation_raised: 2150,
    gallery: [
      "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&q=80",
      "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&q=80",
    ],
  },
];

const articles = [
  {
    projectIdx: 0,
    title: "How we built 30 winter shelters in 3 weeks",
    cover_image_url: "https://images.unsplash.com/photo-1583511655826-05700d52f4d9?w=1200&q=80",
    content: `When the temperature dropped below freezing last December, we knew we had to act fast.

Our team of 40 volunteers gathered in the engineering quad with stacks of insulated plywood, weatherproof tarps, and bales of straw. The plan was simple: build, place, monitor.

By the end of week one, we had 12 shelters placed in known cat colonies behind the library and around the dining halls. Week two brought another 10 to the dormitory areas. Week three closed out with 8 more in the sports complex perimeter.

Each shelter is designed with a small, offset entrance that traps body heat while keeping out wind and rain. The straw lining (never blankets — they hold moisture) is replaced monthly.

Three months in, we've seen consistent use across 26 of the 30 shelters. Two cats we'd been worried about — Marshmallow and Pepper — have settled into one in the courtyard and now show up to feeding stations like clockwork.

Thank you to everyone who donated lumber, time, and warm meals to the construction crews. This wouldn't have happened without you.`,
    published_at: "2026-02-12",
  },
  {
    projectIdx: 0,
    title: "Meet Marshmallow: a winter shelter success story",
    cover_image_url: "https://images.unsplash.com/photo-1494256997604-768d1f608cac?w=1200&q=80",
    content: `Marshmallow first appeared near the library shelters in mid-January, painfully thin and clearly not used to the cold.

For the first week she only came out at night, slipping into Shelter #4 around 2 AM and leaving before sunrise. Volunteer Sarah set up a remote camera and tracked her routine — same time, same shelter, every night.

By week three, she was visiting the feeding station 20 meters away. By week four, she let one of our volunteers sit nearby while she ate.

This week she walked over and let me scratch her ears for the first time. She's putting on weight, her coat is recovering, and she has a name now.

This is what success looks like — not always a rescue, sometimes just a warm place to sleep and a daily meal.`,
    published_at: "2026-02-20",
  },
  {
    projectIdx: 1,
    title: "March clinic: 18 animals, zero complications",
    cover_image_url: "https://images.unsplash.com/photo-1612531822050-f6927d8f7cd9?w=1200&q=80",
    content: `Our March spay & neuter day was our smoothest yet.

Eighteen animals — 11 cats and 7 dogs — came through the surgical bay between 8 AM and 4 PM. Every single one made it home with no complications, fully vaccinated, microchipped, and ready to recover.

Special thanks to Dr. Kaya and the three vet students who volunteered their entire Saturday. The student union loaned us the conference room as a recovery space, and a local pet supply store donated all the soft-cone recovery collars.

Two of the cats — a mother-and-kitten pair we rescued from behind the gym — will be available for adoption in two weeks once they fully recover.

If you'd like to volunteer at the next clinic (April 12), email us at volunteer@campuscare.edu.`,
    published_at: "2026-03-22",
  },
  {
    projectIdx: 2,
    title: "Station 17 is live: smart sensors are working",
    cover_image_url: "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=1200&q=80",
    content: `Yesterday we installed Station 17 behind the chemistry building, marking the halfway point of our feeding stations expansion.

The big upgrade in this batch: smart sensors. Each new station has a weight sensor in the food bowl and a flow meter on the water dispenser. When food drops below 20% or water below 30%, the sensor sends an alert to our volunteer chat group with the station ID.

Result: we caught two empty stations within 90 minutes of them going empty last week — previously, that took 8-12 hours.

Stations 18-24 are scheduled for the next two months. Locations have been chosen based on three months of feeding pattern data we've collected from the existing 12.`,
    published_at: "2026-03-05",
  },
  {
    projectIdx: 2,
    title: "Where do our feeding stations go? A data story",
    cover_image_url: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=1200&q=80",
    content: `Choosing where to place a feeding station is harder than it sounds. Place it wrong and the food gets eaten by birds, the water freezes, or the local cats avoid it.

We've been logging every visit to our existing 12 stations for six months — over 14,000 visits — and the pattern is clear: cats prefer stations within 3 meters of cover (bushes, walls, low fences) and within 50 meters of two other known feeding spots.

Stations placed in open spaces (the central quad, for example) saw 70% less usage despite being heavily trafficked by humans. Cats simply didn't feel safe.

For the next 12 stations, we used this data to pick locations. Early results from the first 5 expansion stations show usage rates 2-3x higher than the original average.

If you're curious, all our anonymized usage data is on our dashboard at /dashboard/map.`,
    published_at: "2026-03-18",
  },
  {
    projectIdx: 3,
    title: "Adoption Week 2025: 23 happy endings",
    cover_image_url: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=1200&q=80",
    content: `Last spring's Adoption Awareness Week exceeded every goal we set.

Twenty-three animals found permanent homes — 17 cats and 6 dogs. Eight of those were animals we'd been caring for over a year (including Buddy, the senior tabby we'd nearly given up on placing).

The week-long event included:
- Daily meet-and-greet sessions at the student union (we counted 1,200+ visitors)
- A trivia night fundraiser at the campus pub ($340 raised)
- Free first vet visits donated by Campus Veterinary Clinic for every adoption
- An Instagram takeover featuring "Pet of the Day" from our shelter
- A graduating-senior partnership where 9 final-year students adopted before moving home

Every adoption family was contacted at 3 months and 6 months for follow-up. Twenty-two of the 23 placements remain successful. (One cat was returned and re-placed with a more experienced cat household — these things happen and the system worked.)

We're already planning Adoption Week 2026 for April. If you'd like to be on the host-family wait-list, sign up at /support.`,
    published_at: "2025-04-25",
  },
];

async function seed() {
  const conn = await pool.getConnection();

  try {
    console.log("Seeding projects + articles...\n");

    // Clean up existing seeded data (matches by title)
    const titles = projects.map((p) => p.title);
    const placeholders = titles.map(() => "?").join(",");
    await conn.execute(
      `DELETE FROM projects WHERE title IN (${placeholders})`,
      titles
    );

    // Find an admin user to attribute as creator
    const [adminRows] = await conn.execute<any[]>(
      `SELECT id FROM users WHERE role = 'admin' ORDER BY id ASC LIMIT 1`
    );
    const adminId = adminRows[0]?.id ?? null;

    if (!adminId) {
      console.log("⚠️  No admin user found — projects will have created_by = NULL");
    } else {
      console.log(`Using admin user #${adminId} as creator\n`);
    }

    // Insert projects + gallery images
    const projectIds: number[] = [];
    for (const p of projects) {
      const [result] = await conn.execute<any>(
        `INSERT INTO projects
          (title, description, cover_image_url, start_date, end_date, status, donation_goal, donation_raised, created_by)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          p.title,
          p.description,
          p.cover_image_url,
          p.start_date,
          p.end_date,
          p.status,
          p.donation_goal,
          p.donation_raised,
          adminId,
        ]
      );
      const projectId = result.insertId;
      projectIds.push(projectId);

      // Gallery images
      for (let i = 0; i < p.gallery.length; i++) {
        await conn.execute(
          `INSERT INTO project_images (project_id, image_url, sort_order) VALUES (?, ?, ?)`,
          [projectId, p.gallery[i], i]
        );
      }

      console.log(`  ✓ Project: "${p.title}" (id #${projectId}, ${p.gallery.length} images)`);
    }

    console.log(`\nCreated ${projects.length} projects with galleries`);

    // Insert articles
    for (const a of articles) {
      const projectId = projectIds[a.projectIdx];
      await conn.execute(
        `INSERT INTO articles
          (project_id, title, cover_image_url, content, author_id, published_at)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [projectId, a.title, a.cover_image_url, a.content, adminId, a.published_at]
      );
      console.log(`  ✓ Article: "${a.title}" (project #${projectId})`);
    }

    console.log(`\nCreated ${articles.length} articles`);
    console.log("\nSeed complete!");
  } catch (err) {
    console.error("Seed failed:", err);
    throw err;
  } finally {
    conn.release();
    await pool.end();
  }
}

seed();
