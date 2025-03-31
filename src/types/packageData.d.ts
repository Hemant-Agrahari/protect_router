interface PackageDataType {
  _id: string
  name: string
  depositAmount: number
  amount: number
  bonus: number
  bonusPercentage: number
  maximumBonus: number
  withdrawCondition: number
  englishBanner: string // Assuming this is a URL to an English banner image
  tag: string // Assuming 'tag' is a string identifying the package type or category
}

export default PackageDataType
