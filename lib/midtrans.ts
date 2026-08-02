const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY!;
const MIDTRANS_BASE_URL = process.env.MIDTRANS_IS_PRODUCTION === "true"
  ? "https://api.midtrans.com"
  : "https://api.sandbox.midtrans.com";

const auth = Buffer.from(`${MIDTRANS_SERVER_KEY}:`).toString("base64");

export async function midtransRequest(
  endpoint: string,
  options: RequestInit = {}
) {
  const response = await fetch(`${MIDTRANS_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${auth}`,
      ...(options.headers || {}),
    },
    cache: "no-store",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.status_message || "Midtrans Error");
  }

  return data;
}