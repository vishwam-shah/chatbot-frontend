import type { AppProps } from 'next/app';
import '../styles/globals.css'; // Make sure to import your global styles

const MyApp = ({ Component, pageProps }: AppProps) => {
  return <Component {...pageProps} />;
};

export default MyApp;
