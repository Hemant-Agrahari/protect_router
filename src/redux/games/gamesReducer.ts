import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface IGame {
  gameUrl: string
  tab: string
  gameProvider: string
  activeId: string
  divSettingTabAPI: string
  isMaintenance: boolean
}

const initialState: IGame = {
  gameUrl: '',
  tab: 'all games',
  activeId: 'divOne',
  gameProvider: 'All Games',
  divSettingTabAPI: 'AllGames',
  isMaintenance: false,
}

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setTab: (state: any, action: any) => {
      state.tab = action.payload.tab
      state.activeId = action.payload.activeId
      state.divSettingTabAPI = action.payload.divSettingTabAPI
    },
    setGameUrl: (state: any, action: PayloadAction<string>) => {
      state.gameUrl = action.payload
    },
    setGameProvider: (state: any, action: any) => {
      state.gameProvider = action.payload
    },
    setMaintenance: (state, action: PayloadAction<boolean>) => {
      state.isMaintenance = action.payload
    },
  },
})

export const { setTab, setGameUrl, setGameProvider, setMaintenance } =
  gameSlice.actions

export default gameSlice.reducer
