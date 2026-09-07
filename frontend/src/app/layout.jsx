import './globals.css';
import Providers from './Providers';

export const metadata = {
  title: 'Intelecta SuperApp — Enterprise Digital Operations',
  description: 'Internal Operations & Client Management Hub for Web Development, Mobile App Dev, and Web Apps.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className="dark">
      <body className="bg-[#030303] text-zinc-100 font-sans antialiased selection:bg-white selection:text-black">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
