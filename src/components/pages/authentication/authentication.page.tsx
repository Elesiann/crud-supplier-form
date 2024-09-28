import styled from "styled-components";
import { AuthenticationForm } from "../../organisms/UserRegisterForm/AuthenticationForm.component";
import { useEffect } from "react";
import { useAuth } from "../../../hooks/useAuth";

export function AuthenticationPage() {
  const { user } = useAuth();
  useEffect(() => {
    if (user) {
      window.location.href = "/main";
    }
  }, []);

  return (
    <Wrapper>
      <Content>
        <AuthenticationForm />
      </Content>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  min-height: 100dvh;
  background-size: cover;
  background-position: center;
  background-image: url(https://images.unsplash.com/photo-1504376830547-506dedfe1fe9?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D);
`;

const Content = styled.div`
  min-height: 100dvh;
  max-width: 450px;
  padding-top: 80px;
  background-color: ${(props) => props.theme.color.primary.white};
  padding: 2rem;

  img {
    max-width: 250px;
    margin: 0 auto 2rem auto;
  }

  h2,
  label,
  span,
  p {
    color: ${(props) => props.theme.color.secondary.gray};
  }

  a {
    font-weight: 600;
    color: ${(props) => props.theme.color.primary.lightBlue};
  }

  @media (max-width: $mantine-breakpoint-sm) {
    max-width: 100%;
  }
`;
