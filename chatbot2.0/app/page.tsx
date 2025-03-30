import { LoginForm } from "@/components/login-form"

export default function Home() {
  // In a real app, you would check if the user is authenticated
  // and redirect to dashboard if they are
  // const isAuthenticated = ...
  // if (isAuthenticated) redirect("/dashboard");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Welcome to MindPal</h1>
          <p className="text-muted-foreground">Login to access your dashboard</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}

