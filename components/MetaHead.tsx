import { VFC } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
interface MetaHeadProps {
  title?: string;
  description?: string;
  ogpImage?: string;
}

const MetaHead: VFC<MetaHeadProps> = ({ title, description, ogpImage }: MetaHeadProps) => {
  const domain = 'viewer.nekoyasan.me';
  const siteName = 'Code for Japan Summit Viewer';
  const siteDescription =
    'Code for Japan Summitのいろんなトラックをみよう！グラフィックレコーディング・チャットも一緒にご覧いただけます！';
  return (
    <Head>
      <title>{(title ? `${title} | ` : '') + siteName}</title>
      <meta property="og:title" content={(title ? `${title} | ` : '') + siteName} />
      <meta name="description" content={description ? description : siteDescription} />
      <meta property="og:description" content={description ? description : siteDescription} />
      <meta property="og:type" content={'website'} />
      <meta
        property="og:image"
        content={ogpImage ? `https://${domain}/${ogpImage}` : `https://${domain}/OGP.png`}
      />
      <meta property="og:site_name" content={(title ? `${title} | ` : '') + siteName} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={'@codeforjapan'} />
      <meta name="twitter:creator" content={'@Nekoya3_'} />
      <meta name="twitter:url" content={`https://${domain}/`} />
      <meta name="twitter:title" content={(title ? `${title} | ` : '') + siteName} />
      <meta name="twitter:description" content={description ? description : siteDescription} />
      <meta
        name="twitter:image"
        content={ogpImage ? `https://${domain}/${ogpImage}` : `https://${domain}/OGP.png`}
      />
      <link rel="canonical" href={`https://${domain}/`} />
      <link rel="shortcut icon" href={`https://${domain}/favicon.ico`} />
      <link rel="apple-touch-icon" href={`https://${domain}/logo.png`} />
    </Head>
  );
};

export default MetaHead;
