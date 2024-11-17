const express = require("express")
const dotenv = require("dotenv")
const cors = require('cors')

const { ChatWatsonx } = require("@langchain/community/chat_models/ibm")

const app = express()

dotenv.config()

const LLMParameters = {
    maxTokens: 10000,
    temperature: 0.5,
};
  
const chatInstance = new ChatWatsonx({
    version: "2024-05-31",
    serviceUrl: "https://eu-de.ml.cloud.ibm.com",
    projectId: "d7ed4cdd-7e4f-4f6c-9527-9dd371b48e19",
    model: "mistralai/mistral-large",
    ...LLMParameters,
});

app.use(express.json())
app.use(cors())

const messages = [
    {
        role: 'system',
        content: `
          Your Name is Epic Travels AI. Your are a travel planning assistant.
          
          Rules:
          1. send your answers in this key:-value format, like this:
            type:-content
            'type' => could be text/calendar/select/display_data/action,
            'content' => could be string/array/object
            Don't include type and content in your response they are used as variables to explain the concept. only answer the most recent question.Don't use any escape sequences and other punctuation just provide the answer.
          2. When you are greeted or asked what you do answer exactly don't change this response "text:-Hi, I am Epic Travels AI your travel planning assistant i can help you with packing, planning epic adventures and handling the boring stuff." 
          3. When the user asks for a travel plan first ind out where they live only respond with "select:-all_countries", and use where they live as the starting location. 
          4. When the user has selected their country, ask the day they plan to arrive at the destination the day they plan to leave. 
             use format calendar:-arrival_exit_date
             the user will respond with text:-arrivalDate-exitDate
          5. Where they want to visit from your conversation which is not the country name they gave above for example they may ask "plan my visit to x" or "i want to visit x" where x is the place they want to visit and send "action:-where they want to visit"
          6. When the user finally sends JSON string that contains all the locations they plan to visit in format "final:-JSON", you respond by generating a visit schedule and respond to user with "text:-your generated schedule". your response should be detailed atleast 500 charchters. dont use any escape sequences and colons in your answer.
          7. After that answer any question that the user may have on your schedule.
          `
    }
];


app.post('/test', async (req, res) => {
    try {
        messages.push(
            {
                id: crypto.randomUUID(),
                role: 'user', 
                content: `${req.body.prompt}`
            }
        )
        const chatResponse =  await chatInstance.invoke(messages)
        messages.push({
            id: crypto.randomUUID(),
            role: 'assistant', 
            content: chatResponse.toJSON().kwargs.content
        })
        const newMessages = messages.slice(1)

        console.log("chatResponse", newMessages)
        res.json({res: newMessages});
    } catch (err) {
        console.warn(err);
        res.json({res: 'error'})
    }
})

app.listen(3000, () => {
    console.log("Started listening on port 3000")
})