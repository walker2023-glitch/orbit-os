import { useState, type FormEvent } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { ApiError } from '../lib/api';
import { useAuth } from '../lib/auth';

export function LoginPage() {
  const { me, loading, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!loading && me) return <Navigate to="/guardian" replace />;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
      navigate('/guardian');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Login failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-gutter">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md bg-surface-container-lowest border border-outline-variant rounded-xl p-olg"
      >
        <h1 className="text-display-lg text-on-surface">Orbit OS</h1>
        <p className="text-body-md text-on-surface-variant mt-oxs mb-olg">
          Sign in to Guardian Command
        </p>

        {error && (
          <div className="mb-omd bg-error-container text-on-error-container rounded-lg p-osm text-body-md">
            {error}
          </div>
        )}

        <label className="block mb-omd">
          <span className="text-label-md text-on-surface-variant">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full px-4 py-2 border border-outline-variant rounded-lg text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </label>

        <label className="block mb-olg">
          <span className="text-label-md text-on-surface-variant">Password</span>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full px-4 py-2 border border-outline-variant rounded-lg text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-2 bg-primary text-on-primary rounded-lg text-label-md hover:bg-primary/90 transition-colors disabled:opacity-60"
        >
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>

        <p className="mt-olg text-body-md text-on-surface-variant text-center">
          New family?{' '}
          <Link to="/auth/signup" className="text-secondary underline">
            Create account
          </Link>
        </p>
      </form>
    </div>
  );
}
