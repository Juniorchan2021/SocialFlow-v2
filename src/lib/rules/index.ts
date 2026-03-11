import { XHS_RULES } from './xhs';
import { TWITTER_RULES } from './twitter';
import { FACEBOOK_RULES } from './facebook';
import { INSTAGRAM_RULES } from './instagram';
import { YOUTUBE_RULES } from './youtube';

export type Platform = 'xhs' | 'twitter' | 'facebook' | 'instagram' | 'youtube';

export const PLATFORM_RULES = {
  xhs: XHS_RULES,
  twitter: TWITTER_RULES,
  facebook: FACEBOOK_RULES,
  instagram: INSTAGRAM_RULES,
  youtube: YOUTUBE_RULES,
} as const;

export const ALL_PLATFORMS: { id: Platform; name: string; icon: string }[] = [
  { id: 'xhs', name: '小红书', icon: '📕' },
  { id: 'twitter', name: 'Twitter / X', icon: '🐦' },
  { id: 'facebook', name: 'Facebook', icon: '📘' },
  { id: 'instagram', name: 'Instagram', icon: '📸' },
  { id: 'youtube', name: 'YouTube', icon: '▶️' },
];

export { XHS_RULES, TWITTER_RULES, FACEBOOK_RULES, INSTAGRAM_RULES, YOUTUBE_RULES };
