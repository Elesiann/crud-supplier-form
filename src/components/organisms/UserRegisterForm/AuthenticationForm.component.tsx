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
import { useForm } from "react-hook-form";
import { useAuth } from "../../../hooks/useAuth";
import theme from "../../../theme/theme";
import { AuthenticationType, IAuthentication } from "../../../types/Authentication.type";
import { authenticationHandler, googleSignInHandler } from "../../../utils/authentication_handler";
import { GoogleButton } from "../../atoms/GoogleButton/GoogleButton.component";
import { loginSchema, registerSchema } from "../../pages/authentication/authentication.schemas";
import { googleProvider } from "./firebase";

export function AuthenticationForm(props: PaperProps) {
  const [type, toggle] = useToggle([AuthenticationType.LOGIN, AuthenticationType.REGISTER]);
  const [openedLoading, { open: openLoading, close: closeLoading }] = useDisclosure(false);
  const { login: authLogin } = useAuth();

  const getValidationSchema = type === AuthenticationType.REGISTER ? registerSchema : loginSchema;

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<IAuthentication>({
    resolver: yupResolver(getValidationSchema as any),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const onSubmit = async (data: IAuthentication) => {
    console.log(data);
    openLoading();
    await authenticationHandler(data, type, authLogin, closeLoading);
  };

  const loginWithGoogle = async () => {
    openLoading();
    await googleSignInHandler(googleProvider, authLogin, closeLoading);
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
          <Button
            w={{
              base: "100%",
              sm: "auto"
            }}
            type="submit"
          >
            <Text fw={600} c={theme.color.primary.white}>
              {upperFirst(type)}
            </Text>
          </Button>
        </Group>
      </form>
    </Paper>
  );
}
