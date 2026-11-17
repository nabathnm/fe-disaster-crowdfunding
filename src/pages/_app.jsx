import "@/styles/globals.css"
import Head from "next/head"
import Script from "next/script"
import Navbar from "@/components/Navbar"

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>PeduliChain - Disaster Crowdfunding Blockchain</title>
        <meta
          name="description"
          content="Platform crowdfunding tanggap bencana dengan transparansi pencatatan donasi publik pada Ethereum Sepolia Testnet dan integrasi pembayaran Midtrans."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        {/* Google Fonts Poppins */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </Head>

      {/* Midtrans Snap Sandbox SDK Sesuai Spesifikasi */}
      <Script
        src="https://app.sandbox.midtrans.com/snap/snap.js"
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "SB-Mid-client-demo12345678"}
        strategy="lazyOnload"
      />

      <div className="min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-primary selection:text-primary-foreground">
        <Navbar />
        <main className="flex-1">
          <Component {...pageProps} />
        </main>
        <footer className="border-t py-6 md:py-8 bg-muted/40">
          <div className="container mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
            <p>© 2026 PeduliChain Disaster Crowdfunding. Ethereum Sepolia Testnet.</p>
            <div className="flex items-center gap-4">
              <a href="/audit" className="hover:underline">Transparency Audit</a>
              <a href="https://sepolia.etherscan.io" target="_blank" rel="noopener noreferrer" className="hover:underline">
                Sepolia Etherscan
              </a>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
