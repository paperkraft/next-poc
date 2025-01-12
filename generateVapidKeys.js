import { generateVAPIDKeys } from "web-push";
import { writeFileSync } from "fs";

const vapidKeys = generateVAPIDKeys();

const envData = `
NEXT_PUBLIC_VAPID_PUBLIC_KEY=${vapidKeys.publicKey}
NEXT_PUBLIC_VAPID_PRIVATE_KEY=${vapidKeys.privateKey}
`;

writeFileSync(".env", envData, { flag: "w" });

console.log("#### VAPID keys generated and saved to .env file ### \n");
