import { spawn } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log("🚀 Запуск ngrok...");
console.log("📝 Переконайтеся, що frontend працює на порту 5173");
console.log("");

const ngrok = spawn("ngrok", ["http", "5173"], {
  stdio: "inherit",
  shell: true,
});

ngrok.on("error", (error) => {
  console.error("❌ Помилка запуску ngrok:", error.message);
  console.log("\n📋 Інструкції:");
  console.log("1. Встановіть ngrok: npm install -g ngrok");
  console.log("2. Налаштуйте токен: ngrok config add-authtoken YOUR_TOKEN");
  console.log("3. Запустіть знову: npm run ngrok");
  process.exit(1);
});

ngrok.on("exit", (code) => {
  console.log(`\n⚠️  ngrok завершив роботу з кодом ${code}`);
});

// Обробка сигналів для коректного завершення
process.on("SIGINT", () => {
  console.log("\n🛑 Зупинка ngrok...");
  ngrok.kill();
  process.exit(0);
});

process.on("SIGTERM", () => {
  ngrok.kill();
  process.exit(0);
});
