import { PostMethod } from '@/services/fetchAPI';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { GetStaticProps } from 'next';
import { commonStaticProps } from '@/utils/translation';
import { useTranslation } from 'react-i18next';
import dynamic from 'next/dynamic';
import { getLocalStorageItem, logError } from '@/utils';
import Loader from '@/component/common/mui-component/Loader';

// Method is for language switch
export const getStaticProps: GetStaticProps = async (context) => {
  const { locale } = context;
  return commonStaticProps(locale!);
};

const PlayGame = () => {
  const router = useRouter();
  const { gameId, provider } = router.query;
  const [userId, setUserId] = useState<string | null>(null);
  const [gameUrl, setGameUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  if (provider === 'DPGames') {
    router.push('/sport-bet');
  }

  const fetchGameUrl = () => {
    const params = {
      userId: userId,
      gameId: gameId,
      provider: provider,
    };
    PostMethod('urlGameAction', params)
      .then((res: any) => {
        if (res.data.status !== 'success') {
          toast.error(res?.data.message);
          router.push('/');
        }
        setGameUrl(res.data.result.gameUrl);
      })
      .catch((error) => {
        logError(`Error fetching game data: ${error}`);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    try {
      const auth = getLocalStorageItem('auth');
      if (!auth) {
        router.push('/').then(() => toast.error(t('Please login')));
      } else if (auth) {
        const user = JSON.parse(auth);
        setUserId(user?._id || null); // Safely access _id
      }
    } catch (error) {
      logError(`Error fetching game data: ${error}`);
    }
  }, []);

  useEffect(() => {
    if (gameId && provider && userId) {
      fetchGameUrl();
    }
  }, [gameId, provider, userId]);

  return (
    <div className="container-fluid px-1">
      {loading ? (
        <Loader />
      ) : (
        <iframe
          src={gameUrl}
          title="title"
          width="100%"
          height="700px"
          allowFullScreen
        />
      )}
    </div>
  );
};

export default dynamic(() => Promise.resolve(PlayGame), {
  ssr: false,
});
