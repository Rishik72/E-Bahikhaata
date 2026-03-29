import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { TreePine } from 'lucide-react';

export default function LoginPage() {
  const { user, signIn, signUp } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (isSignUp) {
      const { error } = await signUp(email, password, fullName);
      if (error) setError(error.message);
    } else {
      const { error } = await signIn(email, password);
      if (error) setError(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mx-auto">
            <TreePine className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-display font-bold text-foreground">ई-बहीखाता</h1>
          <p className="text-muted-foreground">E-Bahikhata — Digital Vanshavali System</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="font-display text-center">
              {isSignUp ? 'Create Pandit Account' : 'Pandit Login'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div>
                  <Label>Full Name (पूरा नाम)</Label>
                  <Input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="e.g. Pandit Ramesh Sharma" required />
                </div>
              )}
              <div>
                <Label>Email</Label>
                <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="pandit@example.com" required />
              </div>
              <div>
                <Label>Password</Label>
                <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} />
              </div>
              {error && (
                <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">{error}</p>
              )}
              <button type="submit" disabled={loading} className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity disabled:opacity-50">
                {isSignUp ? 'Create Account' : 'Login'}
              </button>
            </form>
            <div className="mt-4 text-center">
              <button onClick={() => { setIsSignUp(!isSignUp); setError(''); }} className="text-sm text-primary hover:underline">
                {isSignUp ? 'Already have an account? Login' : 'New pandit? Create account'}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
