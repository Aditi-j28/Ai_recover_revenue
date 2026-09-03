import React, { useState } from "react";
import {
  X,
  TrendingUp,
  Mail,
  Phone,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  User,
  Building,
  ArrowRight,
  ShieldAlert,
  ClipboardList
} from "lucide-react";
import { formatCurrency, formatDate, getDaysOverdue } from "../utils/format";
import { getNextBestAction, generateMessage } from "../utils/aiEngine";

export default function CustomerProfileModal({ customer, customerInvoices, onClose, onNavigateToMessages }) {
  if (!customer) return null;

  const [activeTab, setActiveTab] = useState("overview");

  // Filter invoices for unpaid/overdue vs paid
  const activeInvoices = customerInvoices.filter(inv => inv.status !== "Paid");
  const paidInvoices = customerInvoices.filter(inv => inv.status === "Paid");

  // Select the most overdue invoice to evaluate the "Next Best Action" and "AI Prediction"
  const mostOverdueInvoice = [...activeInvoices].sort((a, b) => {
    return getDaysOverdue(b.dueDate) - getDaysOverdue(a.dueDate);
  })[0] || customerInvoices[0];

  const aiDetails = mostOverdueInvoice
    ? getNextBestAction(mostOverdueInvoice, customer)
    : {
        probability: 95,
        riskCategory: "Low",
        expectedRecovery: 0,
        action: "Monitor",
        why: "No active overdue balances found.",
        priorityScore: 10,
        breakdown: []
      };

  return (
    <div className="modal-overlay">
      <div className="glass-panel modal-content" style={{ animation: "fadeIn 0.25s ease-out" }}>
        
        {/* Modal Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "1px solid var(--border-color)", paddingBottom: "16px", marginBottom: "20px" }}>
          <div>
            <span style={{ fontSize: "0.75rem", color: "var(--accent-primary)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>
              Customer Intelligence Profile
            </span>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 700, margin: "4px 0 0 0", display: "flex", alignItems: "center", gap: "8px" }}>
              {customer.company}
            </h2>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", margin: "4px 0 0 0", display: "flex", alignItems: "center", gap: "6px" }}>
              <User size={14} /> Contact Representative: {customer.name} | Sector: {customer.sector}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid var(--border-color)",
              borderRadius: "50%",
              width: "36px",
              height: "36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "var(--text-primary)",
              transition: "var(--transition-smooth)"
            }}
            onMouseOver={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)"}
            onMouseOut={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)"}
          >
            <X size={18} />
          </button>
        </div>

        {/* Inner Navigation Tabs */}
        <div style={{ display: "flex", gap: "15px", marginBottom: "20px", borderBottom: "1px solid var(--border-color)", paddingBottom: "10px" }}>
          {["Overview & AI Predictions", "Payment Timeline", "Invoice History"].map((tabName, idx) => {
            const tabKey = ["overview", "timeline", "invoices"][idx];
            const isActive = activeTab === tabKey;
            return (
              <button
                key={tabKey}
                onClick={() => setActiveTab(tabKey)}
                style={{
                  background: "transparent",
                  border: "none",
                  borderBottom: isActive ? "2px solid var(--accent-primary)" : "2px solid transparent",
                  color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                  padding: "6px 12px 10px 12px",
                  fontSize: "0.875rem",
                  fontWeight: isActive ? 600 : 500,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "var(--transition-smooth)"
                }}
              >
                {tabName}
              </button>
            );
          })}
        </div>

        {/* Tab 1: Overview & AI Predictions */}
        {activeTab === "overview" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            
            {/* Quick Metrics */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "15px" }}>
              <div className="glass-panel" style={{ padding: "16px", background: "rgba(255, 255, 255, 0.02)" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Total Outstanding</span>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 700, margin: "6px 0 0 0" }}>{formatCurrency(customer.totalOutstanding)}</h3>
                <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", display: "block", marginTop: "4px" }}>
                  Across {activeInvoices.length} active invoices
                </span>
              </div>
              <div className="glass-panel" style={{ padding: "16px", background: "rgba(255, 255, 255, 0.02)" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>LTV (Lifetime Value)</span>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 700, margin: "6px 0 0 0" }}>{formatCurrency(customer.ltv)}</h3>
                <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", display: "block", marginTop: "4px" }}>
                  Long-term relationship
                </span>
              </div>
              <div className="glass-panel" style={{ padding: "16px", background: "rgba(255, 255, 255, 0.02)" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Average Days to Pay</span>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 700, margin: "6px 0 0 0" }}>{customer.avgDaysToPay} Days</h3>
                <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", display: "block", marginTop: "4px" }}>
                  Contract term: 30 Days
                </span>
              </div>
              <div className="glass-panel" style={{ padding: "16px", background: "rgba(255, 255, 255, 0.02)" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Payment Reliability</span>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "6px" }}>
                  <h3 style={{ fontSize: "1.25rem", fontWeight: 700, margin: 0, color: customer.reliabilityScore > 75 ? "var(--color-success)" : customer.reliabilityScore > 50 ? "orange" : "var(--color-danger)" }}>
                    {customer.reliabilityScore}/100
                  </h3>
                </div>
                <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", display: "block", marginTop: "4px" }}>
                  AI Credit Ranking
                </span>
              </div>
            </div>

            {/* Split layout for AI Explainer and Prediction detail */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              
              {/* AI Prediction summary */}
              <div className="glass-panel" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "15px", background: "linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(168, 85, 247, 0.05) 100%)" }}>
                <h3 style={{ fontSize: "1rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "8px", color: "var(--accent-primary)" }}>
                  <TrendingUp size={16} /> AI Predictive Diagnosis
                </h3>

                <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                  {/* Circular Progress (SVG) */}
                  <div style={{ position: "relative", width: "80px", height: "80px", flexShrink: 0 }}>
                    <svg width="80" height="80" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="rgba(255, 255, 255, 0.05)"
                        strokeWidth="3.5"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="var(--accent-primary)"
                        strokeDasharray={`${aiDetails.probability}, 100`}
                        strokeWidth="3.5"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", fontSize: "0.95rem", fontWeight: 700 }}>
                      {aiDetails.probability}%
                    </div>
                  </div>

                  <div>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Recovery Probability</span>
                    <h4 style={{ fontSize: "1.1rem", fontWeight: 700, margin: "2px 0" }}>
                      {aiDetails.probability >= 80 ? "Highly Probable" : aiDetails.probability >= 60 ? "Moderate Chance" : "Unlikely/At Risk"}
                    </h4>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      Expected recovery: <strong>{formatCurrency(aiDetails.expectedRecovery)}</strong>
                    </span>
                  </div>
                </div>

                <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "12px", marginTop: "5px" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>Recommended Action</span>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span
                      style={{
                        background: aiDetails.action === "Call Customer" ? "var(--color-warning-bg)" : aiDetails.action === "Escalate to Finance" ? "var(--color-danger-bg)" : "var(--accent-primary-glow)",
                        color: aiDetails.action === "Call Customer" ? "var(--color-warning)" : aiDetails.action === "Escalate to Finance" ? "var(--color-danger)" : "var(--accent-primary)",
                        padding: "4px 10px",
                        borderRadius: "8px",
                        fontSize: "0.85rem",
                        fontWeight: 700
                      }}
                    >
                      {aiDetails.action}
                    </span>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Confidence: {aiDetails.confidence}%</span>
                  </div>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "8px", fontStyle: "italic" }}>
                    "{aiDetails.why}"
                  </p>
                </div>

                {/* Instant Action buttons */}
                {mostOverdueInvoice && (
                  <div style={{ display: "flex", gap: "10px", marginTop: "5px" }}>
                    <button
                      className="btn-primary"
                      style={{ flex: 1, padding: "8px 12px", fontSize: "0.75rem", justifyContent: "center" }}
                      onClick={() => onNavigateToMessages(mostOverdueInvoice, customer, "Friendly reminder")}
                    >
                      <Mail size={14} /> Send Auto-Email
                    </button>
                    {aiDetails.action === "Call Customer" && (
                      <a
                        href={`tel:${customer.phone}`}
                        className="btn-secondary"
                        style={{ flex: 1, padding: "8px 12px", fontSize: "0.75rem", justifyContent: "center", textDecoration: "none" }}
                      >
                        <Phone size={14} /> Call representative
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* AI Explainability Card */}
              <div className="glass-panel" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h3 style={{ fontSize: "1rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "8px" }}>
                    <ShieldAlert size={16} /> Explainable AI Risk Score
                  </h3>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "2px" }}>
                    <span style={{ fontSize: "1.25rem", fontWeight: 800, color: aiDetails.riskCategory === "Critical" ? "var(--color-danger)" : aiDetails.riskCategory === "High" ? "var(--color-warning)" : "var(--color-success)" }}>
                      {aiDetails.priorityScore}
                    </span>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>/100</span>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "8px", overflowY: "auto", maxHeight: "160px" }}>
                  {aiDetails.breakdown && aiDetails.breakdown.length > 0 ? (
                    aiDetails.breakdown.map((item, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: "0.78rem",
                          padding: "6px 8px",
                          borderRadius: "6px",
                          background: item.type === "risk" ? "rgba(239, 68, 68, 0.04)" : "rgba(16, 185, 129, 0.04)",
                          borderLeft: `3px solid ${item.type === "risk" ? "var(--color-danger)" : "var(--color-success)"}`
                        }}
                      >
                        <span style={{ color: "var(--text-secondary)" }}>{item.factor}</span>
                        <span style={{ fontWeight: 600, color: item.type === "risk" ? "var(--color-danger)" : "var(--color-success)" }}>
                          {item.weight > 0 ? `+${item.weight}` : item.weight}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontStyle: "italic", textAlign: "center", padding: "10px" }}>
                      No active invoice delays. Risk score is flat baseline.
                    </div>
                  )}
                </div>

                <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "10px", display: "flex", alignItems: "center", gap: "8px", fontSize: "0.75rem" }}>
                  <span
                    className={
                      aiDetails.riskCategory === "Critical"
                        ? "badge badge-critical"
                        : aiDetails.riskCategory === "High"
                        ? "badge badge-high"
                        : aiDetails.riskCategory === "Medium"
                        ? "badge badge-medium"
                        : "badge badge-low"
                    }
                  >
                    {aiDetails.riskCategory} Risk Zone
                  </span>
                  <span style={{ color: "var(--text-muted)" }}>
                    Calculated in Edge Function via RecoverAI core model.
                  </span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: Payment Timeline */}
        {activeTab === "timeline" && (
          <div className="glass-panel" style={{ padding: "24px", minHeight: "260px" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
              <ClipboardList size={16} /> Customer Interaction Timeline Log
            </h3>
            
            {mostOverdueInvoice ? (
              <div style={{ position: "relative", paddingLeft: "30px", borderLeft: "2px dashed var(--border-color)", display: "flex", flexDirection: "column", gap: "24px" }}>
                
                {/* 1. Invoice Issued */}
                <div style={{ position: "relative" }}>
                  <div style={{ position: "absolute", left: "-41px", top: "0", background: "#6366f1", border: "4px solid var(--bg-app)", borderRadius: "50%", width: "20px", height: "20px", display: "flex", alignItems: "center", justifyItems: "center" }} />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <h4 style={{ fontSize: "0.875rem", fontWeight: 600 }}>Invoice Issued</h4>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{formatDate(mostOverdueInvoice.dateIssued)}</span>
                  </div>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "2px" }}>
                    Invoice {mostOverdueInvoice.id} generated for the sum of {formatCurrency(mostOverdueInvoice.amount)}. Sent to {customer.email}.
                  </p>
                </div>

                {/* 2. Due Date */}
                <div style={{ position: "relative" }}>
                  <div style={{ position: "absolute", left: "-41px", top: "0", background: "orange", border: "4px solid var(--bg-app)", borderRadius: "50%", width: "20px", height: "20px" }} />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <h4 style={{ fontSize: "0.875rem", fontWeight: 600 }}>Payment Due Date</h4>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{formatDate(mostOverdueInvoice.dueDate)}</span>
                  </div>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "2px" }}>
                    Net-30 credit limit deadline. Invoice went unpaid. Status flagged as <strong>Overdue</strong>.
                  </p>
                </div>

                {/* 3. Communication interactions log */}
                {mostOverdueInvoice.communications && mostOverdueInvoice.communications.map((comm, idx) => (
                  <div key={idx} style={{ position: "relative" }}>
                    <div style={{ position: "absolute", left: "-41px", top: "0", background: comm.type === "Email" ? "var(--accent-primary)" : "var(--color-warning)", border: "4px solid var(--bg-app)", borderRadius: "50%", width: "20px", height: "20px" }} />
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <h4 style={{ fontSize: "0.875rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px" }}>
                        {comm.type === "Email" ? <Mail size={12} /> : <Phone size={12} />} Outreach: {comm.message}
                      </h4>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{formatDate(comm.date)}</span>
                    </div>
                    <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "2px" }}>
                      Triggered by: <strong>{comm.sender}</strong>.
                    </p>
                  </div>
                ))}

                {/* 4. Current State */}
                <div style={{ position: "relative" }}>
                  <div style={{ position: "absolute", left: "-41px", top: "0", background: "var(--color-danger)", border: "4px solid var(--bg-app)", borderRadius: "50%", width: "20px", height: "20px" }} className="pulse-glow" />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <h4 style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--color-danger)" }}>Currently Overdue</h4>
                    <span style={{ fontSize: "0.75rem", color: "var(--color-danger)", fontWeight: 700 }}>
                      {getDaysOverdue(mostOverdueInvoice.dueDate)} Days Past Due
                    </span>
                  </div>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "2px" }}>
                    Risk tier assessed: <strong>{aiDetails.riskCategory}</strong>. AI priority rating is high; awaiting next outreach action: <strong>{aiDetails.action}</strong>.
                  </p>
                </div>

              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "180px", color: "var(--text-muted)" }}>
                <CheckCircle2 size={36} style={{ color: "var(--color-success)", marginBottom: "10px" }} />
                <span>Account holds no overdue invoices. Historical payment cycles were completed successfully.</span>
              </div>
            )}

          </div>
        )}

        {/* Tab 3: Invoice History */}
        {activeTab === "invoices" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 600 }}>Invoice Log</h3>

            <div className="custom-table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Invoice ID</th>
                    <th>Issue Date</th>
                    <th>Due Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Action/Channel</th>
                  </tr>
                </thead>
                <tbody>
                  {customerInvoices.map((inv) => {
                    const overdue = inv.status === "Overdue" ? getDaysOverdue(inv.dueDate) : 0;
                    return (
                      <tr key={inv.id}>
                        <td style={{ fontWeight: 600 }}>{inv.id}</td>
                        <td>{formatDate(inv.dateIssued)}</td>
                        <td>{formatDate(inv.dueDate)}</td>
                        <td style={{ fontWeight: 700 }}>{formatCurrency(inv.amount)}</td>
                        <td>
                          <span
                            className={
                              inv.status === "Paid"
                                ? "badge badge-low"
                                : inv.status === "Overdue"
                                ? "badge badge-critical"
                                : "badge badge-medium"
                            }
                          >
                            {inv.status === "Overdue" ? `${overdue}d Overdue` : inv.status}
                          </span>
                        </td>
                        <td>
                          {inv.status === "Paid" ? (
                            <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                              via {inv.recoveryChannel || "Portal"}
                            </span>
                          ) : (
                            <button
                              className="btn-secondary"
                              style={{ padding: "4px 8px", fontSize: "0.75rem" }}
                              onClick={() => onNavigateToMessages(inv, customer, "Friendly reminder")}
                            >
                              Outreach
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div style={{ display: "flex", gap: "20px", marginTop: "10px" }}>
              <div className="glass-panel" style={{ flex: 1, padding: "12px", textAlign: "center", background: "rgba(16, 185, 129, 0.02)" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Total Settled</span>
                <h4 style={{ fontSize: "1.1rem", fontWeight: 700, marginTop: "4px", color: "var(--color-success)" }}>
                  {formatCurrency(paidInvoices.reduce((sum, inv) => sum + inv.amount, 0))}
                </h4>
              </div>
              <div className="glass-panel" style={{ flex: 1, padding: "12px", textAlign: "center", background: "rgba(239, 68, 68, 0.02)" }}>
                <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Total Outstanding</span>
                <h4 style={{ fontSize: "1.1rem", fontWeight: 700, marginTop: "4px", color: "var(--color-danger)" }}>
                  {formatCurrency(activeInvoices.reduce((sum, inv) => sum + inv.amount, 0))}
                </h4>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
