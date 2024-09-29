import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile
} from "firebase/auth";
import { auth } from "../components/organisms/UserRegisterForm/firebase";
import { IUser } from "../hooks/useAuth";
import { AuthenticationType, IAuthentication } from "../types/Authentication.type";
import { handleNotification } from "./notification";

export const authenticationHandler = async (
  data: IAuthentication,
  authType: AuthenticationType,
  login: (data: IUser) => void,
  finallyCallback?: () => void
) => {
  console.log(authType);
  if (authType === AuthenticationType.REGISTER) {
    await createUserWithEmailAndPassword(auth, data.email, data.password)
      .then((res) =>
        updateProfile(res.user, {
          displayName: data.name
        })
      )
      .then(() => {
        const userData: IUser = {
          name: data.name || "",
          email: data.email,
          id: data.email
        };

        login(userData);
      })
      .catch((error) => handleNotification("Error in authentication", JSON.stringify(error), "red"))
      .finally(() => {
        if (finallyCallback) {
          finallyCallback();
        }
      });

    return;
  }

  await signInWithEmailAndPassword(auth, data.email, data.password)
    .then((res) => {
      const userData: IUser = {
        name: res.user?.displayName || "",
        email: res.user?.email || "",
        id: res.user?.email || ""
      };
      login(userData);
    })
    .catch((error) => {
      let errMsg = "";

      const mappedErrors = [
        { code: "auth/invalid-credential", message: "Invalid credentials. Please try again." },
        { code: "auth/user-not-found", message: "User not found." },
        { code: "auth/wrong-password", message: "Wrong password." },
        { code: "auth/too-many-requests", message: "Too many requests. Please try again later." }
      ];

      mappedErrors.forEach((err) => {
        if (error.code === err.code) {
          errMsg = err.message;
        }
      });

      handleNotification("Error trying to login", errMsg, "red");
    })
    .finally(() => {
      if (finallyCallback) {
        finallyCallback();
      }
    });
};

export const googleSignInHandler = async (
  googleProvider: GoogleAuthProvider,
  login: (data: IUser) => void,
  finallyCallback?: () => void
) => {
  signInWithPopup(auth, googleProvider)
    .then((result) => {
      const user = result.user;
      if (user.displayName && user.email) {
        const userData: IUser = {
          name: user.displayName,
          email: user.email,
          id: user.email
        };
        login(userData);
      }
    })
    .catch((error) => {
      handleNotification("Error in Google authentication", JSON.stringify(error), "red");
    })
    .finally(() => {
      if (finallyCallback) {
        finallyCallback();
      }
    });
};
