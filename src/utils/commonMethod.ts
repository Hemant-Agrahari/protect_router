import { toast } from 'react-toastify'
export const copyToClipboard = async (text: string, successMessage: string) => {
  try {
    await navigator.clipboard.writeText(text)
    toast.success(successMessage)
  } catch (error) {
    toast.error(('Failed to copy!'))
  }
}
