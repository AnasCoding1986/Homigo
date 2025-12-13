import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const {
    signIn,
    signInWithGoogle,
    resetPassword,
    loading,
  } = useAuth();

  // ===============================
  // Email & Password Login
  // ===============================
  const handleSubmit = async (e) => {
    e.preventDefault();
    const password = e.target.password.value;

    try {
      await signIn(email, password);
      toast.success("Sign in successful");
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ===============================
  // Google Login
  // ===============================
  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      toast.success("Logged in with Google");
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ===============================
  // Reset Password
  // ===============================
  const handleResetPassword = async () => {
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    try {
      await resetPassword(email);
      toast.success("Password reset email sent. Check inbox or spam.");
    } catch (error) {
      console.error(error.code, error.message);
      toast.error(error.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="flex flex-col max-w-md p-6 rounded-md sm:p-10 bg-gray-100">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="my-3 text-4xl font-bold">Log In</h1>
          <p className="text-sm text-gray-400">
            Sign in to access your account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-sm">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                className="w-full px-3 py-2 border rounded-md bg-gray-200"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm">Password</label>
              <input
                type="password"
                name="password"
                required
                placeholder="*******"
                className="w-full px-3 py-2 border rounded-md bg-gray-200"
              />
            </div>
          </div>

          {/* Reset Password */}
          <button
            type="button"
            onClick={handleResetPassword}
            disabled={loading}
            className="text-xs text-rose-500 hover:underline disabled:opacity-50"
          >
            Forgot password?
          </button>

          <button
            type="submit"
            disabled={loading}
            className="bg-rose-500 w-full rounded-md py-3 text-white disabled:opacity-60"
          >
            {loading ? "Loading..." : "Continue"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center pt-4 space-x-1">
          <div className="flex-1 h-px bg-gray-300"></div>
          <p className="px-3 text-sm text-gray-400">Login with social</p>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* Google Login */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="flex justify-center items-center space-x-2 border m-3 p-2 rounded-md disabled:opacity-60"
        >
          <FcGoogle size={32} />
          <p>Continue with Google</p>
        </button>

        {/* Signup */}
        <p className="px-6 text-sm text-center text-gray-400">
          Don&apos;t have an account?
          <Link to="/signup" className="ml-1 text-rose-500 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
