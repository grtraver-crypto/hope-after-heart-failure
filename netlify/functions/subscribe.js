/**
 * Free-chapter signup -> MailerLite.
 *
 * Why this exists rather than posting straight to MailerLite from the browser:
 * MailerLite's *form* endpoint forces double opt-in, so subscribers landed as
 * "Unconfirmed" and never entered the welcome automation. There is no setting to
 * turn that off on this plan. Its *API* honours the "Double opt-in for API and
 * integrations" toggle, which is off — so subscribers created here arrive Active
 * and the automation fires immediately.
 *
 * The API key must never reach the browser, which is the other reason this runs
 * server-side. It comes from Netlify environment variables.
 *
 * Environment variables (Netlify → Project configuration → Environment variables):
 *   MAILERLITE_API_KEY    required. From MailerLite → Integrations → API.
 *   MAILERLITE_GROUP_ID   optional. Only needed to override the group looked up
 *                         by name below - MailerLite's dashboard no longer shows
 *                         group ids in the URL, so we resolve it ourselves.
 */

const MAILERLITE_API = "https://connect.mailerlite.com/api";
const DEFAULT_GROUP_NAME = "Free Chapter";

/* Cached between invocations while the function stays warm, keyed by group
   name, so each form's group lookup usually costs nothing after the first
   call. Populated lazily by resolveGroupId, and by the MAILERLITE_GROUP_ID
   override below (which always wins for the default group only — a form
   that names its own list still resolves that name normally). */
const cachedGroupIds = {};

function authHeaders(apiKey) {
  return {
    Authorization: "Bearer " + apiKey,
    "Content-Type": "application/json",
    Accept: "application/json",
  };
}

/** Find a group's id by name (case-insensitive). Returns null if it can't. */
async function resolveGroupId(apiKey, groupName) {
  if (groupName === DEFAULT_GROUP_NAME && process.env.MAILERLITE_GROUP_ID) {
    return process.env.MAILERLITE_GROUP_ID;
  }
  if (cachedGroupIds[groupName]) return cachedGroupIds[groupName];

  try {
    const response = await fetch(MAILERLITE_API + "/groups?limit=100", {
      headers: authHeaders(apiKey),
    });
    if (!response.ok) {
      console.error("Could not list groups", response.status, await response.text());
      return null;
    }

    const body = await response.json();
    const groups = body && body.data ? body.data : [];
    const match = groups.find(function (g) {
      return g.name && g.name.toLowerCase() === groupName.toLowerCase();
    });

    if (!match) {
      console.error('No group named "' + groupName + '" found');
      return null;
    }

    cachedGroupIds[groupName] = match.id;
    return cachedGroupIds[groupName];
  } catch (err) {
    console.error("Group lookup failed", err);
    return null;
  }
}

function reply(statusCode, payload) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  };
}

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return reply(405, { error: "Method not allowed" });
  }

  const apiKey = process.env.MAILERLITE_API_KEY;

  if (!apiKey) {
    // Logged for the Netlify function log; the visitor gets a generic message.
    console.error("MAILERLITE_API_KEY is not set");
    return reply(500, { error: "Signup is misconfigured" });
  }

  let name = "";
  let email = "";
  let honeypot = "";
  let groupName = DEFAULT_GROUP_NAME;

  try {
    // The browser sends form-encoded data, same shape as a normal form post.
    const params = new URLSearchParams(event.body || "");
    name = (params.get("name") || "").trim();
    email = (params.get("email") || "").trim();
    honeypot = (params.get("bot-field") || "").trim();
    // Optional: which MailerLite group this signup belongs to. Forms that
    // don't send it (the original free-chapter forms) keep landing in
    // DEFAULT_GROUP_NAME exactly as before.
    groupName = (params.get("list") || DEFAULT_GROUP_NAME).trim() || DEFAULT_GROUP_NAME;
  } catch (err) {
    return reply(400, { error: "Could not read the submission" });
  }

  // Bots fill hidden fields; people don't. Answer 200 so the bot learns nothing.
  if (honeypot) {
    return reply(200, { ok: true });
  }

  if (!email || email.indexOf("@") === -1) {
    return reply(400, { error: "A valid email address is required" });
  }

  const subscriber = {
    email: email,
    fields: { name: name },
    status: "active",
  };

  // Group membership is what the welcome automation triggers on. Without it the
  // subscriber exists but receives nothing.
  const groupId = await resolveGroupId(apiKey, groupName);
  if (groupId) {
    subscriber.groups = [groupId];
  } else {
    console.error('No group id available for "' + groupName + '" - subscriber will not be grouped');
  }

  try {
    const response = await fetch(MAILERLITE_API + "/subscribers", {
      method: "POST",
      headers: authHeaders(apiKey),
      body: JSON.stringify(subscriber),
    });

    const text = await response.text();

    if (!response.ok) {
      // Log the real reason for us; keep it vague for the visitor.
      console.error("MailerLite rejected the subscriber", response.status, text);
      return reply(502, { error: "Signup service rejected the request" });
    }

    return reply(200, { ok: true });
  } catch (err) {
    console.error("Could not reach MailerLite", err);
    return reply(502, { error: "Could not reach the signup service" });
  }
};
