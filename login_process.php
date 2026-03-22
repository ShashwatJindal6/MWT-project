<?php
// L3 Schools - local login handler
// Uses SQLite by default (no external DB server required).
//
// Local setup:
// 1) Ensure PHP is running (e.g. `php -S localhost:8000` from this folder).
// 2) The first run will create the users table if it doesn't exist.
// 3) Insert a user with a password_hash:
//    - Create your own script to call password_hash(), then INSERT the hash.

declare(strict_types=1);

session_start();

// ---- Config (SQLite) ----
$dbPath = __DIR__ . DIRECTORY_SEPARATOR . 'l3schools.sqlite';
$dsn = 'sqlite:' . $dbPath;

try {
  $pdo = new PDO($dsn);
  $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

  $pdo->exec(
    "CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )"
  );
} catch (Throwable $e) {
  // Fail closed: redirect with server error.
  $next = isset($_POST['next']) ? $_POST['next'] : 'login.html';
  header('Location: ' . $next . '?error=server');
  exit;
}

function redirectTo(string $next, string $errorCode): void {
  // Keep it simple for local usage.
  $sep = (str_contains($next, '?')) ? '&' : '?';
  header('Location: ' . $next . $sep . 'error=' . urlencode($errorCode));
  exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  redirectTo('login.html', 'server');
}

$next = isset($_POST['next']) && is_string($_POST['next']) && $_POST['next'] !== ''
  ? $_POST['next']
  : 'dashboard.html';

$email = isset($_POST['email']) ? trim((string)$_POST['email']) : '';
$password = isset($_POST['password']) ? (string)$_POST['password'] : '';

// Basic validation
if ($email === '' || $password === '') {
  redirectTo('login.html', 'missing');
}

// Ensure it looks like an email (simple heuristic)
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  redirectTo('login.html', 'invalid');
}

try {
  $stmt = $pdo->prepare("SELECT id, email, password_hash FROM users WHERE email = :email LIMIT 1");
  $stmt->execute([':email' => $email]);
  $user = $stmt->fetch(PDO::FETCH_ASSOC);

  if (!$user) {
    // Avoid leaking which part is wrong.
    redirectTo('login.html', 'invalid');
  }

  $hash = (string)$user['password_hash'];
  if (!password_verify($password, $hash)) {
    redirectTo('login.html', 'invalid');
  }

  // Success
  $_SESSION['user_email'] = (string)$user['email'];
  $_SESSION['user_id'] = (int)$user['id'];

  header('Location: ' . $next);
  exit;
} catch (Throwable $e) {
  redirectTo('login.html', 'server');
}
?>

