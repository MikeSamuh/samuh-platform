// Central place for every "schedule with Samuh" link.
// All slots currently use the shared Samuh booking page; split per-purpose
// URLs out here if they diverge later.
const SAMUH_BOOKING_URL =
  "https://calendar.google.com/calendar/appointments/schedules/AcZssZ2GhcOiaIuGi6qcj2aNKFbU8Oz1r0cJbRLjbvxeSXsao29G7ijfgXcghESmXO0P6b0XNKjianB0";

export const bookingLinks = {
  coachingCall: SAMUH_BOOKING_URL, // 30-min coaching call with Samuh
  teamGoogleCalendar: SAMUH_BOOKING_URL, // Samuh teams Google Calendar (Launch step)
  workshop: SAMUH_BOOKING_URL, // in-person workshop (Belonging step)
  ongoingSupport: SAMUH_BOOKING_URL, // 90-day sprint / workshop (Action step)
};
