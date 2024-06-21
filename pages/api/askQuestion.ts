import query from "@/lib/queryApi";
import type { NextApiRequest, NextApiResponse } from "next";
import admin from "firebase-admin";
import { adminDb } from "@/firebaseAdmin";

type Data = {
    answer: string;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    try {
        const { prompt, chatId, model, session } = req.body;

        if (!prompt) {
            return res.status(400).json({ answer: 'Please provide a prompt!' });
        }

        if (!chatId) {
            return res.status(400).json({ answer: 'Please provide a valid chat ID!' });
        }

        // ChatGPT Query
        const response = await query(prompt, chatId, model);

        const message: Message = {
            text: response || "Sorry bud, I got nothing",
            createdAt: admin.firestore.Timestamp.now(),
            user: {
                _id: 'ChatGPT',
                name: 'ChatGPT',
                avatar: 'https://links.papareact.com/89m',
            },
        };

        await adminDb
            .collection('users')
            .doc(session?.user?.email)
            .collection('chats')
            .doc(chatId)
            .collection('messages')
            .add(message);

        res.status(200).json({ answer: message.text });
    } catch (error: unknown) {
        console.error(`Error in API route:`, error);
        
        let errorMessage = 'An unknown error occurred';
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        
        res.status(500).json({ answer: `An error occurred: ${errorMessage}` });
    }
}