export const formatDate = (inputDate: string) => {
  const date = new Date(inputDate)
  if (isNaN(date.getTime())) {
    return 'Invalid Date'
  }
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const vipBonuses = [
  { level: 'VIP0-VIP 1', bonus: '$ 5' },
  { level: 'VIP0-VIP 2', bonus: '$ 10' },
  { level: 'VIP0-VIP 3', bonus: '$ 20' },
  { level: 'VIP0-VIP 4', bonus: '$ 50' },
  { level: 'VIP0-VIP 5', bonus: '$ 100' },
  { level: 'VIP0-VIP 6', bonus: '$ 200' },
  { level: 'VIP0-VIP 7', bonus: '$ 500' },
  { level: 'VIP0-VIP 8', bonus: '$ 1000' },
  { level: 'VIP0-VIP 9', bonus: '$ 2000' },
  { level: 'VIP0-VIP 10', bonus: '$ 5000' },
]

export const logError = (err: any) => {
  if (process.env.NEXT_ENV === 'development') {
    console.log(err)
  }
}
export const isValidUrl = (url: string) => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export function checkImageUrl(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image()
    img.src = url

    img.onload = function () {
      resolve(true) // Resolve with true when image loads successfully
    }

    img.onerror = function () {
      resolve(false) // Resolve with false when there is an error loading the image
    }
  })
}

export async function processGames(games: any[]): Promise<any[]> {
  const processedGames = await Promise.all(
    games.map(async (game) => {
      const isValid = await checkImageUrl(game.gameImageUrl)
      return { ...game, isValidImageUrl: isValid }
    }),
  )
  return processedGames
}

export const handleKeyDown = (event: any) => {
  if (['e', 'E', '+', '-', '.'].includes(event.key)) {
    event.preventDefault()
  }
}

export const removeExtraSymbols = (input: string) => {
  // Remove all characters that are not letters, numbers, or spaces
  return input?.replace(/[^a-zA-Z0-9 ]/g, ' ')
}

export const setLocalStorageItem = (key: string, value: any): void => {
  if (typeof window === 'undefined') {
    return // Prevent execution on the server
  }

  localStorage.setItem(key, JSON.stringify(value))
}

export const getLocalStorageItem = (key: string): any => {
  if (typeof window === 'undefined') {
    return null // Ensure the method works only in the browser
  }

  const item = localStorage.getItem(key)
  return item ? JSON.parse(item) : null
}

export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth', // Smooth scrolling
  })
}
