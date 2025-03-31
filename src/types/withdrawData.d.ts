

interface WithdrawDataType{
data: {
  transactionId: string
  createdAt:string
  nickName: string
  withdrawValue: number
  withdrawFee: number
  finalValue: number
  status: string
  depositAmmount: number
  bonus: number
  actualAmount: number
 
}[]
count: number
}

export default WithdrawDataType