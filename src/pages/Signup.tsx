import { SignupForm } from '@/components/signup-form'
import { useAuthStore } from '@/store/authStore'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export const Signup = () => {
  const {
    signup,
    isLoading,
    error: storeError,
    clearError,
    isAuthenticated,
  } = useAuthStore()
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  const handleSubmit = async (data: {
    name: string
    email: string
    password: string
    confirmPassword: string
  }) => {
    clearError()
    setError(null)

    // Validate password match
    if (data.password !== data.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    // Validate password length
    if (data.password.length < 8) {
      setError('Password must be at least 8 characters long')
      return
    }

    try {
      await signup(data.name, data.email, data.password)
      navigate('/dashboard')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Signup failed'
      setError(errorMessage)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md">
          <SignupForm
            onSubmit={handleSubmit}
            isLoading={isLoading}
            error={error || storeError}
          />
          <div className="text-center mt-4 text-sm">
            <Link to="/login" className="text-blue-600 hover:underline">
              Already have an account? Login
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
