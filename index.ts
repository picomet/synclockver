#!/usr/bin/env node
import fs from "fs";
import path from "path";

const packageJsonPath = path.join(process.cwd(), "package.json");
const packageLockPath = path.join(process.cwd(), "package-lock.json");
if (fs.existsSync(packageLockPath) && fs.existsSync(packageJsonPath)) {
  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
    const packageLock = JSON.parse(fs.readFileSync(packageLockPath, "utf-8"));
    packageLock.version = packageJson.version;
    packageLock.packages[""].version = packageJson.version;
    fs.writeFileSync(packageLockPath, JSON.stringify(packageLock, null, 2));

    const packages = fs.readdirSync(path.resolve(process.cwd(), "packages"));
    packages.forEach((pkgDir) => {
      try {
        const packagePath = path.join(pkgDir, "package.json");
        if (!fs.existsSync(packagePath)) return;
        const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf-8"));
        packageLock.packages[`packages/${packageJson.name}`].version =
          packageJson.version;
        fs.writeFileSync(packageLockPath, JSON.stringify(packageLock, null, 2));
      } catch (error) {}
    });
  } catch (error) {}
}
