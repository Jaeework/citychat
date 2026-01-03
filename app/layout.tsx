import type { Metadata } from "next";
import Header from "./components/Header";
import QueryProvider from "./providers/QueryProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "CityChat",
  description: "대한민국 도시별 커뮤니티 플랫폼",
  openGraph: {
    title: "CityChat",
    description: "대한민국 도시별 커뮤니티 플랫폼",
    url: "https://citychat-beta.vercel.app/",
    siteName: "CityChat",
    images: [
      {
        url: "/assets/citychat2.png",
        width: 782,
        height: 756,
        alt: "CityChat logo",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
};

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <QueryProvider>
          <Header />
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
