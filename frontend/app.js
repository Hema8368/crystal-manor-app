const API = "http://localhost:5000";

document.getElementById("year").textContent = new Date().getFullYear();

const routes = {
  "/": home,
  "/services": services,
  "/tiers": tiers,
  "/admissions": admissions,
  "/contact": contact,
  "/admin-demo": adminDemo
};

window.addEventListener("hashchange", render);
window.addEventListener("load", render);

document.getElementById("payDepositBtn").addEventListener("click", async () => {
  const name = prompt("Name for receipt (demo):") || "Unknown payer";
  const amountUSD = prompt("Deposit amount in USD (demo):", "250") || "250";

  try {
    const res = await fetch(`${API}/api/payments/deposit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, amountUSD })
    });
    const out = await res.json();
    if (!out.ok) throw new Error(out.error || "Payment failed");

    alert(`✅ Deposit processed (demo). Payment ID: ${out.payment.id}`);
  } catch (e) {
    alert(e.message);
  }
});

function path() {
  return location.hash.replace("#", "") || "/";
}

function render() {
  const p = path();
  const view = routes[p] || notFound;
  document.getElementById("app").innerHTML = view();
  wireForms();
  wireAdminDemo();
}

function home() {
  return `
    <div class="grid">
      <section class="card col-8">
        <span class="badge">Licensed Assisted Living • Baltimore County</span>
        <h2>Comfortable, medically supported care — with a home-like feel.</h2>
        <p class="notice">
          We are a licensed assisted living facility owned and operated by a licensed medical provider.
          Serving residents in Baltimore County for over 25 years.
        </p>

        <hr />

        <h3>Why Choose Us?</h3>
        <ul>
          <li>Low hospital readmission rate</li>
          <li>Low staff turnover</li>
          <li>Medical oversight on-site</li>
          <li>Excellent state compliance surveys</li>
        </ul>

        <hr />
        <h3>Quick Start</h3>
        <p>
          <a class="btn secondary" href="#/admissions">Start Admissions</a>
          <a class="btn secondary" href="#/contact" style="margin-left:10px;">Contact Us</a>
        </p>

        <p class="notice">
          Admin demo (no database): <a href="#/admin-demo">View submissions</a>
        </p>
      </section>

      <aside class="card col-4">
        <h3>Facility Info</h3>
        <p><b>Crystal Manor Assisted Living, Inc.</b></p>
        <p class="notice">
          5610 Gwynndale Avenue<br/>
          Baltimore, MD 21207<br/>
          <b>Phone:</b> 443-429-0438
        </p>
        <hr />
        <h3>Expertise</h3>
        <ul>
          <li>Adult / Geriatric Care</li>
          <li>Post-operative care</li>
        </ul>
      </aside>
    </div>
  `;
}

function services() {
  return `
    <div class="card">
      <h2>Services</h2>
      <p class="notice">24-hour care tailored to each resident’s needs.</p>

      <div class="grid">
        <div class="card col-6">
          <h3>Daily Living Support</h3>
          <ul>
            <li>Assistance with ADLs (bathing, dressing, toileting)</li>
            <li>Medication management</li>
            <li>Laundry services</li>
            <li>Escort to appointments</li>
          </ul>
        </div>

        <div class="card col-6">
          <h3>Nutrition & Coordination</h3>
          <ul>
            <li>Meal preparation approved by a licensed dietitian</li>
            <li>Three nutritious meals & snacks</li>
            <li>Coordination of care and referrals</li>
            <li>Post-operative care support</li>
          </ul>
        </div>
      </div>
    </div>
  `;
}

function tiers() {
  return `
    <div class="card">
      <h2>Distinguished Adult Care Offerings</h2>
      <p class="notice">We offer flexible care tiers based on resident needs.</p>

      <div class="grid">
        <div class="card col-4">
          <h3>Tier I</h3>
          <ul>
            <li>Basic assisted living support</li>
            <li>Meals & housekeeping</li>
            <li>ADL assistance</li>
          </ul>
        </div>

        <div class="card col-4">
          <h3>Tier II</h3>
          <ul>
            <li>Enhanced oversight</li>
            <li>Medication management</li>
            <li>Care coordination</li>
          </ul>
        </div>

        <div class="card col-4">
          <h3>Tier III</h3>
          <ul>
            <li>Post-op recovery support</li>
            <li>Higher-acuity assistance</li>
            <li>Clinical monitoring (demo wording)</li>
          </ul>
        </div>
      </div>
    </div>
  `;
}

function admissions() {
  return `
    <div class="card">
      <h2>Admissions</h2>
      <p class="notice">
        Complete the appropriate pre-admission form below. Our team will follow up shortly.
      </p>

      <hr />
      <h3>Resident Pre-Admission Form</h3>
      ${formTemplate("Resident Pre-Admission", [
        ["Resident Full Name", "text", "residentName"],
        ["Date of Birth", "date", "dob"],
        ["Primary Contact Name", "text", "contactName"],
        ["Primary Contact Phone", "tel", "contactPhone"],
        ["Primary Contact Email", "email", "contactEmail"],
        ["Medical Conditions (brief)", "text", "conditions"],
        ["Medications (brief)", "text", "medications"],
        ["Notes / Concerns", "textarea", "notes"]
      ])}

      <hr />
      <h3>Post-Operative Patient Pre-Admission Form</h3>
      ${formTemplate("Post-Op Pre-Admission", [
        ["Patient Full Name", "text", "patientName"],
        ["Procedure / Surgery Type", "text", "procedure"],
        ["Surgery Date", "date", "surgeryDate"],
        ["Discharge Date (if known)", "date", "dischargeDate"],
        ["Surgeon / Hospital", "text", "hospital"],
        ["Primary Contact Phone", "tel", "contactPhone"],
        ["Primary Contact Email", "email", "contactEmail"],
        ["Care Needs", "textarea", "careNeeds"],
        ["Notes / Concerns", "textarea", "notes"]
      ])}
    </div>
  `;
}

function contact() {
  return `
    <div class="grid">
      <section class="card col-8">
        <h2>Contact Us</h2>
        <p class="notice">Send a message and we’ll respond as soon as possible.</p>

        ${formTemplate("Contact Request", [
          ["Your Name", "text", "name"],
          ["Phone", "tel", "phone"],
          ["Email", "email", "email"],
          ["Message", "textarea", "message"]
        ])}
      </section>

      <aside class="card col-4">
        <h3>Location</h3>
        <p><b>Crystal Manor Assisted Living, Inc.</b></p>
        <p class="notice">
          5610 Gwynndale Avenue<br/>
          Baltimore, MD 21207<br/>
          <b>Phone:</b> 443-429-0438
        </p>
      </aside>
    </div>
  `;
}

function adminDemo() {
  return `
    <div class="card">
      <h2>Admin Demo (No Database)</h2>
      <p class="notice">
        This page fetches in-memory submissions from the backend.
        Data resets when backend restarts.
      </p>

      <p>
        <button class="btn secondary" id="refreshAdminBtn">Refresh</button>
      </p>

      <div id="adminContent" class="notice">Loading...</div>
    </div>
  `;
}

function notFound() {
  return `
    <div class="card">
      <h2>Page not found</h2>
      <p class="notice"><a href="#/">Return home</a></p>
    </div>
  `;
}

function formTemplate(formType, fields) {
  const fieldHtml = fields.map(([label, type, name]) => {
    if (type === "textarea") {
      return `
        <div>
          <label>${label}</label>
          <textarea name="${name}" required></textarea>
        </div>
      `;
    }
    return `
      <div>
        <label>${label}</label>
        <input type="${type}" name="${name}" required />
      </div>
    `;
  }).join("");

  return `
    <form class="cm-form" data-form-type="${formType}">
      <div class="form-row">
        ${fieldHtml}
      </div>
      <div style="margin-top:12px; display:flex; gap:10px; align-items:center;">
        <button class="btn" type="submit">Submit</button>
        <span class="notice">We’ll contact you after review.</span>
      </div>
      <div class="form-status" style="margin-top:12px;"></div>
    </form>
  `;
}

function wireForms() {
  document.querySelectorAll(".cm-form").forEach((form) => {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const statusEl = form.querySelector(".form-status");
      statusEl.innerHTML = "";

      const formType = form.dataset.formType;
      const fd = new FormData(form);
      const data = Object.fromEntries(fd.entries());

      try {
        const res = await fetch(`${API}/api/forms/submit`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ formType, data })
        });
        const out = await res.json();
        if (!out.ok) throw new Error(out.error || "Failed to submit");

        statusEl.innerHTML = `<div class="success">✅ Submitted. Reference ID: ${out.id}</div>`;
        form.reset();
      } catch (err) {
        statusEl.innerHTML = `<div class="error">❌ ${err.message}</div>`;
      }
    });
  });
}

function wireAdminDemo() {
  const btn = document.getElementById("refreshAdminBtn");
  if (!btn) return;

  btn.addEventListener("click", loadAdminData);
  loadAdminData();
}

async function loadAdminData() {
  const el = document.getElementById("adminContent");
  if (!el) return;

  try {
    const res = await fetch(`${API}/api/admin/submissions`);
    const out = await res.json();
    if (!out.ok) throw new Error("Failed to load submissions");

    if (out.count === 0) {
      el.innerHTML = "No submissions yet. Submit a form to see it here.";
      return;
    }

    el.innerHTML = `
      <div class="card">
        <h3>Submissions (${out.count})</h3>
        ${out.submissions.map(s => `
          <div class="card" style="margin-top:12px;">
            <div><b>ID:</b> ${s.id}</div>
            <div><b>Type:</b> ${s.formType}</div>
            <div><b>Status:</b> ${s.status}</div>
            <div><b>Created:</b> ${s.createdAt}</div>
            <hr/>
            <pre style="white-space:pre-wrap; margin:0;">${JSON.stringify(s.data, null, 2)}</pre>
          </div>
        `).join("")}
      </div>
    `;
  } catch (e) {
    el.innerHTML = `<div class="error">❌ ${e.message}</div>`;
  }
}
