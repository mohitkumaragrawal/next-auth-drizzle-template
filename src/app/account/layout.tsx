import Container from "@/components/container";
import { Heading1 } from "@/components/typography";
import React from "react";

interface Props {
  children: React.ReactNode;
}

export default function AccountLayout({ children }: Props) {
  return (
    <Container>
      <Heading1 subheading="Customize your account settings" className="mb-8">
        Account Settings
      </Heading1>

      {children}
    </Container>
  );
}
