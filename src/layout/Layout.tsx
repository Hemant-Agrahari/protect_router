import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

const Footer = dynamic(() => import('./Footer'), { ssr: false });
const Header = dynamic(() => import('./Header'), { ssr: false });
const Sidebar = dynamic(() => import('./Sidebar'), { ssr: false });

const Layout = ({ handleSearch, searchQuery, children }: any) => {
  const router = useRouter();
  const [active, setActive] = useState(false);

  const handleActive = () => {
    setActive(false);
  };

  useEffect(() => {
    setActive(
      ['/poker-game', '/sport-bet', '/play-game'].includes(router?.asPath) &&
        false,
    );
  }, [router.asPath]);

  if (router.pathname === '/poker-game') {
    return <>{children}</>;
  }

  return (
    <>
      <Header
        setActive={setActive}
        active={active}
        handleSearch={handleSearch}
        searchQuery={searchQuery}
      />
      <Sidebar
        active={active}
        handleSearch={handleSearch}
        searchQuery={searchQuery}
        handleActive={handleActive}
      />

      <main
        className={active ? 'sideBarOpen' : ''}
        style={router.pathname === '/sport-bet' ? { marginBottom: '0px' } : {}}
      >
        {children}
      </main>
      <Footer active={active} />
    </>
  );
};

export default Layout;
