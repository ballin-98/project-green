const LOKI_URL = process.env.LOKI_URL!;
const LOKI_USERNAME = process.env.LOKI_USERNAME!;
const LOKI_PASSWORD = process.env.LOKI_PASSWORD!;

function getAuthHeader() {
  return (
    "Basic " +
    Buffer.from(`${LOKI_USERNAME}:${LOKI_PASSWORD}`).toString("base64")
  );
}

export async function sendToLoki(
  message: string,
  labels: Record<string, string> = {},
) {
  console.log("truing to send to loki");
  try {
    console.log("LOKI_URL:", LOKI_URL);
    console.log("LOKI_USERNAME:", LOKI_USERNAME);
    console.log("LOKI_PASSWORD:", LOKI_PASSWORD ? "****" : "not set");
    console.log("header", getAuthHeader());
    const header = getAuthHeader();
    console.log("Auth header:", header);
    const res = await fetch(LOKI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: header,
      },
      body: JSON.stringify({
        streams: [
          {
            stream: {
              app: "nextjs-app",
              ...labels,
            },
            values: [
              [
                (Date.now() * 1_000_000).toString(), // nanoseconds
                message,
              ],
            ],
          },
        ],
      }),
    });
    console.log("finished sending to loki");
    return res;
  } catch (err) {
    console.error("Failed to send log to Loki", err);
    return null;
  }
}
