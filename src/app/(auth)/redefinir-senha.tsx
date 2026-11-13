import { Redirect, useLocalSearchParams } from "expo-router";

export default function RedefinirSenhaRedirect() {
  const { token } = useLocalSearchParams<{ token?: string }>();

  return (
    <Redirect
      href={{
        pathname: "/resetPassword",
        params: { token },
      }}
    />
  );
}