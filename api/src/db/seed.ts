import { db } from "./index";
import { minujProfile, works } from "./schema";

async function seed() {
  // Profile
  await db.insert(minujProfile).values({
    name: "Kim Minju",
    nameKorean: "김민주",
    birthdate: "2001-02-05",
    agency: "Kakao Entertainment",
    bio: "Kim Minju is a South Korean actress and model born on February 5, 2001 in Daejeon. She rose to fame as a member of IZ*ONE (2018–2021), formed through the Mnet survival show Produce 48. After the group's disbandment, she signed with Kakao Entertainment and transitioned into acting. Known for her ethereal visuals and warm personality, she has steadily built her career as one of Korea's rising young actresses.",
  }).onConflictDoNothing();

  // Works
  await db.insert(works).values([
    {
      title: "Produce 48",
      titleKorean: "프로듀스 48",
      year: 2018,
      role: "Contestant (12th place)",
      poster: "https://image.tmdb.org/t/p/w500/6C2HYhGMSMkWgRiDJ8LGwcVwX1Q.jpg",
      synopsis: "A collaboration survival show between Mnet and AKB48. 96 Korean and Japanese trainees compete for 12 debut spots in a new group. Minju finished in 12th place, debuting as a member of IZ*ONE.",
      type: "variety",
    },
    {
      title: "Welcome to Waikiki 2",
      titleKorean: "으라차차 와이키키 2",
      year: 2019,
      role: "Han Yoon-ah",
      poster: "https://image.tmdb.org/t/p/w500/m53SYwOSBCQHFv8D3xlwm0xYQce.jpg",
      synopsis: "The second season of the romantic comedy series about three dreamers running a guesthouse in Itaewon, Seoul.",
      type: "drama",
    },
    {
      title: "IZ*ONE Chu",
      titleKorean: "아이즈원츄",
      year: 2018,
      role: "Herself",
      poster: null,
      synopsis: "A reality web series documenting the daily lives and activities of IZ*ONE members.",
      type: "variety",
    },
    {
      title: "Trolley",
      titleKorean: "트롤리",
      year: 2022,
      role: "Kim Soo-bin",
      poster: "https://image.tmdb.org/t/p/w500/qbGlLVHiDLjBLVTSJWbMtFHBkrB.jpg",
      synopsis: "A politician's wife with a dark secret is thrust into a moral dilemma. Kim Soo-bin is a high school student whose life becomes entangled in a political scandal that tears families apart.",
      type: "drama",
    },
    {
      title: "Ask the Stars",
      titleKorean: "별에게 물어봐",
      year: 2023,
      role: "Oh Bok-soon",
      poster: "https://image.tmdb.org/t/p/w500/8S3RB0l5NJ4RZMV1anFjFcSHJjE.jpg",
      synopsis: "A romantic comedy set aboard the first commercial space station. Oh Bok-soon is a spirited crew member who falls in love with a surgeon who boards the station.",
      type: "drama",
    },
    {
      title: "The Midnight Studio",
      titleKorean: "심야화실",
      year: 2024,
      role: "Hong Ye-seul",
      poster: "https://image.tmdb.org/t/p/w500/7rHVXaIhLd4kCBhGxnBqjGSSM9r.jpg",
      synopsis: "A mysterious midnight art studio draws in a young art student, Hong Ye-seul, who encounters a reclusive painter and uncovers the secrets hidden within his work.",
      type: "drama",
    },
  ]).onConflictDoNothing();

  console.log("[seed] Profile and works inserted.");
}

seed().then(() => process.exit(0)).catch((err) => {
  console.error(err);
  process.exit(1);
});
