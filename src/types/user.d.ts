interface UserType {
  isDailySpin: boolean

  nickName: string
  affiliateProfilePic: string
  avatar: string
  typeOfLogin: string
  email: string
  isDeleted: boolean
  Game: string[]
  spinCount: number
  role: string
  isLogin: boolean
  recieveMail: boolean
  invitationCode: string
  expiriesAt: string
  referralUserId: string | null
  affiliateId: string | null
  token: string
  vivoToken: string
  socketId: string
  level: number
  totalDeposit: number
  isGmail: boolean
  isFacebook: boolean
  fbAcceessToken: string
  facebookId: string
  totalBet: number
  chips: number
  deviceToken: string
  bonusChips: number
  bonusBet: number
  promotion: boolean
  affiliateChips: number
  bonus: number
  invitedUserCount: number
  status: string
  deductedBonusChips: number
  deductedChips: number
  createdAt: string
  updatedAt: string
  _id: string
  playerId: string
  password: string
  __v: number
  totalLevelDeposits: number
  totalLevelBets: number
  totalDepositPercentage: number
  pendingNotification: boolean
  totalBetsPercentage: number
  origanlCashBack: number | null
  liveCasino: number
  gameType: string[]
  allProviders: string[]
  vipLevelDetails: {
    betPer: number
    currenDeposit: number
    currenLevel: number
    currentBet: number
    depositPer: number
    nextLevel: number
    nextLevelBet: number
    nextLevelDeposit: number
    isDailySpin: boolean
  }
}
export default UserType
