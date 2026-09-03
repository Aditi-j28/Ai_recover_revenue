export function parseCrewAIResponse(response) {
  if (!response) {
    throw new Error("CrewAI response is empty");
  }

  const state = String(response.state || "").toUpperCase();

  if (
    state !== "SUCCESS" &&
    state !== "COMPLETED"
  ) {
    throw new Error(
      response.status ||
      response.state ||
      "CrewAI execution failed"
    );
  }

  const result = response.result;

  if (!result) {
    throw new Error("CrewAI result is missing");
  }

  const tasks = result.tasks_output || [];

  console.log("CREWAI TASK OUTPUT:", tasks);

  const parsedTasks = tasks.map((task) => {
    let raw = task.raw;

    if (typeof raw === "string") {
      try {
        const cleaned = raw
          .replace(/^```json\s*/i, "")
          .replace(/^```\s*/i, "")
          .replace(/\s*```$/i, "")
          .trim();

        raw = JSON.parse(cleaned);
      } catch {
        // raw JSON nahi hai
      }
    }

    return {
      name: task.name,
      description: task.description,
      raw,
      summary: task.summary,
    };
  });

  /*
   * Search all task outputs for the actual
   * CrewAI dashboard/customer/invoice data.
   */
  let dashboard = null;
  let customers = [];
  let invoices = [];

  for (const task of parsedTasks) {
    const raw = task.raw;

    if (!raw || typeof raw !== "object") {
      continue;
    }

    // Dashboard
    if (
      raw.summary_headline ||
      raw.total_potential_recovery_inr ||
      raw.action_breakdown
    ) {
      dashboard = {
        ...dashboard,
        ...raw,
      };
    }

    // Customers
    if (Array.isArray(raw.customers)) {
      customers = [...customers, ...raw.customers];
    }

    // Invoices
    if (Array.isArray(raw.invoices)) {
      invoices = [...invoices, ...raw.invoices];
    }

    // Alternative naming
    if (Array.isArray(raw.customer_data)) {
      customers = [...customers, ...raw.customer_data];
    }

    if (Array.isArray(raw.invoice_data)) {
      invoices = [...invoices, ...raw.invoice_data];
    }
  }

  /*
   * Remove duplicate records.
   */
  customers = Array.from(
    new Map(
      customers.map((customer, index) => [
        customer.id || customer.customer_id || index,
        customer,
      ])
    ).values()
  );

  invoices = Array.from(
    new Map(
      invoices.map((invoice, index) => [
        invoice.id || invoice.invoice_id || index,
        invoice,
      ])
    ).values()
  );

  return {
    state: response.state,

    dashboard,

    customers,

    invoices,

    tasks: parsedTasks,

    rawResponse: response,
  };
}