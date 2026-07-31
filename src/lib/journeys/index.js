import { teamJourney } from "./team";
import { orgqJourney } from "./orgq";

// Every journey the app can render. A journey's id doubles as its IconRail view
// id and its slot in the saved-navigation blob, so ids must stay stable.
export const journeyList = [teamJourney, orgqJourney];

export const journeys = Object.fromEntries(journeyList.map((j) => [j.id, j]));

export function isJourneyView(view) {
  return Object.hasOwn(journeys, view);
}
