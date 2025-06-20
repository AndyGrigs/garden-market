import { useSearchParams, Link } from "react-router-dom";
import { useVerifyEmailMutation } from "../store/api/authApi";
import { useEffect } from "react";
import { Home } from "lucide-react";

const VerifyEmail = () => {
  const [params] = useSearchParams();
  const [verifyEmail, { isLoading, isError, isSuccess, data }] =
    useVerifyEmailMutation();

  useEffect(() => {
    const token = params.get("token");
    if (token) {
      verifyEmail({ token });
    }
  }, [params, verifyEmail]);

  useEffect(() => {
    if (isSuccess && data) {
      alert(data.message);
    }

    if (isError) {
      alert("Verification failed");
    }
  }, [isSuccess, isError, data]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <Home className="h-5 w-5" />
            <span>Main Page</span>
          </Link>
        </div>
        
        {isLoading && (
          <div>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Verifying your email...</p>
          </div>
        )}
        
        {isSuccess && data && (
          <div>
            <div className="text-green-600 text-5xl mb-4">✓</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Email Confirmed!</h2>
            <p className="text-gray-600 mb-6">{data.message}</p>
          </div>
        )}
        
        {isError && (
          <div>
            <div className="text-red-600 text-5xl mb-4">✗</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Verification Failed</h2>
            <p className="text-gray-600 mb-6">There was a problem confirming your email.</p>
          </div>
        )}
        
        {!isLoading && !isSuccess && !isError && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Email Verification</h2>
            <p className="text-gray-600">Processing verification...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;