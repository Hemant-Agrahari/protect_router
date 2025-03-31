interface GameType {
  gameHistory: {
    _id: string
    roundId: number
    date: string
    gameName: string
    betAmount: number
    winAmount: number
    loss: number
    createdAt: string
  }[]
  totalCount: number
}

export default GameType
