import fs from "fs";
import path from "path";

let cached: string | null = null;

export function getApiReference(): string {
  if (cached) return cached;
  const filePath = path.join(process.cwd(), "lib", "rfms-api-reference.md");
  cached = fs.readFileSync(filePath, "utf-8");
  return cached;
}
