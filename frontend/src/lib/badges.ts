import badge1 from "@/assets/badge1.png";
import badge2 from "@/assets/badge2.png";
import first_pint from "@/assets/badge3.png";
import first_follower from "@/assets/1_follower.png";
import first_like from "@/assets/1_like.png";

export type BadgeCondition = (stats: {
  follower_count: number;
  post_count: number;
  like_count: number;
  pints_consumed_count: number;
}) => boolean;

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  condition: BadgeCondition;
  priority: number;
}

export const badges: Badge[] = [
  {
    id: "pint-baby",
    title: "Pint Baby",
    description: "First Pint Consumed! 🍺",
    icon: first_pint,
    condition: (stats) => stats.pints_consumed_count >= 1,
    priority: 1,
  },
  {
    id: "6-pack",
    title: "6-Pack",
    description: "Consumed 6 Pints! 🍻",
    icon: badge2,
    condition: (stats) => stats.pints_consumed_count >= 6,
    priority: 2,
  },
  {
    id: "first-friend",
    title: "First Friend",
    description: "First Follower Gained! 👤",
    icon: first_follower,
    condition: (stats) => stats.follower_count >= 1,
    priority: 1,
  },
  {
    id: "first-like",
    title: "First Like",
    description: "Gave first Like! ❤️",
    icon: first_like,
    condition: (stats) => stats.like_count >= 1,
    priority: 1,
  },
  {
    id: "pint-champ",
    title: "Pint Champion",
    description: "100 beers consumed! 🍺",
    icon: badge1,
    condition: (stats) => stats.pints_consumed_count >= 100,
    priority: 3,
  },
];