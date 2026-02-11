// emails/VerifyEmail.tsx
import * as React from "react";
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Button,
} from "@react-email/components";

interface VerifyEmailProps {
  username?: string;
  verifyLink: string;
}

export const VerifyEmail = ({ username = "there", verifyLink }: VerifyEmailProps) => (
  <Html>
    <Head />
    <Preview>Verify your COSTrAD email address</Preview>
    <Body style={{ backgroundColor: "#f4f4f4", fontFamily: "Arial, sans-serif" }}>
      <Container style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
        <Section style={{ backgroundColor: "#ffffff", padding: "30px", borderRadius: "8px", boxShadow: "0 0 10px rgba(0,0,0,0.05)" }}>
          <Text style={{ fontSize: "20px", fontWeight: "bold", color: "#2c3e50" }}>
            Welcome to COSTrAD
          </Text>
          <Text style={{ fontSize: "16px", color: "#333" }}>
            Hi {username},
          </Text>
          <Text style={{ fontSize: "16px", color: "#333" }}>
            Please confirm your email address to activate your account.
          </Text>
          <Button
            href={verifyLink}
            style={{
              backgroundColor: "#2c3e50",
              color: "#ffffff",
              padding: "12px 24px",
              fontSize: "16px",
              borderRadius: "6px",
              textDecoration: "none",
              display: "inline-block",
              marginTop: "20px",
            }}
          >
            Verify Email
          </Button>
          <Text style={{ fontSize: "14px", color: "#888", marginTop: "30px" }}>
            Or copy and paste this link into your browser:
            <br />
            <a href={verifyLink} style={{ color: "#2c3e50" }}>{verifyLink}</a>
          </Text>
        </Section>
        <Text style={{ textAlign: "center", fontSize: "12px", color: "#aaa", marginTop: "20px" }}>
          If you didn’t sign up for a COSTrAD account, you can safely ignore this email.
        </Text>
      </Container>
    </Body>
  </Html>
);

export default VerifyEmail;
