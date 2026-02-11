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

interface AdminApprovalRequestEmailProps {
  adminName: string;
  applicantName: string;
  editionTitle: string;
  instituteName: string;
  startDate: string; // format: "Month Day, Year"
  endDate: string;
  approvalLink?: string;
  dashboardLink?: string;
}

export const AdminApprovalRequestEmail = ({
  adminName,
  applicantName,
  editionTitle,
  instituteName,
  startDate,
  endDate,
  dashboardLink = "https://www.costrad.org/admin/registrations",

}: AdminApprovalRequestEmailProps) => {
  const previewText = `Approval needed: ${applicantName} applied for ${editionTitle}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-white text-black font-sans">
          <Container className="my-10 px-6 py-8 border rounded-md shadow-md max-w-xl">
            <Heading className="text-xl mb-6 font-bold">
              Approval Needed: New Registration Request
            </Heading>

            <Text className="text-sm leading-6">
              Hello {adminName},
            </Text>

            <Text className="text-sm leading-6">
              A new applicant, <strong>{applicantName}</strong>, has registered for the upcoming program:
            </Text>

            <Text className="text-sm leading-6">
              <strong>Institute:</strong> {instituteName}<br />
              <strong>Edition:</strong> {editionTitle}<br />
              <strong>Start Date:</strong> {startDate}<br />
              <strong>End Date:</strong> {endDate}
            </Text>

            <Text className="text-sm leading-6">
              Please review and approve their registration at your earliest convenience.
            </Text>

            <Section className="text-center my-6">
              <Link
                href={dashboardLink}
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded text-sm"
              >
                Review & Approve Registration
              </Link>
            </Section>

            <Text className="text-xs text-gray-600 mt-6">
              If you need any assistance or encounter issues accessing the dashboard, please contact support at{" "}
              <a className="text-primary" href="mailto:correspondence@costrad.org">
                correspondence@costrad.org
              </a> or call us on{" "}
              <a className="text-primary" href="tel:+233200201334">
                +233200201334
              </a>{" "}
              (Mon–Fri, 9AM–4PM GMT).
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
