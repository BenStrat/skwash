import "./globals.css";
import { ReactQueryProvider } from "@/providers/react-query-provider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-zinc-50 text-zinc-950">
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  );
}
