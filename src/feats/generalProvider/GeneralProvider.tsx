import { AuthProvider } from "@/feats/authentication";
import { GlobalProvider } from "@/feats/globalState";
import { ThemeProvider } from "@/feats/styles";
import { ParentComponent } from "solid-js";

export const GeneralProvider:ParentComponent = ( props ) => {
  return (
    <AuthProvider>
      <GlobalProvider>
        <ThemeProvider>
          { props.children || <p>fu</p> }
        </ThemeProvider>
      </GlobalProvider>
    </AuthProvider>
  );
};