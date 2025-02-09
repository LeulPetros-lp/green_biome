/* eslint-disable react/self-closing-comp */
/* eslint-disable prettier/prettier */
import DefaultLayout from "@/layouts/default";
import DashboardLayout from "@/components/DashboardLayout"; // Import DashboardLayout
import { Input } from "@heroui/input";

const IndexPage = () => {
  return (
    <DefaultLayout>
      <DashboardLayout />
      {/* <div
        style={{
          width: '50%', // Full width of the parent container
          display: 'flex', // Enable flexbox
          justifyContent: 'center', // Center horizontally
          alignItems: 'center'
        }}
      >
        <Input placeholder="Biome ID" />
      </div> */}

    </DefaultLayout>
  );
};

export default IndexPage;
