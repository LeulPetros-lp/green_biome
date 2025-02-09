// eslint-disable-next-line prettier/prettier
// eslint-disable-next-line prettier/prettier
/* eslint-disable import/order */
/* eslint-disable prettier/prettier */
/* eslint-disable padding-line-between-statements */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
// pages/chatbot.tsx
import { useState, FormEvent, useEffect } from "react";
import axios from "axios";
import { Mistral } from '@mistralai/mistralai'; // Import Mistral client
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Spinner } from "@nextui-org/react"; // Import the Next UI Spinner
import DefaultLayout from "@/layouts/default";

interface WeatherData {
  current_condition: Array<{
    temp_C: string;
    weatherDesc: Array<{ value: string }>;
    humidity: string;
    windspeedKmph: string;
  }>;
  nearest_area: Array<{
    areaName: Array<{ value: string }>;
    country: Array<{ value: string }>;
  }>;
}

const client = new Mistral({ apiKey: "aKUHZ59wRPKJYLWDjxsFQuuv9p0wCyb1" });  // Set up the Mistral client

const ChatBot = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);  // Store weather data
  const [userInput, setUserInput] = useState(""); // Store user input for chatbot
  const [chatbotResponse, setChatbotResponse] = useState(""); // Store chatbot response
  const [conversationHistory, setConversationHistory] = useState<{ sender: string, message: string }[]>([]); // Store chat history
  const [loading, setLoading] = useState(false);  // Handle loading state (for spinner)

  // Fetch weather data on component mount
  useEffect(() => {
    const getWeatherData = async () => {
      try {
        const response = await axios.get<WeatherData>("https://wttr.in/Addis_Ababa?format=j1");
        setWeatherData(response.data);  // Update state with weather data
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };
    getWeatherData();  // Fetch the weather data
  }, []);  // Run once when component mounts

  // Handle changes in user input
  const handleUserInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(event.target.value);
  };

  // Process the bot's response
  const processBotResponse = (response: string) => {
    let processedResponse = response.replace(/\n/g, "<br />");
    processedResponse = processedResponse.replace(/(###)(.*?)(###)/g, '<h3>$2</h3>');
    return processedResponse;
  };

  // Handle form submission (chatbot request)
  const handleFormSubmit = async (event: FormEvent) => {
    event.preventDefault();  // Prevent default form submission

    setLoading(true);

    setConversationHistory(prev => [...prev, { sender: "user", message: userInput }]);

    try {
      const systemPrompt = `
      **Prompt for Green Biome AI**:
      I want you to be a gardener and a scientist that helps students with sustainability.

      Temperature: ${weatherData?.current_condition[0].temp_C}°C
      Weather Condition: ${weatherData?.current_condition[0].weatherDesc[0].value}
      Humidity: ${weatherData?.current_condition[0].humidity}%
      Wind Speed: ${weatherData?.current_condition[0].windspeedKmph} km/h
      Location: ${weatherData?.nearest_area[0].areaName[0].value}, ${weatherData?.nearest_area[0].country[0].value}

      **Your task:**
      Provide actionable advice for enhancing green spaces, planting recommendations, ecosystem management, and sustainability practices.
      `;

      const messageHistory = conversationHistory.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.message,
      }));

      const chatResponse = await client.chat.complete({
        model: "mistral-large-latest",
        messages: [
          { role: 'system', content: systemPrompt },
          ...messageHistory,
          { role: 'user', content: userInput }
        ],
      });

      const rawResponse = chatResponse.choices[0]?.message.content;
      const processedResponse = processBotResponse(rawResponse);

      setConversationHistory(prev => [...prev, { sender: "bot", message: processedResponse }]);
      setChatbotResponse(processedResponse);
      setUserInput("");  // Clear the input field
      setLoading(false);
    } catch (error) {
      console.error("Error fetching chatbot response:", error);
      setLoading(false);
    }
  };

  // Show an error message if there is no weather data
  if (!weatherData) {
    return (
      <DefaultLayout>
        <Spinner />
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      {/* Display the chat history */}
      <div style={{ maxHeight: "400px", overflowY: "scroll", padding: "10px", marginBottom: "20px" }}>
        {conversationHistory.map((msg, index) => (
          <div key={index} style={{ margin: "10px 0", textAlign: msg.sender === "user" ? "right" : "left" }}>
            <div style={{
              display: "inline-block",
              backgroundColor: msg.sender === "user" ? "#47A840" : "#E5E5E5",
              color: msg.sender === "user" ? 'white' : 'black',
              borderRadius: "8px",
              padding: "10px",
              maxWidth: "60%",
            }}>
              <strong>{msg.sender === "user" ? "You" : "Biome Assistant"}</strong>
              <p dangerouslySetInnerHTML={{ __html: msg.message }} />
            </div>
          </div>
        ))}
      </div>

      {/* Ask your gardening assistant form */}
      <form onSubmit={handleFormSubmit} style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
        <Input
          type="text"
          value={userInput}
          onChange={handleUserInputChange}
          width={300}
          placeholder="Ask about gardening, farming, or sustainability!"
          style={{ backgroundColor: "white", color: 'black' }}
        />
        <Button type="submit" style={{ color: 'white', backgroundColor: '#47A840' }}>
          Send
        </Button>
      </form>

      {/* Show the spinner below the input field while waiting for the bot's response */}
      {loading && (
        <div style={{ marginTop: "10px", textAlign: "center" }}>
          <Spinner size="lg" />
        </div>
      )}
    </DefaultLayout>
  );
};

export default ChatBot;
