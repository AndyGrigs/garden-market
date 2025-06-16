import { useSearchParams } from "react-router-dom";
import { useVerifyEmailMutation } from "../store/api/authApi";
import { useEffect } from "react";

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
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      {isLoading && <p>Verifying your email...</p>}
      {isSuccess && data && (
        <>
          <h2>Email Confirmed!</h2>
          <p>{data.message}</p>
          <a href="/" style={{ display: "inline-block", marginTop: "1rem", padding: "0.5rem 1.5rem", background: "#4caf50", color: "#fff", borderRadius: "4px", textDecoration: "none" }}>
            Return to Main Page
          </a>
        </>
      )}
      {isError && (
        <>
          <h2>Verification Failed</h2>
          <p>There was a problem confirming your email.</p>
          <a href="/" style={{ display: "inline-block", marginTop: "1rem", padding: "0.5rem 1.5rem", background: "#f44336", color: "#fff", borderRadius: "4px", textDecoration: "none" }}>
            Return to Main Page
          </a>
        </>
      )}
      {!isLoading && !isSuccess && !isError && <p>VerifyEmail</p>}
    </div>
  );
};

export default VerifyEmail;
