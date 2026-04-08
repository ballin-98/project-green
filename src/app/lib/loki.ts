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
  try {
    const header = getAuthHeader();
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
    return res;
  } catch (err) {
    console.error("Failed to send log to Loki", err);
    return null;
  }
}
