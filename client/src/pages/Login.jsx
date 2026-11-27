
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import loginHouse from "../assets/login.jpg";
import logo from "../assets/logo.png";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      const data = await login(formData);

      if (data.user.role === "landlord") {
        navigate("/landlord/dashboard");
      } else if (data.user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (data.user.role === "seeker") {
        navigate("/my-inquiries");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white lg:grid lg:grid-cols-2">

      {/* LEFT SIDE - IMAGE SECTION */}
      <div
        className="relative flex min-h-[360px] items-end bg-cover bg-center px-7 py-10 sm:min-h-[380px] sm:px-12 lg:min-h-screen lg:px-16 lg:py-16"
        style={{ backgroundImage: `url(${loginHouse})` }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10" />

        {/* Branding */}
        <div className="absolute left-7 top-7 z-10 sm:left-12 sm:top-10 lg:left-16">
          <img
            src={logo}
            alt="BoardingHub"
            className="w-36 rounded-lg shadow-xl ring-1 ring-black/10"
          />
        </div>

        {/* Hero content */}
        <div className="relative z-10 max-w-xl text-white">
          <span className="mb-4 inline-block rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-medium tracking-wider backdrop-blur-sm">
            FIND YOUR PERFECT PLACE
          </span>

          <h1 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            Find Your
            <br />
            <span className="text-orange-400">Perfect Home.</span>
          </h1>

          <p className="mt-4 max-w-md text-sm leading-7 text-gray-200 sm:text-base">
            Discover boarding places and rental properties that match your
            lifestyle. Your next home is just a few clicks away.
          </p>

          <div className="mt-7 flex items-center gap-5 text-sm text-gray-200">
            <div>
              <span className="block text-xl font-bold text-white">Easy</span>
              <span>Property search</span>
            </div>

            <div className="h-9 w-px bg-white/30" />

            <div>
              <span className="block text-xl font-bold text-white">Fast</span>
              <span>Contact landlords</span>
            </div>

            <div className="h-9 w-px bg-white/30" />

            <div>
              <span className="block text-xl font-bold text-white">Simple</span>
              <span>Find your place</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - LOGIN FORM */}
      <div className="flex min-h-[600px] items-center justify-center px-6 py-12 sm:px-12 lg:min-h-screen lg:px-16">
        <div className="w-full max-w-md">

          {/* Heading */}
          <div className="mb-9">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-orange-500">
              Welcome Back
            </p>

            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Login to your account
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-500">
              Welcome back! Please enter your details to continue.
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Login form */}
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Email Address
              </label>

              <input
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-gray-400 hover:border-gray-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Password
              </label>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3.5 pr-14 text-sm text-slate-900 outline-none transition placeholder:text-gray-400 hover:border-gray-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-orange-500"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                >
                  {showPassword ? (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="h-5 w-5"
                    >
                      <path d="M3 3l18 18" />
                      <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                      <path d="M9.9 5.2A11 11 0 0 1 12 5c5 0 9 5 10 7-.4.8-1.3 2-2.7 3.2" />
                      <path d="M6.2 6.2C3.8 7.7 2.4 10 2 12c.5 1 4 7 10 7 1 0 2-.2 2.9-.6" />
                    </svg>
                  ) : (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="h-5 w-5"
                    >
                      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-3">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 accent-orange-500"
                />
                Remember Me
              </label>
            </div>

            {/* Login button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-orange-500 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition duration-200 hover:-translate-y-0.5 hover:bg-orange-600 hover:shadow-orange-500/30 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login to BoardingHub"}
            </button>
          </form>

          {/* Register link */}
          <div className="mt-9 text-center">
            <p className="text-sm text-gray-500">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-orange-500 transition hover:text-orange-600"
              >
                Register Now
              </Link>
            </p>
          </div>

          {/* Footer */}
          <div className="mt-12 border-t border-gray-100 pt-6 text-center">
            <p className="text-xs tracking-wide text-gray-400">
              FIND YOUR PLACE. FEEL AT HOME.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;
