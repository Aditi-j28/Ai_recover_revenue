import React from "react";
import {
  LayoutDashboard,
  Radar,
  Users,
  FileText,
  Terminal,
  MessageSquareCode,
  Activity,
  BarChart3,
  Mail,
  Settings,
  Sun,
  Moon,
  TrendingUp
} from "lucide-react";

export default function Sidebar({ activeTab, setActiveTab, lightMode, setLightMode }) {
  const menuItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "radar", label: "AI Recovery Radar", icon: Radar },
    { id: "customers", label: "Customers", icon: Users },
    { id: "invoices", label: "Invoices", icon: FileText },
    { id: "command", label: "Command Center", icon: Terminal, badge: "New" },
    { id: "copilot", label: "AI Copilot", icon: MessageSquareCode },
    { id: "simulator", label: "Recovery Simulator", icon: Activity },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "messages", label: "Messages", icon: Mail },
    { id: "settings", label: "Settings", icon: Settings }
  ];

  return (
    <div
      className="glass-panel sidebar-container"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        flexShrink: 0
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "32px", overflowY: "auto" }}>
        {/* Brand Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "0 8px" }}>
          <div
            style={{
              background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)"
            }}
          >
            <TrendingUp size={20} color="white" />
          </div>
          <div>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: "1.3rem",
                letterSpacing: "-0.5px",
                margin: 0
              }}
            >
              Recover<span style={{ color: "var(--accent-primary)" }}>AI</span>
            </h1>
            <p style={{ fontSize: "0.65rem", color: "var(--text-muted)", letterSpacing: "1px", textTransform: "uppercase", fontWeight: 700, marginTop: "2px" }}>
              Revenue Intelligence
            </p>
          </div>
        </div>

        {/* Menu Items */}
        <nav style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: "10px",
                  border: "none",
                  background: isActive ? "rgba(99, 102, 241, 0.12)" : "transparent",
                  color: isActive ? "var(--accent-primary)" : "var(--text-secondary)",
                  fontFamily: "inherit",
                  fontSize: "0.875rem",
                  fontWeight: isActive ? 600 : 500,
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "var(--transition-smooth)"
                }}
                className={isActive ? "sidebar-item-active" : "sidebar-item"}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <Icon size={18} style={{ color: isActive ? "var(--accent-primary)" : "inherit" }} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    style={{
                      background: "var(--color-danger-bg)",
                      color: "var(--color-danger)",
                      fontSize: "0.65rem",
                      fontWeight: 700,
                      padding: "2px 6px",
                      borderRadius: "6px",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px"
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer (Dark Mode & User Profile) */}
      <div style={{ display: "flex", flexDirection: "column", gap: "20px", borderTop: "1px solid var(--border-color)", paddingTop: "20px" }}>
        {/* Theme Toggle Button */}
        <button
          onClick={() => setLightMode(!lightMode)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            width: "100%",
            padding: "10px 14px",
            borderRadius: "10px",
            border: "1px solid var(--border-color)",
            background: "rgba(255, 255, 255, 0.02)",
            color: "var(--text-secondary)",
            fontFamily: "inherit",
            fontSize: "0.85rem",
            fontWeight: 500,
            cursor: "pointer",
            transition: "var(--transition-smooth)"
          }}
        >
          {lightMode ? (
            <>
              <Moon size={16} />
              <span>Switch to Dark</span>
            </>
          ) : (
            <>
              <Sun size={16} />
              <span>Switch to Light</span>
            </>
          )}
        </button>

        {/* User Card */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "0 6px" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: 700,
              fontSize: "0.9rem"
            }}
          >
            AS
          </div>
          <div>
            <h4 style={{ fontSize: "0.85rem", fontWeight: 600, margin: 0 }}>Aditi Sharma</h4>
            <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", margin: 0 }}>Finance Ops Admin</p>
          </div>
        </div>
      </div>
    </div>
  );
}
