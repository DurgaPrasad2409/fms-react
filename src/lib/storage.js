/* ===================================================================
   storage.js — the ONLY file that touches localStorage / sessionStorage.
   Every component calls these functions instead of using the browser
   storage directly, so the "database" logic stays in one place.

   localStorage only stores strings, so objects are JSON.stringify()'d
   going in and JSON.parse()'d coming out.
   =================================================================== */

const FEEDBACK_KEY = "fms_feedback"; // all feedback entries
const USERS_KEY = "fms_users";       // all signed-up accounts
const SESSION_KEY = "fms_session";   // who is logged in (this tab)

// ============================================================
// EDIT DEFAULT ADMIN CREDENTIALS HERE
// This Admin account is created automatically the first time the
// app runs in a browser (only if no admin exists yet).
// ============================================================
export const DEFAULT_ADMIN_USERNAME = "admin";
export const DEFAULT_ADMIN_PASSWORD = "admin123";
// ============================================================

function read(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return []; // corrupted/blocked storage should never crash the app
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

/* ===================== USER ACCOUNTS ===================== */

export function getAllUsers() {
  return read(USERS_KEY);
}

export function seedDefaultAdmin() {
  const users = getAllUsers();
  if (!users.some((u) => u.role === "admin")) {
    users.push({
      name: "Admin",
      username: DEFAULT_ADMIN_USERNAME,
      password: DEFAULT_ADMIN_PASSWORD,
      role: "admin"
    });
    write(USERS_KEY, users);
  }
}

/** Public signup always creates a "user" role. Returns null if the username is taken. */
export function registerUser({ name, username, password }) {
  const users = getAllUsers();
  if (users.some((u) => u.username.toLowerCase() === username.toLowerCase())) return null;

  const user = { name, username, password, role: "user" };
  users.push(user);
  write(USERS_KEY, users);
  return user;
}

/** Checks credentials; on success starts a session and returns the user, else null. */
export function loginUser(username, password) {
  const match = getAllUsers().find(
    (u) => u.username.toLowerCase() === username.toLowerCase() && u.password === password
  );
  if (!match) return null;

  sessionStorage.setItem(
    SESSION_KEY,
    JSON.stringify({ name: match.name, username: match.username, role: match.role })
  );
  return match;
}

export function logout() {
  sessionStorage.removeItem(SESSION_KEY);
}

export function getCurrentUser() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/* ===================== FEEDBACK ===================== */

export function getAllFeedback() {
  return read(FEEDBACK_KEY);
}

export function addFeedback({ customerName, submittedBy, category, rating, comment }) {
  const list = getAllFeedback();
  const entry = {
    id: "fb_" + Date.now() + "_" + Math.random().toString(36).slice(2, 6),
    customerName: customerName || "Anonymous",
    submittedBy,
    category,
    rating: Number(rating),
    comment,
    status: "Pending",
    adminNotes: "",
    date: new Date().toISOString()
  };
  list.push(entry);
  write(FEEDBACK_KEY, list);
  return entry;
}

export function getFeedbackById(id) {
  return getAllFeedback().find((f) => f.id === id) || null;
}

export function getMyFeedback(username) {
  return getAllFeedback()
    .filter((f) => f.submittedBy && f.submittedBy.toLowerCase() === username.toLowerCase())
    .reverse();
}

export function updateFeedback(id, changes) {
  const list = getAllFeedback();
  const i = list.findIndex((f) => f.id === id);
  if (i === -1) return null;
  list[i] = { ...list[i], ...changes };
  write(FEEDBACK_KEY, list);
  return list[i];
}

// make sure an Admin account exists as soon as the app loads
seedDefaultAdmin();
