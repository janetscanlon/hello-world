import express from 'express';
const app = express();

import { VertexAI } from '@google-cloud/vertexai';

import { GoogleAuth } from 'google-auth-library';
const auth = new GoogleAuth();

app.get('/', async (req, res) => {
    const project = await auth.getProjectId();

    const vertex = new VertexAI({ project: project });
    const generativeModel = vertex.getGenerativeModel({
        model: 'gemini-1.5-flash'
        //you can choose the model of open ai that you want to use here 
    });

    //access the parameter that was sent over, otherwise default to 'dog'
    const animal = req.query.animal || 'dog';

    //prompt engineering for the generative model
    //!prompt injection is a risk here, someone could throw code into the animal that 
    // will change the ai prompt 
    const prompt = `Give me 10 fun facts about ${animal}. Return this as html without backticks.`

    //now that we have the prompt and the generative model we can pass it the prompt 
    const resp = await generativeModel.generateContent(prompt);

    //response lives here in the hmtl but here we're just interested in the 'text'
    const html = resp.response.candidates[0].content.parts[0].text;
    res.send(html);
});

const port = parseInt(process.env.PORT) || 8080;
app.listen(port, () => {
    console.log(`helloworld: listening on port ${port}`);
});