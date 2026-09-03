function Dashboard({ data }) {
  if (!data) {
    return null;
  }

  const actions = data.action_breakdown || {};

  const recovery = Number(
    data.total_potential_recovery_inr || 0
  );
   console.log("REAL CREWAI DASHBOARD DATA:", data);
  return (
    
    <div style={{ marginTop: "30px" }}>

      {/* Summary */}
      <div>
        <h2>{data.summary_headline}</h2>

        <p>
          AI-powered revenue recovery analysis
        </p>
      </div>

      {/* KPI Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "16px",
          marginTop: "20px",
        }}
      >

        <div>
          <h4>Potential Recovery</h4>
          <h2>
            ₹{recovery.toLocaleString("en-IN")}
          </h2>
        </div>

        <div>
          <h4>Emails</h4>
          <h2>
            {actions.emails_count || 0}
          </h2>
        </div>

        <div>
          <h4>Calls</h4>
          <h2>
            {actions.calls_count || 0}
          </h2>
        </div>

        <div>
          <h4>Escalations</h4>
          <h2>
            {actions.escalations_count || 0}
          </h2>
        </div>

      </div>

      {/* Recommended Actions */}
      <div style={{ marginTop: "30px" }}>
        <h3>Recommended Actions</h3>

        <p>
          📧 Personalized Emails:{" "}
          {actions.emails_count || 0}
        </p>

        <p>
          📞 Phone Calls:{" "}
          {actions.calls_count || 0}
        </p>

        <p>
          💳 Payment Plans:{" "}
          {actions.payment_plans_count || 0}
        </p>

        <p>
          🚨 Escalations:{" "}
          {actions.escalations_count || 0}
        </p>

        <p>
          👀 Monitoring:{" "}
          {actions.monitors_count || 0}
        </p>
      </div>

      {/* AI Insights */}
      <div style={{ marginTop: "30px" }}>
        <h3>AI Insights</h3>

        <ul>
          {data.bullet_points?.map((point, index) => (
            <li key={index}>
              {point}
            </li>
          ))}
        </ul>
      </div>

      {/* Confidence */}
      <div style={{ marginTop: "30px" }}>
        <h3>AI Confidence</h3>

        <p>
          {data.confidence_statement}
        </p>
      </div>

      {/* Recovery Plan */}
      <div style={{ marginTop: "30px" }}>
        <h3>Recovery Plan</h3>

        <p style={{ whiteSpace: "pre-line" }}>
          {data.full_narrative}
        </p>
      </div>

    </div>
  );
}

export default Dashboard;