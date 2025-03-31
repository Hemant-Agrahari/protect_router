import { useState } from 'react'
import axios from 'axios'
import useSWR from 'swr'

export const getAccessToken = () => {
  return typeof window !== 'undefined'
    ? localStorage.getItem('auth')
      ? JSON.parse(localStorage.getItem('auth')!).token
      : null
    : null
}

export const BASE_URL = `${process.env.NEXT_PUBLIC_BASE_URL}`

type useFetchOptions = {
  BASE_URL: typeof BASE_URL | '/api'
}

type MutationOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  isFormData?: boolean
  BASE_URL?: string
  body?: any
}
export const useFetch = <T>(path: string, options?: useFetchOptions) => {
  const url = options?.BASE_URL || BASE_URL
  const token = getAccessToken()
  const { data, error, isValidating, isLoading } = useSWR<{
    result?: T
    success: boolean
    msg: string
    pagination?: {
      total: number
      totalCount: number
      page?: string
      limit?: string
    }
  }>(
    path?.includes('undefined') ? null : `${url}/${path}`,
    async (args: any) => {
      const headers: HeadersInit = {}
      if (token) headers['token'] = token
      // headers['Accept-Language'] = 'ar'
      const response = await axios.get(args, { headers })
      return response.data
    },
    {
      revalidateOnFocus: true,
    },
  )
  return {
    data: data,
    isValidating,
    isLoading,
    error,
    success: data?.success,
    msg: data?.msg,
    pagination: data?.pagination,
  }
}

export const useMutateData = () => {
  const [isMutating, setIsMutating] = useState(false)

  const mutateData = async (path: string, options?: MutationOptions) => {
    try {
      const token = getAccessToken()
      const url = options?.BASE_URL || BASE_URL
      setIsMutating(true)
      const method = options?.method || 'POST'
      const body =
        method !== 'GET' && options?.body
          ? options?.isFormData
            ? options?.body
            : JSON.stringify(options.body)
          : undefined
      const headers: any = options?.isFormData
        ? {}
        : { 'Content-Type': 'application/json' }

      if (token) headers['token'] = token
      // headers['Accept-Language'] = 'ar'
      const response = await axios({
        method,
        url: `${url}/${path}`,
        data: body,
        headers,
      })

      setIsMutating(false)

      return {
        data: response?.data?.result ? response?.data?.result : response?.data,
        status: response?.data?.status,
        message: response?.data?.message,
      }
    } catch (error) {
      setIsMutating(false)
      throw new Error(
        error instanceof Error ? error.message : 'Something went wrong',
      )
    }
  }

  return { mutateData, isMutating }
}
