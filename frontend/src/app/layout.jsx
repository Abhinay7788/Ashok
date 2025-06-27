import Navbar from "../../components/Navbar";
import "./globals.css";

export const metadata = {
  title: "Ashok Leyland CRM",
  description: "Lead Capture and CRM Dashboard",
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}