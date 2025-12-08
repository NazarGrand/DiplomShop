// Script to get ngrok URL
import https from "https";
import http from "http";

const getNgrokUrl = () => {
  return new Promise((resolve, reject) => {
    const req = http.get("http://localhost:4040/api/tunnels", (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        try {
          const json = JSON.parse(data);
          if (json.tunnels && json.tunnels.length > 0) {
            const publicUrl = json.tunnels[0].public_url;
            resolve(publicUrl);
          } else {
            reject("No tunnels found");
          }
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on("error", (error) => {
      reject(error);
    });

    req.setTimeout(5000, () => {
      req.destroy();
      reject("Timeout");
    });
  });
};

getNgrokUrl()
  .then((url) => {
    console.log("\n✅ Your ngrok URL:", url);
    console.log("\n📋 Copy this URL and add it to backend/.env as:");
    console.log(`FRONTEND_URL=${url}\n`);
    process.exit(0);
  })
  .catch((error) => {
    console.log("\n⚠️  Could not get ngrok URL. Error:", error.message);
    console.log("\nPossible reasons:");
    console.log("1. ngrok is not running");
    console.log("2. ngrok needs authentication token");
    console.log("\nTo setup ngrok:");
    console.log(
      "1. Go to: https://dashboard.ngrok.com/get-started/your-authtoken"
    );
    console.log("2. Copy your token");
    console.log("3. Run: ngrok config add-authtoken YOUR_TOKEN");
    console.log("4. Then run: ngrok http 5173");
    process.exit(1);
  });
