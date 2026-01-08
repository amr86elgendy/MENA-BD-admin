import { useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2Icon } from 'lucide-react'
// UI
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Checkbox } from '@/components/ui/checkbox'
import { LoaderComponent } from '@/components/ui/loader'
// Utils
import { useAuthStore } from '@/store/auth'
import { useLogin } from '@/apis/auth'

export const Route = createFileRoute('/login/')({
  validateSearch: z.object({
    redirect: z.string().optional().catch(''),
  }),
  component: LoginPage,
  pendingComponent: LoaderComponent,
})

const loginSchema = z.object({
  email: z
    .string()
    .min(1, {
      message: 'Email is required',
    })
    .email('Please enter a valid email address'),
  password: z.string().min(1, {
    message: 'Password is required',
  }),
  rememberMe: z.boolean(),
})

function LoginPage() {
  const authenticateUser = useAuthStore((state) => state.authenticateUser)

  const form = useForm<z.infer<typeof loginSchema>>({
    defaultValues: {
      email: 'admin@mena.com',
      password: '123456',
      rememberMe: false,
    },
    resolver: zodResolver(loginSchema),
  })

  const navigate = Route.useNavigate()
  const search = Route.useSearch()

  const loginMutation = useLogin()

  useEffect(() => {
    localStorage.setItem(
      'remember-me',
      JSON.stringify(form.watch('rememberMe')),
    )
  }, [form.watch('rememberMe')])

  function onSubmit(values: z.infer<typeof loginSchema>) {
    loginMutation.mutate(values, {
      onSuccess: (data) => {
        authenticateUser(data)
        navigate({ to: search.redirect || '/' })
      },
    })
  }

  return (
    <section className="h-screen w-full lg:grid lg:grid-cols-2">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Card className="w-full max-w-sm">
              <CardHeader>
                <CardTitle className="text-2xl">Login</CardTitle>
                <CardDescription>
                  Enter your email below to login to your account.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <Form {...form}>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            required
                            placeholder="m@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" required {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="rememberMe"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Remember Me</FormLabel>
                          <FormDescription>
                            You can save your data so you don't need to login
                            again.
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </Form>
              </CardContent>
              <CardFooter>
                <Button
                  type="submit"
                  disabled={loginMutation.isPending}
                  className="w-full"
                >
                  {loginMutation.isPending ? (
                    <>
                      <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                      Please wait
                    </>
                  ) : (
                    'Sign in'
                  )}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <img
          src="/login-dashboard.jpg"
          alt="Image"
          width="1920"
          height="1080"
          className="h-screen w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </section>
  )
}
