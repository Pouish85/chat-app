import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import { openai } from "../index.js";

dotenv.config();
const router = express.Router();

router.post('/text', async (req, res) => {
    try {
        const { text, activeChatId } = req.body;

        /* GPT 3 */
        // const response = await openai.createCompletion({
        //     model: "text-davinci-003",
        //     prompt: text,
        //     temperature: 0.5,
        //     max_tokens: 2048,
        //     top_p: 1,
        //     frequency_penalty: 0.5,
        //     presence_penalty: 0,
        // });

        /* GPT 3.5 */
        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [
                {role: "system", content: "Tu es un assistant serviable."},
                {role: "user", content: text}
            ],
        });

        await axios.post(
            `https://api.chatengine.io/chats/${activeChatId}/messages/`,
            // { text: response.data.choices[0].text }, // GPT 3
            { text: response.data.choices[0].message.content }, // GPT 3.5
            {
                headers: {
                    "Project-ID": process.env.PROJECT_ID,
                    "User-Name": process.env.BOT_USER_NAME,
                    "User-Secret": process.env.BOT_USER_SECRET,
                }
            }
        )

        // res.status(200).json({ text: response.data.choices[0].text }) //GPT 3
        res.status(200).json({ text: response.data.choices[0].message.content }) //GPT 3.5
    } catch (error) {
    console.log("error:", error.response.data.error)
    res.status(500).json({ error: error.message })
    }
});

router.post('/code', async (req, res) => {
    try {
        const { text, activeChatId } = req.body;

        /* GPT 3 */
        // const response = await openai.createCompletion({
        //     model: "code-davinci-002",
        //     prompt: text,
        //     temperature: 0.5,
        //     max_tokens: 2048,
        //     top_p: 1,
        //     frequency_penalty: 0.5,
        //     presence_penalty: 0,
        // });

        /* GPT 3.5 */
        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [
              {role: "system", content: "You are an assistant coder who responds with only code and no explanations."},
              {role: "user", content: text },
            ],
          });

        await axios.post(
            `https://api.chatengine.io/chats/${activeChatId}/messages/`,
            // { text: response.data.choices[0].text }, //GPT 3
            { text: response.data.choices[0].message.content }, //GPT 3.5

            {
                headers: {
                    "Project-ID": process.env.PROJECT_ID,
                    "User-Name": process.env.BOT_USER_NAME,
                    "User-Secret": process.env.BOT_USER_SECRET,
                }
            }
        );

        // res.status(200).json({ text: response.data.choices[0].text }) //GPT 3
        res.status(200).json({ text: response.data.choices[0].message.content }) //GPT 3.5
    } catch (error) {
        console.log("error:", error.response.data.error);
        res.status(500).json({ error: error.message });
    }
})

router.post('/assist', async (req, res) => {
    try {
        const { text } = req.body;

        /* GPT 3 */
        // const response = await openai.createCompletion({
        //     model: "text-davinci-003",
        //     prompt: `Termine ma pensée: ${text}`,
        //     temperature: 0.5,
        //     max_tokens: 1024,
        //     top_p: 1,
        //     frequency_penalty: 0.5,
        //     presence_penalty: 0,
        // });

        /* GPT 3.5 */
        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [
                {role: "system", content: "Tu es un assistant serviable qui a pour but de finir les pensées ou les phrases de l'utilisateur."},
                {role: "user", content: `Termine ma pensée: ${text}`}
            ]
        });

        // res.status(200).json({ text: response.data.choices[0].text }) // GPT 3
        res.status(200).json({ text: response.data.choices[0].message.content }) // GPT 3.5
    } catch (error) {
        console.log("error:", error)
        res.status(500).json({ error: error.message })
    }
});

export default router;