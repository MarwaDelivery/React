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
  lang = "en",
}) => {
  const siteName = businessName;
  const router = useRouter();
  const { asPath } = router;
  const siteUrl = "https://www.marwa.hu";
  const url = `${siteUrl}${asPath}`;

  const metaData = {
    en: {
      title: "Budapest | Marwa Delivery | Foods, Restaurants, Grocery Stores | Marwa",
      description:
        "Order online from Marwa and enjoy a 2000 HUF discount on your first order and free delivery. Choose from over 5000 restaurants and stores.",
      ogTitle:
        "Budapest | Marwa Delivery | Foods, Restaurants, Grocery Stores | Marwa",
      ogDescription:
        "Order online from Marwa and enjoy a 2000 HUF discount on your first order and free delivery. Choose from over 5000 restaurants and stores.",
      ogImage:
        "https://panel.marwa.hu/storage/app/public/banner/2025-04-04-67f046829d77f.png",
    },
    hu: {
      title: "Budapest | Marwa házhoz szállítás | Ételek, éttermek, élelmiszerboltok | Marwa",
      description:
        "Rendelj online Marwa-ról, és élvezd az -2000 Ft kedvezményt első rendelésedre és a 0 Ft-os kiszállítást. Több mint 5000 étterem és üzlet kínálatából választhatsz.",
      ogTitle:
        "Budapest | Marwa házhoz szállítás | Ételek, éttermek, élelmiszerboltok | Marwa",
      ogDescription:
        "Rendelj online Marwa-ról, és élvezd az -2000 Ft kedvezményt első rendelésedre és a 0 Ft-os kiszállítást. Több mint 5000 étterem és üzlet kínálatából választhatsz.",
      ogImage:
        "https://panel.marwa.hu/storage/app/public/banner/2025-04-04-67f046829d77f.png",
    },
  };

  const currentMeta = metaData[lang] || metaData.en;

  return (
    <Head>
      <title>{currentMeta.title}</title>
      <meta name="description" content={currentMeta.description} />
      <meta itemProp="name" content={currentMeta.title} />
      <meta itemProp="description" content={currentMeta.description} />
      <meta itemProp="image" content={currentMeta.ogImage} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={currentMeta.ogTitle} />
      <meta property="og:description" content={currentMeta.ogDescription} />
      <meta property="og:image" content={currentMeta.ogImage} />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta name="twitter:title" content={currentMeta.ogTitle} />
      <meta name="twitter:description" content={currentMeta.ogDescription} />
      <meta name="twitter:image" content={currentMeta.ogImage} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={url} />
      <html lang={lang} />
    </Head>
  );
};

export default MetaData;
