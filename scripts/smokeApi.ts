// scripts/smoke-api.ts (solo para probar en dev; no se ejecuta en build)
import { Api } from "../lib/api";

async function main() {
  const items = await Api.getItems();
  console.log("Items:", items.length);
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
