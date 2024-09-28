import { yupResolver } from "@hookform/resolvers/yup";
import {
  Anchor,
  Button,
  Divider,
  Group,
  Image,
  LoadingOverlay,
  Paper,
  PaperProps,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title
} from "@mantine/core";
import { upperFirst, useDisclosure, useToggle } from "@mantine/hooks";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile
} from "firebase/auth";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { IUser, useAuth } from "../../../hooks/useAuth";
import theme from "../../../theme/theme";
import { handleNotification } from "../../../utils/notification";
import { GoogleButton } from "../../atoms/GoogleButton/GoogleButton.component";
import { auth, googleProvider } from "./firebase";

interface IAuthentication {
  email: string;
  password: string;
  name: string;
}

export function AuthenticationForm(props: PaperProps) {
  const [type, toggle] = useToggle(["login", "register"]);
  const [openedLoading, { open: openLoading, close: closeLoading }] = useDisclosure(false);
  const { login: authLogin } = useAuth();

  const loginSchema = yup.object().shape({
    email: yup.string().email("Invalid email format").required("Email is required"),
    password: yup
      .string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters long")
  });

  const registerSchema = yup.object().shape({
    name: yup.string().required("Name is required"),
    email: yup.string().email("Invalid email format").required(),
    password: yup
      .string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters long")
  });

  const getValidationSchema = type === "register" ? registerSchema : loginSchema;

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<IAuthentication>({
    resolver: yupResolver(getValidationSchema as any),
    defaultValues: {
      email: "",
      password: "",
      name: ""
    }
  });

  const onSubmit = async (data: IAuthentication) => {
    openLoading();
    if (type === "register") {
      await createUserWithEmailAndPassword(auth, data.email, data.password)
        .then((res) =>
          updateProfile(res.user, {
            displayName: data.name
          })
        )
        .then(() => {
          const userData: IUser = {
            name: data.name,
            email: data.email,
            id: data.email
          };
          authLogin(userData);
        })
        .catch((error) =>
          handleNotification("Error in authentication", JSON.stringify(error), "red")
        );

      return;
    }

    await signInWithEmailAndPassword(auth, data.email, data.password)
      .then((res) => {
        const userData: IUser = {
          name: res.user?.displayName || "",
          email: res.user?.email || "",
          id: res.user?.email || ""
        };
        authLogin(userData);
      })
      .catch((error) => {
        let errMsg = "";

        if (error.code === "auth/invalid-credential") {
          errMsg = "Invalid credentials. Please try again.";
        }
        if (error.code === "auth/user-not-found") {
          errMsg = "Usuário não encontrado";
        }
        if (error.code === "auth/wrong-password") {
          errMsg = "Senha incorreta";
        }
        if (error.code === "auth/too-many-requests") {
          errMsg = "Muitas tentativas. Tente novamente mais tarde";
        }

        handleNotification("Error trying to login", errMsg, "red");
      });

    closeLoading();
  };

  const loginWithGoogle = () => {
    openLoading();
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        const user = result.user;
        if (user.displayName && user.email) {
          const userData: IUser = {
            name: user.displayName,
            email: user.email,
            id: user.email
          };
          authLogin(userData);
        }
      })
      .catch((error) => {
        handleNotification("Error in Google authentication", JSON.stringify(error), "red");
      })
      .finally(() => {
        closeLoading();
      });
  };

  return (
    <Paper radius="md" {...props}>
      {openedLoading && (
        <LoadingOverlay visible zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
      )}

      <Image src={"/logo_dark.png"} />

      <Title order={2} ta={"center"}>
        Welcome! {upperFirst(type)} with
      </Title>

      <Group grow mb="md" mt="md">
        <GoogleButton
          onClick={() => loginWithGoogle()}
          className="google_button"
          color={theme.color.secondary.gray}
          radius="xl"
        >
          Google
        </GoogleButton>
      </Group>

      <Divider label="Or continue with email" labelPosition="center" my="lg" />

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack>
          {type === "register" && (
            <TextInput
              label="Name"
              placeholder="Your name"
              {...register("name")}
              error={errors.name?.message}
            />
          )}

          <TextInput
            label="Email"
            placeholder="johndoe@example.com"
            {...register("email")}
            error={errors?.email?.message}
          />

          <PasswordInput
            label="Password"
            placeholder="Your password"
            {...register("password")}
            error={errors?.password?.message}
          />
        </Stack>

        <Group justify="space-between" mt="xl">
          <Anchor component="button" type="button" c="dimmed" onClick={() => toggle()} size="xs">
            {type === "register"
              ? "Already have an account? Login"
              : "Don't have an account? Register"}
          </Anchor>
          <Button type="submit">
            <Text size="sm" fw={600} c={theme.color.primary.white}>
              {upperFirst(type)}
            </Text>
          </Button>
        </Group>
      </form>
    </Paper>
  );
}
