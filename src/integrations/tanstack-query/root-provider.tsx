import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { toast } from 'sonner'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
    mutations: {
      onError: (error) => {
        console.log(error.code)
        if (error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED') {
          toast.error('Uh oh! Something went wrong.', {
            description: 'There was a problem with your Network connection!',
          })
        } else {
          toast.error('Uh oh! Something went wrong.', {
            description: error.response?.data.msg,
          })
        }
      },
    },
  },
})

export function getContext() {
  return {
    queryClient,
  }
}

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
