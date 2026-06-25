import React from "react";

function Footer() {
  return (
    <footer className="bg-gray-900 text-white text-center py-4 mt-10">
      <p>© {new Date().getFullYear()} Debtors Accounting System</p>
      <p className="text-gray-400 text-sm">
        Built with React + Tailwind CSS
      </p>
    </footer>
  );
}

export default Footer;