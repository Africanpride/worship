import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Text,
  Tailwind,
  Link,
} from "@react-email/components";
import { baseUrl } from "../metadata";

interface NewsletterAppreciationEmailProps {
  name?: string;
  unsubscribeToken?: string;
}

export const NewsletterAppreciationEmail = ({
  name,
  unsubscribeToken,
}: NewsletterAppreciationEmailProps) => {
  const previewText = `Thank you for joining the COSTrAD Newsletter!`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-white text-black font-sans">
          <Container className="my-10 px-6 py-8 border rounded-md shadow-md max-w-xl">
            <Text className="text-sm leading-6">
              {name ? `Dear ${name},` : "Hello,"}
            </Text>

            <Text className="text-sm leading-6">
              <strong>Thank you for subscribing</strong> to the <strong>COSTrAD Newsletter</strong>!
            </Text>

            <Text className="text-sm leading-6">
              We're excited to have you on board. You’ll now receive regular updates, insights, and research straight from the COSTrAD team.
            </Text>

            <Text className="text-sm leading-6 mt-4">
              If at any time you have questions or feedback, we’d love to hear from you.
            </Text>

            <Text className="text-xs text-muted mt-6">
              Contact us at{" "}
              <Link href="mailto:correspondence@costrad.org">
                correspondence@costrad.org
              </Link>
              .
            </Text>

            {unsubscribeToken && (
              <Text className="text-[11px] text-muted mt-4">
                If you no longer wish to receive these emails, you can unsubscribe at any time by clicking{" "}
                <Link
                  href={`${baseUrl}api/newsletter/unsubscribe/${unsubscribeToken}`}
                  className="underline"
                >
                  here
                </Link>
                .
              </Text>
            )}
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
