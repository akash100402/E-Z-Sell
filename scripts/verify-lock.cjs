/**
 * Verifies package-lock "packages"."." includes every dependency and devDependency
 * declared in package.json, and (for client) that overrides keys match.
 * Run: npm run verify-lock  (from repo root)
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function verifyPackageLock(pkgPath, lockPath, label, { checkOverrides = false } = {}) {
  const pkg = readJson(pkgPath);
  if (!fs.existsSync(lockPath)) {
    console.error(JSON.stringify({ ok: false, label, error: "package-lock.json missing" }));
    return false;
  }
  let lock;
  try {
    lock = readJson(lockPath);
  } catch (_e) {
    console.error(JSON.stringify({ ok: false, label, error: "package-lock.json parse error" }));
    return false;
  }
  const rootPkg = (lock.packages && lock.packages[""]) || {};
  const lockDeps = rootPkg.dependencies || {};
  const lockDev = rootPkg.devDependencies || {};

  const missingDeps = [];
  for (const name of Object.keys(pkg.dependencies || {})) {
    if (!Object.prototype.hasOwnProperty.call(lockDeps, name)) {
      missingDeps.push(name);
    }
  }

  const missingDev = [];
  for (const name of Object.keys(pkg.devDependencies || {})) {
    if (!Object.prototype.hasOwnProperty.call(lockDev, name)) {
      missingDev.push(name);
    }
  }

  let overrideMismatch = null;
  if (checkOverrides) {
    const want = pkg.overrides || {};
    const have = lock.overrides || {};
    const wantKeys = Object.keys(want).sort().join(",");
    const haveKeys = Object.keys(have).sort().join(",");
    if (wantKeys !== haveKeys) {
      overrideMismatch = { want: Object.keys(want), have: Object.keys(have) };
    }
  }

  if (missingDeps.length || missingDev.length || overrideMismatch) {
    console.error(
      JSON.stringify({
        ok: false,
        label,
        missingDeps,
        missingDev,
        overrideMismatch,
        hint: `Run npm install in ${path.dirname(pkgPath)}, then commit package-lock.json`,
      })
    );
    return false;
  }
  return true;
}

const okRoot = verifyPackageLock(
  path.join(root, "package.json"),
  path.join(root, "package-lock.json"),
  "root"
);

const okClient = verifyPackageLock(
  path.join(root, "client", "package.json"),
  path.join(root, "client", "package-lock.json"),
  "client",
  { checkOverrides: true }
);

if (okRoot && okClient) {
  console.log("verify-lock: root + client lockfiles match their package.json manifests");
} else {
  process.exitCode = 1;
}
