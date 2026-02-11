// emails/welcome-to-institute.tsx
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Tailwind,
  Link,
  Section,
} from "@react-email/components";

interface WelcomeToInstituteEmailProps {
  name: string;
  editionTitle: string;
  instituteName: string;
  startDate: string; // should be formatted as "Month Day, Year"
  endDate: string;
  dashboardLink: string;
}

export const WelcomeToInstituteEmail = ({
  name,
  editionTitle,
  instituteName,
  startDate,
  endDate,
  dashboardLink,
}: WelcomeToInstituteEmailProps) => {
  const previewText = `Welcome to ${editionTitle} at ${instituteName}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-white text-black font-sans">
          <Container className="my-10 px-6 py-8 border rounded-md shadow-md max-w-xl">
            {/* <Heading className="text mb-6 font-bold ">
              Welcome to {editionTitle}
            </Heading> */}

            <Text className="text-sm leading-6">Dear {name},</Text>

            <Text className="text-sm leading-6">
              Thank you for registering for The <strong>{instituteName}</strong> (<strong>{editionTitle}</strong>).
            </Text>

            <Text className="text-sm leading-6">
              The program begins on <strong>{startDate}</strong> and will end on{" "}
              <strong>{endDate}</strong>. We're excited to have you onboard and
              look forward to a transformative experience together.
            </Text>

            <Section className="text-center my-6">
              <Link
                href={dashboardLink}
                className="inline-block bg-black text-white px-4 py-2 rounded text-sm"
              >
                Go to Dashboard
              </Link>
            </Section>

            <Text className="text-xs text-gray-600 mt-6">
              If you have any questions or need further clarification about your
              registration, please don't hesitate to get in touch with us. Our support team ({" "}
              <a className="text-primary" href="mailto:correspondence@costrad.org">
                correspondence@costrad.org, 
              </a>{" "}
              <a className="text-primary" href="tel:+233200201334">
               Phone: +233200201334 (Office Hours: Mon–Fri, 9AM–4PM GMT)
              </a>{" "} )
              is always available and ready to assist you with any concerns or
              inquiries you may have.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
