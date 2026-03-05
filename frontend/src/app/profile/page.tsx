import { Metadata } from "next";
import ProfileHero from "@/components/profile/ProfileHero";
import ProfileBio from "@/components/profile/ProfileBio";
import ProfileTimeline from "@/components/profile/ProfileTimeline";
import ProfileFacts from "@/components/profile/ProfileFacts";

export const metadata: Metadata = {
  title: "Profile — Kim Minju Fan Site",
  description: "Biography, career timeline, and story of Kim Minju.",
};

export default function ProfilePage() {
  return (
    <main className="pt-20">
      <ProfileHero />
      <ProfileBio />
      <ProfileTimeline />
      <ProfileFacts />
    </main>
  );
}
