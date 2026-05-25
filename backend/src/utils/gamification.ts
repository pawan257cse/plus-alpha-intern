import { IUser } from "../models/User.js";

const DAILY_XP_BONUS = 10;
const DAILY_COINS_BONUS = 5;
const REPEAT_XP = 2;
const REPEAT_COINS = 1;

function startOfDay(d = new Date()): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export function resetDailyStatsIfNeeded(user: IUser): void {
  const today = startOfDay();
  const last = user.dailyStatsDate ? startOfDay(new Date(user.dailyStatsDate)) : null;
  if (!last || last.getTime() < today.getTime()) {
    user.dailyXp = 0;
    user.dailyCoins = 0;
    user.dailyStatsDate = today;
  }
}

export function applyLoginStreakAndRewards(user: IUser): void {
  const today = startOfDay();
  const lastLogin = user.lastLogin ? startOfDay(new Date(user.lastLogin)) : null;

  resetDailyStatsIfNeeded(user);

  const isFirstLoginToday = !lastLogin || lastLogin.getTime() < today.getTime();

  if (lastLogin) {
    const diff = (today.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24);
    if (diff === 1) user.streak += 1;
    else if (diff > 1) user.streak = 1;
  } else {
    user.streak = 1;
  }

  user.lastLogin = new Date();

  if (isFirstLoginToday) {
    user.xp += DAILY_XP_BONUS;
    user.dailyXp += DAILY_XP_BONUS;
    user.coins = (user.coins || 0) + DAILY_COINS_BONUS;
    user.dailyCoins = (user.dailyCoins || 0) + DAILY_COINS_BONUS;
  } else {
    user.xp += REPEAT_XP;
    user.dailyXp += REPEAT_XP;
    user.coins = (user.coins || 0) + REPEAT_COINS;
    user.dailyCoins = (user.dailyCoins || 0) + REPEAT_COINS;
  }
}

export function awardActivity(user: IUser, xp: number, coins: number): void {
  resetDailyStatsIfNeeded(user);
  user.xp += xp;
  user.dailyXp += xp;
  user.coins = (user.coins || 0) + coins;
  user.dailyCoins = (user.dailyCoins || 0) + coins;
}
