import prismadb from "@/lib/prismadb";
import React from "react";

interface DashboardPageProps {
  params: { storeId: string };
}
const DashboardPage: React.FC<DashboardPageProps> = async ({ params }) => {
  const paramsData = await params;
  const store = await prismadb.store.findFirst({
    where: {
      id: paramsData.storeId,
    },
  });
  return <div>Active Store: {store?.id}</div>;
};

export default DashboardPage;
