import express from "express";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));

// ----------------------------
// In-memory storage (NO DB)
// ----------------------------
const submissions = []; // resets whenever server restarts
const payments = [];    // resets whenever server restarts

// Health
app.get("/health", (req, res) => {
  res.json({ ok: true, message: "Crystal Manor API running" });
});

// Submit form (Resident / Post-Op / Contact)
app.post("/api/forms/submit", (req, res) => {
  const { formType, data } = req.body;

  if (!formType || !data) {
    return res.status(400).json({ ok: false, error: "Missing formType or data" });
  }

  const record = {
    id: `sub_${Date.now()}`,
    formType,
    data,
    createdAt: new Date().toISOString(),
    status: "New"
  };

  submissions.push(record);

  // For demo: print to server console so staff can see it immediately
  console.log("✅ New submission received:", record);

  res.json({ ok: true, message: "Submitted successfully", id: record.id });
});

// View all submissions (Admin demo)
app.get("/api/admin/submissions", (req, res) => {
  res.json({ ok: true, count: submissions.length, submissions });
});

// Update submission status (Admin demo)
app.patch("/api/admin/submissions/:id", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const found = submissions.find((s) => s.id === id);
  if (!found) return res.status(404).json({ ok: false, error: "Not found" });

  found.status = status || found.status;
  res.json({ ok: true, submission: found });
});

// Deposit (fake payment flow, no gateway)
app.post("/api/payments/deposit", (req, res) => {
  const { name, amountUSD = 250 } = req.body;

  const payment = {
    id: `pay_${Date.now()}`,
    name: name || "Unknown payer",
    amountUSD: Number(amountUSD),
    createdAt: new Date().toISOString(),
    status: "PAID (demo)"
  };

  payments.push(payment);
  console.log("💳 Deposit payment (demo):", payment);

  res.json({ ok: true, message: "Deposit processed (demo)", payment });
});

// View all payments (Admin demo)
app.get("/api/admin/payments", (req, res) => {
  res.json({ ok: true, count: payments.length, payments });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
});
