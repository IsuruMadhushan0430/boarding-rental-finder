const args = process.argv.slice(2);

const getArg = (name) => {
  const prefix = `${name}=`;
  return args.find((arg) => arg.startsWith(prefix))?.slice(prefix.length);
};

const email = getArg("email") || process.env.ADMIN_EMAIL;
const password = getArg("password") || process.env.ADMIN_PASSWORD;
const baseUrl = process.env.API_URL || "http://localhost:5000";

if (!email || !password) {
  throw new Error("Email and password are required");
}

const verifyLogin = async () => {
  const response = await fetch(`${baseUrl}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login verification failed");
  }

  if (data.user?.role !== "admin") {
    throw new Error(`Unexpected account role: ${data.user?.role}`);
  }

  console.log(`Admin login verified: ${data.user.email}`);
};

verifyLogin().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
