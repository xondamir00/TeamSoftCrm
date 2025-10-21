import { Link } from "react-router-dom";
import { Input } from "../ui/input";

const Login = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form className="bg-white p-6 w-full max-w-sm rounded-lg shadow-lg">
        <p className="text-xl font-semibold text-center text-black mb-4">
          Sign in to your account
        </p>

        <div className="mb-4">
          <Input
            className="py-6"
            type="number"
            placeholder="Enter phone number"
          />
        </div>

        <div className="mb-4">
          <Input
            className="py-6"
            type="passwwor"
            placeholder="Enter password"
          />
        </div>

        <Link to={"/"}>
          <button
            type="submit"
            className="w-full py-3 bg-[#3F8CFF] text-white text-sm font-medium uppercase rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Sign in
          </button>
        </Link>
        <p className="text-gray-500 text-sm text-center mt-4">
          No account?{" "}
          <a
            href="#"
            className="text-indigo-600 underline hover:text-indigo-800"
          >
            Sign up
          </a>
        </p>
      </form>
    </div>
  );
};

export default Login;
