/* eslint-disable react/self-closing-comp */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
// pages/index.tsx
// eslint-disable-next-line import/order
import DefaultLayout from "@/layouts/default";
// eslint-disable-next-line prettier/prettier
import { Line } from "react-chartjs-2";  // Import the Line chart component
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Legend } from "chart.js"; // Import necessary components from chart.js
import { Button } from "@heroui/button";

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Legend);  // Register chart components
import { useAuth } from "../config/context/AuthContext"
import Link from "next/link";

const IndexPage = () => {
  // Fake data for the line graph
  const lineData = {
    labels: ["8 AM", "10 AM", "12 PM", "2 PM", "4 PM"],
    datasets: [
      {
        label: "Temperature (°C)",
        data: [22, 24, 27, 25, 23],
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 2,
      },
      {
        label: "Humidity",
        data: [26, 30, 32, 25, 20],
        backgroundColor: "rgba(56, 67, 233, 0.5)",
        borderColor: "rgba(15, 30, 235, 0.5)",
        borderWidth: 2,
      },
      {
        label: "Light",
        data: [20, 20, 34, 30, 30],
        backgroundColor: "rgba(255, 166, 0, 0.5)",
        borderColor: "rgba(255, 166, 0, 0.5)",
        borderWidth: 2,
      }, 
    ],
  };

  const { user }: any  = useAuth()

  return (
    <DefaultLayout>
      <div style={{ padding: "0px" }}>
        {/* <h1>Welcome to Green Biomes!</h1>
        <p>Start your journey in sustainability by visiting our ChatBot page.</p>
        <p>Ask questions about gardening, farming, and more!</p> */}
        {/* <a href="/chatbot" style={{ color: "#47A840", fontWeight: "bold" }}>Go to ChatBot</a> */}

      
        {/* Line Graph Section */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-black text-lg font-bold mb-4" id="font">{user?.email},   BIOME_set_ID:  2jf3232d2w</h3>
          <Line data={lineData} options={{ responsive: true }} />

          
        
        </div>
        <br></br>
       <Link href="/chatbot"><Button fullWidth style={{ color: 'white', backgroundColor: '#47A840' }}>Talk to GreenBiome Assistant</Button></Link>
      </div>
    </DefaultLayout>
  );
};

export default IndexPage;
