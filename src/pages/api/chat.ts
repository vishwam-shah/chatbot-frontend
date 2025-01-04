import { NextApiRequest, NextApiResponse } from 'next';

const BOT_API_URL = "http://localhost:5000/chat";

const sendMessageToPythonBot = async (message: string) => {
  try {
    const response = await fetch(BOT_API_URL, {
      method: 'POST',
      credentials: 'include', // Ensure Flask backend allows credentials
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({})); // Handle non-JSON responses
      throw new Error(errorData.error || "Bot API request failed");
    }

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    return res.status(204).end(); // 204 No Content is better for preflight
  }

  if (req.method === 'POST') {
    const { message } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: "Invalid message format" });
    }

    try {
      const response = await sendMessageToPythonBot(message);
      return res.status(200).json(response);
    } catch (error) {
      console.error("Handler Error:", error);
      return res.status(500).json({
        error: error instanceof Error ? error.message : "Internal Server Error"
      });
    }
  }

  return res.setHeader('Allow', 'POST').status(405).json({ error: "Method Not Allowed" });
}
