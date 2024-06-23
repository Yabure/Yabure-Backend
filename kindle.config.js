import * as Linking from "expo-linking";
const prefix = Linking.makeUrl("/");
const kindeConfig = {
  KINDE_ISSUER_URL: "https://yabure.kinde.com",
  KINDE_POST_CALLBACK_URL: prefix + "KindeScreen", // f.e: exp://127.0.0.1:19000
  KINDE_CLIENT_ID: "e13cb1a15b5442a8a8ab693222bbbffb",
  KINDE_POST_LOGOUT_REDIRECT_URL: "exp://127.0.0.1:8000",
  KINDE_BASE_API: "https://yabure.kinde.com/oauth2/",
};

export default kindeConfig;
