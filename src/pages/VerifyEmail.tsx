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

  return <div>{isLoading ? "Verifying email..." : "VerifyEmail"}</div>;
};

export default VerifyEmail;
