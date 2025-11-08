import { formatInTimeZone, utcToZonedTime } from "date-fns-tz";
import { startOfWeek } from "date-fns";

const TIME_ZONE = "Europe/London";

export const isoDateInLondon = (date: Date) => formatInTimeZone(date, TIME_ZONE, "yyyy-MM-dd");

export const startOfLondonWeek = (date: Date) =>
  isoDateInLondon(startOfWeek(utcToZonedTime(date, TIME_ZONE), { weekStartsOn: 1 }));

export const todayInLondon = () => isoDateInLondon(new Date());

export const parseLondonDate = (isoDate: string) => new Date(`${isoDate}T00:00:00`);

export const TIMEZONE = TIME_ZONE;
