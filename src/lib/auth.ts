import admin from "firebase-admin";
import { initializeApp } from "firebase-admin";
import { readFileSync } from "fs";

// if (!admin.apps.length) {
//   admin.initializeApp({
//     credential: admin.credential.cert({
//       projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID as string,
//       clientEmail: process.env.FIREBASE_CLIENT_EMAIL as string,
//       privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
//     }),
//   });
// }

// const key =
//   "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDytyuDFwr7OT2K\n9/yAkSxB3XVf6zZT0eLmxP3r/rUelJPsrzBSpC0IfJR/JeiteyT4wnOLpUstF7TG\njEVddSl4GdA5IXRzsUl6uJwJ5rqZcEmizSXvhuv4Q0njK30rDcYNwff6i5S71saO\n2dbvuQgFY0vrnzICy00/KE6KTnvCvXA9FEhe20jr9yw2KDb3XrXuPUcOQU9gCMOt\nFYmAzt07cPbvwDxZdby6IjZQ2hRpPgA3Qtwl/9A7ral888QtnRsnCW4WRmlDULfD\n6hPNB5dDceHFg2sqiO18Q8bJakKMER1/CfDbB7Ijfgarql0sW5oH86GrgjfR0AmS\nuvaZJyi1AgMBAAECggEAEJSIhXy5kbums4YpFVZKxe1n2HzT+f9ckZjzjfTDxiTu\nWEzdD0mAUF6u8o2c0AcEGaCHmJ/wG1KN1UIH9gWsJsm/9+XME6AmLcWL1pWl+cKE\n1o55kNvbEEX2d5faWyp7ylJNteuQO5Gv1YUrjIuLsPndbz6G1yUwr8e5hR4DOyRS\n2RB1UJcnehLZ6pZ85OyF/WyvQeLNtvFvwNtxBK+HwhJ1eglPPZjFUq6DjpvRXkBX\nhGqlCt3YJsyhasl1ddVP7QaLMUn8tO2a5SEqw/vGbkTVW01/d8tt/z8AyCaVFR8l\n85FKm2onpgfboWo7086CLawFUKeFVA82SnDGoa4nYQKBgQD/0ZGaGItD83xytaty\n2RYZeq0UYVl8hm0AC8Lio2Fzjyv6yKdNAf31ZjXXEIdHz6u+AO375GSnpDqtJ72y\nBzY6s+FaWey0B6DzHzIvN2PKhtmpap4zakC5XnZwCqDTpjW4+EypO1PJrchonkbk\nKqLObmrBJcOOOjQsOh+BSCZEVQKBgQDy4zkVqrZGw8lJ7bhsJgR5U1EbJUopaOhw\nZiIFTIK2LA8u6We+qUCJIW5lQgbpA/dD45u0ChuR2KdzyByWO9bR5/7vsloxuUKM\n+jijz/L2wiK927OtgEqd/R9Z0JVCmT0brtMTRXHZdTpQVLFpmAQAE/NNrFtfDi25\n2KdKdfqy4QKBgQDa0W3T+46UTx9yF0dR87LdlHub5TFgPLPbyDOpHMtsx1h9KUlB\nq6SJViZTkcXFfTOQUMdAITqf0vCF0GqIb3bJe7gVSroXvDbF/zc0ABMR14szSQmN\nPSOj69MvP0gWAiQN1gXs89xVtJqqMki9PmMIZJZYJG9DpzGdaxIryYVCCQKBgGdn\nfz0PMYzM+5wivZolUVBJvUTeSkV46UQ45xD0cs2V0lz5d3Z/Xf9DoVkwk/qN+q4H\nb5llmDkuUJQFRM5c6Wbx6uInPyjeI0wblxN+i4SsP9gueb9K1/mM8tTs7S6uSIrJ\nkgkpTn/y3YGnnOREmKdj1vhhgYDla2gsqYQU2EdhAoGANdyWJMKoIA/PVIVx78Ow\ngJirJb5sdM9z7dZCSBNie/MseH3AsUYfsEO8g5x1NNeZl+who/RJv7oih0DJP1P1\nh+gUek1b4JFshR2do/j1TyPAiRpcgwWxkkXT7HSNnoi2a40g3oiMmU0F09VCyTK4\n2KhOO8LOOLW298uQFvODTTs=\n-----END PRIVATE KEY-----\n";
// const email = "firebase-adminsdk-q2384@test-29402.iam.gserviceaccount.com";

// if (!admin.apps.length) {
//   admin.initializeApp({
//     credential: admin.credential.cert({
//       projectId: "test-29402",
//       clientEmail: email as string,
//       privateKey: key!.replace(/\\n/g, "\n"),
//     }),
//   });
// }

("../config/serviceAccountKey.json");
const serviceAccountPath = "./src/config/serviceAccountKey.json";

const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, "utf8"));
// const base64EncodedKey = process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64;
// const serviceAccount = JSON.parse(
//   Buffer.from(base64EncodedKey as string, "base64").toString("utf8"),
// );
console.log(serviceAccount);
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} else {
}

const adminauth = admin.auth();
const db = admin.firestore();
export { adminauth, db };
