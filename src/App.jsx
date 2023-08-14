import { useState } from 'react';
import './App.css';

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

function App() {
  const [tweet, setTweet] = useState("");
  const [sentiment, setSentiment] = useState(""); // "Negative" or "Positive"

  async function callOpenAIAPI() {
    console.log("Calling the OpenAI API");

    // For 0-10
    // What is the sentiment of this tweet with a value between 0 and 10 (10 being its very positive)? 

    const APIBody = {
      "model": "text-davinci-003",
      "prompt": "What is the sentiment of this tweet? " + tweet,
      "temperature": 0,
      "max_tokens": 60,
      "top_p": 1.0,
      "frequency_penalty": 0.0,
      "presence_penalty": 0.0
    }

    try {
      const response = await fetch("https://api.openai.com/v1/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + API_KEY
        },
        body: JSON.stringify(APIBody)
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(data);

      if (data && data.choices && data.choices.length > 0) {
        setSentiment(data.choices[0].text.trim());
      } else {
        console.error('Unexpected API response:', data);
      }
    } catch (error) {
      console.error("Error while fetching sentiment from OpenAI API:", error);
    }

  }

  console.log(tweet);
  return (
    <div className="App">
      <h1>OpenAI Tweet Sentiment</h1>
      <h3>The OpenAI API key was used along with its Tweet Classifier Example!</h3>
      <div>
        <textarea
          onChange={(e) => setTweet(e.target.value)}
          placeholder='Paste your tweet here!'
          cols={50}
          rows={10}
        />
      </div>
      <div>
        <button onClick={callOpenAIAPI}>Get The Tweet Sentiment From OpenAI API</button>
        {sentiment !== "" ?
          <h4><strong>This Tweet Is: {sentiment}</strong></h4>
          :
          null
        }
      </div>
    </div>
  )
}

export default App;
