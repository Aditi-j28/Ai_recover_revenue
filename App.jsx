import { useState, useEffect } from "react";
import {
  startRecovery,
  getRecoveryStatus,
} from "./api/recoverApi";
import { parseCrewAIResponse } from "./api/responseParser";
import Sidebar from "./componentsphle/Sidebar";
import CustomerProfileModal from "./componentsphle/CustomerProfileModal";

// Pages
import Dashboard from "./pages/Dashboard";
import RecoveryRadar from "./pages/RecoveryRadar";
import Customers from "./pages/Customers";
import Invoices from "./pages/Invoices";
import CommandCenter from "./pages/CommandCenter";
import CopilotChat from "./pages/CopilotChat";
import Simulator from "./pages/Simulator";
import Analytics from "./pages/Analytics";
import Messages from "./pages/Messages";
import SettingsPage from "./pages/Settings";
import { Play } from "lucide-react";
import { mockCustomers, mockInvoices } from "./data/mockData";

function App() {
  const [status, setStatus] = useState("");
  const [result, setResult] = useState(null);
  
  const [customers, setCustomers] = useState(mockCustomers);
  const [invoices, setInvoices] = useState(mockInvoices);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [lightMode, setLightMode] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('light-mode', lightMode);
  }, [lightMode]);

  const runRecovery = async () => {
    try {
      setIsFetching(true);
      setStatus("Starting Recover AI...");
      setResult(null);

      // 1. Start AI workflow
      const kickoff = await startRecovery();
      console.log("Kickoff response:", kickoff);

      const kickoffId = kickoff.kickoff_id;
      if (!kickoffId) throw new Error("kickoff_id was not returned");

      setStatus("AI is analyzing...");

      // 2. Check status
      let finalResponse = null;
      for (let i = 0; i < 120; i++) {
        const response = await getRecoveryStatus(kickoffId);
        console.log("Status response:", response);

        const state = String(response.state || "").toUpperCase();
        const stat = String(response.status || "").toUpperCase();

        if (state === "COMPLETED" || state === "SUCCESS" || stat === "COMPLETED" || stat === "SUCCESS") {
          finalResponse = response;
          break;
        }

        if (state === "FAILED" || state === "FAILURE" || state === "ERRORED" || stat === "FAILED" || stat === "FAILURE" || stat === "ERRORED") {
          throw new Error(response.status || "Recover AI execution failed");
        }

        setStatus(`AI is analyzing... (${i + 1}/120)`);
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }

      if (!finalResponse) {
        throw new Error("AI workflow is still running. Please check the backend execution.");
      }

      const parsedCrewAI = parseCrewAIResponse(finalResponse);
      console.log("FINAL CREWAI DATA:", parsedCrewAI);

      if (parsedCrewAI.customers) setCustomers(parsedCrewAI.customers);
      if (parsedCrewAI.invoices) setInvoices(parsedCrewAI.invoices);
      
      setResult(parsedCrewAI);
      setStatus("Recovery analysis completed ✅");

    } catch (error) {
      console.error(error);
      setStatus(`Error: ${error.message}`);
    } finally {
      setIsFetching(false);
      setTimeout(() => setStatus(""), 5000);
    }
  };

  return (
    <div
      className="app-container"
      style={{
        background: lightMode ? "#f8fafc" : "var(--bg-dark)",
        color: lightMode ? "#1e293b" : "var(--text-primary)",
      }}
    >
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lightMode={lightMode}
        setLightMode={setLightMode}
      />

      <main className="main-content">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div>
            {status && (
              <div style={{ color: "var(--accent-primary)", fontWeight: "bold", fontSize: "14px" }}>
                {status}
              </div>
            )}
          </div>
          <button 
            className="btn-primary" 
            onClick={runRecovery}
            disabled={isFetching}
            style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 20px" }}
          >
            <Play size={16} fill="white" />
            {isFetching ? "Analyzing..." : "Fetch AI Data"}
          </button>
        </div>

        {selectedCustomer && (
          <CustomerProfileModal
            customer={selectedCustomer}
            customerInvoices={invoices.filter(
              (invoice) =>
                invoice.customer_id === selectedCustomer.id ||
                invoice.customerId === selectedCustomer.id ||
                invoice.customer === selectedCustomer.company
            )}
            onClose={() => setSelectedCustomer(null)}
            onNavigateToMessages={() => {
              setActiveTab("messages");
              setSelectedCustomer(null);
            }}
          />
        )}

        {/* Dynamic Pages */}
        <div style={{ flex: 1 }}>
          {activeTab === "overview" && <Dashboard invoices={invoices} customers={customers} onSelectCustomer={setSelectedCustomer} setActiveTab={setActiveTab} />}
          {activeTab === "radar" && <RecoveryRadar invoices={invoices} customers={customers} onSelectCustomer={setSelectedCustomer} onNavigateToMessages={() => setActiveTab("messages")} />}
          {activeTab === "customers" && <Customers customers={customers} invoices={invoices} onSelectCustomer={setSelectedCustomer} />}
          {activeTab === "invoices" && <Invoices invoices={invoices} customers={customers} onSelectCustomer={setSelectedCustomer} />}
          {activeTab === "command" && <CommandCenter invoices={invoices} setInvoices={setInvoices} customers={customers} />}
          {activeTab === "copilot" && <CopilotChat invoices={invoices} customers={customers} />}
          {activeTab === "simulator" && <Simulator invoices={invoices} customers={customers} />}
          {activeTab === "analytics" && <Analytics invoices={invoices} customers={customers} />}
          {activeTab === "messages" && <Messages invoices={invoices} customers={customers} preselectedInvoice={null} preselectedCustomer={null} setInvoices={setInvoices} />}
          {activeTab === "settings" && <SettingsPage />}
        </div>
      </main>
    </div>
  );
}

export default App;