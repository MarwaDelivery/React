import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";

const MetaData = ({
  title,
  description,
  keywords,
  ogImage,
  ogType,
  pathName,
  businessName,
}) => {
  const siteName = businessName;
  const router = useRouter();
  const { asPath } = router;
  const siteUrl = "we";
  const url = `${siteUrl}${asPath}`;

  return (
    <Head>
 
    <title>Budapest | Marwa házhoz szállítás | Ételek, éttermek, élelmiszerboltok | Marwa</title>

    
    <meta name="description" content="Rendelj online Marwa-ról, és élvezd az -2000 Ft kedvezményt első rendelésedre és a 0 Ft-os kiszállítást. Több mint 5000 étterem és üzlet kínálatából választhatsz." />

    <meta itemProp="name" content="Budapest | Marwa házhoz szállítás | Ételek, éttermek, élelmiszerboltok | Marwa" />
    <meta itemProp="description" content="Rendelj online Marwa-ról, és élvezd az -2000 Ft kedvezményt első rendelésedre és a 0 Ft-os kiszállítást. Több mint 5000 étterem és üzlet kínálatából választhatsz." />
    <meta itemProp="image" content="https://panel.marwa.hu/storage/app/public/banner/2025-04-04-67f046829d77f.png" />
    <meta property="og:type" content="website" />

    <meta property="og:title" content="Budapest | Marwa házhoz szállítás | Ételek, éttermek, élelmiszerboltok | Marwa" />
    <meta property="og:description" content="Rendelj online Marwa-ról, és élvezd az -2000 Ft kedvezményt első rendelésedre és a 0 Ft-os kiszállítást. Több mint 5000 étterem és üzlet kínálatából választhatsz." />
    <meta property="og:image" content="https://panel.marwa.hu/storage/app/public/banner/2025-04-04-67f046829d77f.png" />
    <meta property="og:image:type" content="image/png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:url" content="https://www.marwa.hu" />
    <meta property="og:type" content="website" />

    <meta name="twitter:title" content="Budapest | Marwa házhoz szállítás | Ételek, éttermek, élelmiszerboltok | Marwa" />
    <meta name="twitter:description" content="Rendelj online Marwa-ról, és élvezd az -2000 Ft kedvezményt első rendelésedre és a 0 Ft-os kiszállítást. Több mint 5000 étterem és üzlet kínálatából választhatsz." />
    <meta name="twitter:image" content="https://panel.marwa.hu/storage/app/public/banner/2025-04-04-67f046829d77f.png" />
    <meta name="twitter:card" content="summary_large_image" />

 
    <meta name="robots" content="index, follow" />

    <link rel="canonical" href="https://www.marwa.hu" />
</Head>
  );
};

export default MetaData;
