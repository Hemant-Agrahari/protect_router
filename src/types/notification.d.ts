type notification={
  _id: string
  content: string
  createdAt: string
  read: boolean
  title: string
  updatedAt: string
  userId: string
  __v: number
}
interface NotificationType {
  isRead:boolean
  notification:notification[]

}

export default NotificationType
