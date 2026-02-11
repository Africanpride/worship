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

interface NewsletterConfirmationEmailProps {
  name?: string;
  confirmationToken?: string;
  unsubscribeToken?: string;
}

export const NewsletterConfirmationEmail = ({
  name,
  confirmationToken,
}: NewsletterConfirmationEmailProps) => {
  const previewText = `Confirm your subscription to COSTrAD newsletters`;

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
              Thank you for subscribing to the{" "}
              <strong>COSTrAD Newsletter</strong>!
            </Text>

            <Text className="text-sm leading-6">
              To complete your subscription and start receiving updates, please
              confirm by clicking the button below:
            </Text>

            <Link
              href={`${baseUrl}api/newsletter/confirm/${confirmationToken}`}
              className="text-white bg-blue-600 px-4 py-2 rounded mt-4 inline-block"
            >
              Confirm Subscription
            </Link>

            <div className="text-sm leading-6 mt-4">
              {`${baseUrl}api/newsletter/confirm/${confirmationToken}`}
            </div>

            <Text className="text-sm leading-6 mt-4">
              If you did not request this subscription, you can safely ignore
              this email.
            </Text>

            <Text className="text-xs text-muted mt-6">
              For questions, contact us at{" "}
              <Link href="mailto:correspondence@costrad.org">
                correspondence@costrad.org
              </Link>
              .
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
