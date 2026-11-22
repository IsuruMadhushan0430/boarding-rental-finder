import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

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
      setError(
        err.response?.data?.message ||
        "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">

      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">

        <h1 className="text-3xl font-bold text-center text-blue-700">
          BoardingHub
        </h1>

        <p className="text-center text-gray-500 mt-2">
          Login to your account
        </p>

        {error && (
          <p className="mt-4 text-red-600 text-sm">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-3"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full border rounded-lg p-3"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-700 text-white p-3 rounded-lg hover:bg-blue-800 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <p className="text-center text-sm mt-6">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-700 font-semibold">
            Register
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;