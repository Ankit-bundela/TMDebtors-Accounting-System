/*import React from "react";

const Contact = () => {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-[#f7faff] to-[#e5ecf9] text-gray-800">
      <header className="bg-white shadow-md py-6 px-8">
        <h1 className="text-3xl font-bold text-blue-800">🌟 About Us</h1>
      </header>
      <main className="flex-grow p-8 max-w-4xl mx-auto">
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Who We Are</h2>
          <p className="text-lg leading-relaxed text-gray-600">
            We are a passionate team of developers and accountants dedicated to simplifying business finances. Our Debtors Accounting platform allows businesses to track invoices, manage customers, and automate tax calculations with ease.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Our Vision</h2>
          <p className="text-lg leading-relaxed text-gray-600">
            To empower small and medium businesses with accessible and intelligent accounting tools that reduce manual effort and increase transparency in billing and tax.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Technologies We Use</h2>
          <ul className="list-disc list-inside text-gray-600 text-lg">
            <li>ReactJS for frontend</li>
            <li>Python (Socket-based) backend</li>
            <li>Custom APIs — no third-party axios</li>
            <li>Modern UI with TailwindCSS</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Get in Touch</h2>
          <p className="text-lg text-gray-600">
            📧 Email: support@debtoraccounting.in  
            <br />
            📞 Phone: +91 98765 43210  
            <br />
            📍 Location: Jaipur, Rajasthan, India
          </p>
        </section>
      </main>

      <footer className="bg-blue-900 text-white text-center py-4">
        <p>© {new Date().getFullYear()} Debtors Accounting. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Contact;
*/
import React from "react";

const Contact = () => {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-[#f7faff] to-[#e5ecf9] text-gray-800">
      {/* HEADER */}
      <header className="bg-white shadow-md py-6 px-8">
        <h1 className="text-3xl font-bold text-blue-800">🚀 About Our Project</h1>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-grow p-8 max-w-4xl mx-auto">
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">📌 Project Overview</h2>
          <p className="text-lg leading-relaxed text-gray-600">
            Debtors Accounting is a modern web application designed to handle every aspect of small-to-medium scale business invoicing and customer tracking. With our intuitive dashboard and seamless backend integration, users can easily generate, manage, and analyze their invoices.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">💡 Key Features</h2>
          <ul className="list-disc list-inside text-gray-600 text-lg">
            <li>Create & Edit GST Invoices</li>
            <li>Customer and Trader Management</li>
            <li>Live Server Communication using Python Socket</li>
            <li>Role-based Authentication with Session Management</li>
            <li>Secure Login/Register with Frontend Validation</li>
            <li>Beautiful UI with TailwindCSS + Material UI blend</li>
            <li>Responsive Sidebar and Navbar Layout</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">🧠 Technologies Used</h2>
          <ul className="list-disc list-inside text-gray-600 text-lg">
            <li>Frontend: ReactJS (Hooks, Routing, Material-UI, TailwindCSS)</li>
            <li>Backend: Python with socket programming and Oracle DB</li>
            <li>Custom API handling (No axios/fetch directly)</li>
            <li>Data storage using Oracle SQL</li>
            <li>Authentication: Custom Session Handling (LocalStorage)</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">🖼️ Project Preview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 " >
            <img src="/Images/db1.jpg" alt="Dashboard Screenshot" className="rounded-xl shadow-lg" />
            <img src="/Images/db2.jpg" alt="Invoice Form Screenshot" className="rounded-xl shadow-lg" />
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">📞 Contact Us</h2>
          <p className="text-lg text-gray-600">
            📧 Email: support@debtoraccounting.in  <br />
            📞 Phone: +91 98765 43210  <br />
            📍 Location: Ujjain / Jaipur, India
          </p>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-blue-900 text-white text-center py-4">
        <p>© {new Date().getFullYear()} Debtors Accounting. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Contact;
