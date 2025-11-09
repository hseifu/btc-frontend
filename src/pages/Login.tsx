import { LoginForm } from '@/components/login-form'
import { useAuthStore } from '@/store/authStore'
import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export const Login = () => {
  const {
    login,
    isLoading,
    error: storeError,
    clearError,
    isAuthenticated,
  } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  const handleSubmit = async (data: { email: string; password: string }) => {
    clearError()

    try {
      await login(data.email, data.password)
      navigate('/dashboard')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md">
          <LoginForm
            onSubmit={handleSubmit}
            isLoading={isLoading}
            error={storeError}
          />
          <div className="text-center mt-4 text-sm">
            <Link to="/signup" className="text-blue-600 hover:underline">
              Don't have an account? Sign up
            </Link>
            {' | '}
            <Link to="/" className="text-blue-600 hover:underline">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
