
import { useNavigate } from "react-router-dom";

export const useAppNavigation = () => {
  const navigate = useNavigate();

  return {
    goToPos: () => navigate("/pos"),
    goToAddProduct: () => navigate("/products", { state: { openAddDialog: true } }),
    goToInventory: () => navigate("/products", { state: { activeTab: "inventory" } }),
    goToAllSales: () => navigate("/invoices"),
    goToSettings: (tab?: string) => navigate(`/settings${tab ? `?tab=${tab}` : ''}`),
    goToEmployees: () => navigate("/users", { state: { openAddDialog: true } }),
  };
};
