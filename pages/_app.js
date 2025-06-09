/**
 * Custom App component
 * Imports global styles and wraps all pages
 */
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp; 