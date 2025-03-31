import React, { useEffect, useState } from 'react';
import { Dialog } from '@mui/material';
import Login from '../Login';
import { useAppSelector } from '@/redux/hooks';
import { useRouter } from 'next/router';
import { logError, processGames, removeExtraSymbols } from '@/utils';
import BackToTop from '@/component/common/BacktoTop';
import { useTranslation } from 'react-i18next';
import Loader from '@/component/common/mui-component/Loader';
import { CustomButton } from '@/component/common';
import CustomImage from '@/component/common/CustomImage';

const HomeGames = ({ handleGameLimit, provider, games, totalGames }: any) => {
  const base_url = process.env.NEXT_PUBLIC_IMAGE_URL;
  const user = useAppSelector((state) => state.user.user);
  const router = useRouter();
  const { t } = useTranslation();
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [displayedGames, setDisplayedGames] = useState<any>([]);

  const getHomeGameList = async () => {
    try {
      let res = await processGames(games);
      setDisplayedGames(res);
      return res;
    } catch (error) {
      logError(`Error fetching game data: ${error}`);
    }
  };

  const handleCloseLoginModal = (
    redirection?: boolean,
    gameId?: string,
    provider?: string,
  ) => {
    if (redirection && gameId && provider) {
      router
        .push({ pathname: '/play-game', query: { gameId, provider } })
        .then(() => setOpenLoginModal(false));
    } else {
      setOpenLoginModal(false);
    }
  };

  const handleGameInit = (
    event: React.MouseEvent<HTMLDivElement>,
    item: any,
  ) => {
    event.preventDefault();
    if (user && user?._id) {
      handleCloseLoginModal(true, item?._id, item?.provider);
    } else {
      setOpenLoginModal(true);
    }
  };

  useEffect(() => {
    try {
      if (games && Array.isArray(games) && games.length > 0) {
        getHomeGameList();
      }
    } catch (error) {
      logError(`Error fetching game data: ${error}`);
    }
  }, [games]);

  return (
    <>
      {displayedGames && displayedGames.length > 0 ? (
        <div className="homeTab-content mt-3">
          <>
            {displayedGames && displayedGames.length > 0
              ? displayedGames.map((item: any, key: any) => (
                  <div
                    className="homeTabContent-col"
                    key={item.BrandGameId}
                    onClick={(event) => handleGameInit(event, item)}
                  >
                    <div className="gameImg">
                      <CustomImage
                        src={
                          item?.customImage
                            ? `${base_url}${item.customImage}`
                            : item.isValidImageUrl
                              ? item.gameImageUrl
                              : provider.type === 'crash'
                                ? `${base_url}${item.gameImageUrl}`
                                : '/assets/images/gameImage.png'
                        }
                        alt={t(`Game image`)}
                        height={140}
                        width={200}
                        className="img-lazy"
                        unoptimized
                      />
                    </div>
                    <h6>
                      {item?.type === 'vivo' &&
                      item?.provider.type === 'live games'
                        ? item?.GameTypeName
                        : item.Name}
                    </h6>
                  </div>
                ))
              : ''}
          </>
          <Dialog
            className="signUpModaluniversal"
            open={openLoginModal}
            onClose={() => handleCloseLoginModal(false)}
            scroll="body"
          >
            <Login
              handleCloseLoginModal={handleCloseLoginModal}
              setOpenLoginModal={setOpenLoginModal}
              tabIndex={tabIndex}
              setTabIndex={setTabIndex}
            />
          </Dialog>
        </div>
      ) : (
        <Loader />
      )}

      <div className="d-flex justify-content-center">
        {totalGames > displayedGames.length && (
          <div className="loginSignUp-btn">
            <CustomButton
              type="button"
              className="btn signUp-btn"
              onClick={() => handleGameLimit(24)}
            >
              {t('Load more')}
            </CustomButton>
          </div>
        )}
        {displayedGames.length ? <BackToTop /> : ''}
      </div>
    </>
  );
};

export default HomeGames;
