import { SubmitHandler }    from "react-hook-form";
import Instagram            from "@/assets/images/instagram-logo.svg?react";
import { IPostLogin, useLoginMutation } from "@/redux/api/authApi";
import LoginForm            from "@/components/login/LoginForm";
import LoginErrorMessage    from "@/components/login/LoginErrorMessage";
import LoginSignUpPrompt    from "@/components/login/LoginSignUpPrompt";
import LoginFooter          from "@/components/login/LoginFooter";

function Login() {
  const [login, { isError, error }] = useLoginMutation({
    fixedCacheKey: "login-api",
  });

  const onSubmit: SubmitHandler<IPostLogin> = (data) => {
    const userCredentials = data.userCredentials;
    const password = data.password;
    console.log(userCredentials, password);
    login({ userCredentials, password });
  };

  return (
    <div className="login__container">
      <div className="login__wrapper">
        <div className="login__parent">
          <Instagram style={{ margin: "10px 0 40px 0" }} />
          <LoginForm onSubmit={onSubmit} />
          <LoginErrorMessage
            isError={isError}
            error={error}
          />
        </div>
        <LoginSignUpPrompt />
      </div>
        <LoginFooter />
    </div>
  );
}

export default Login;
