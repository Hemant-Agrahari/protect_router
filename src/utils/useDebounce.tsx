import { useRef } from 'react'

type CallbackFunction<T extends any[]> = (...args: T) => void

const useDebounce = <T extends any[]>(
  callback: CallbackFunction<T>,
  delay: number = 300,
) => {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  return (...args: T) => {
    if (timer.current) {
      clearTimeout(timer.current)
    }

    timer.current = setTimeout(() => {
      callback(...args)
    }, delay)
  }
}

export default useDebounce
