import { yupResolver } from "@hookform/resolvers/yup";
import {
  Anchor,
  Button,
  Checkbox,
  Divider,
  Group,
  Image,
  Paper,
  PaperProps,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title
} from "@mantine/core";
import { upperFirst, useToggle } from "@mantine/hooks";
import { useGoogleLogin } from "@react-oauth/google";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import Google from "../../../api/Google";
import { useAuth } from "../../../hooks/useAuth";
import theme from "../../../theme/theme";
import { handleNotification } from "../../../utils/notification";
import { GoogleButton } from "../../atoms/GoogleButton/GoogleButton.component";
interface IAuthentication {
  email: string;
  password: string;
  name: string;
  terms: boolean;
}

const AuthenticationFormSchema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(6).required(),
  name: yup.string().required(),
  terms: yup.boolean().required()
});

export function AuthenticationForm(props: PaperProps) {
  const [type, toggle] = useToggle(["login", "register"]);
  const { login: authLogin } = useAuth();

  const { register, handleSubmit } = useForm<IAuthentication>({
    resolver: yupResolver(AuthenticationFormSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      terms: false
    }
  });

  const onSubmit = (data: any) => {
    console.log(data);
  };

  const login = useGoogleLogin({
    onSuccess: async (response) =>
      await Google.getUserInfo(response.access_token).then((res) => authLogin(res)),
    onError: (error) =>
      handleNotification("Error in Google authentication", JSON.stringify(error), "red")
  });

  return (
    <Paper radius="md" {...props}>
      <Image src={"/logo_dark.png"} />

      <Title order={2} ta={"center"}>
        Welcome! {upperFirst(type)} with
      </Title>

      <Group grow mb="md" mt="md">
        <GoogleButton
          onClick={() => login()}
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
            <TextInput required label="Name" placeholder="Your name" {...register("name")} />
          )}

          <TextInput
            required
            label="Email"
            placeholder="johndoe@example.com"
            {...register("email")}
          />

          <PasswordInput
            required
            label="Password"
            placeholder="Your password"
            {...register("password")}
          />

          {type === "register" && (
            <Checkbox label="I accept terms and conditions" {...register("terms")} />
          )}
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
