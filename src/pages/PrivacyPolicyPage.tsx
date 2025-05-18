import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Container } from "@/components/ui/container";

export default function PrivacyPolicyPage() {
  return (
    <>
      <Navbar />
      <Container className="py-16 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight mb-6">Privacy Policy</h1>
          <p className="text-muted-foreground mb-8">Last Updated: May 18, 2025</p>
          
          <div className="prose prose-lg max-w-none">
            <p>
              At Wheelie Wanderlust, we take your privacy seriously. This Privacy Policy explains how we collect, use, 
              disclose, and safeguard your information when you visit our website or use our vehicle rental services.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Information We Collect</h2>
            <p>We may collect information about you in a variety of ways including:</p>
            
            <h3 className="text-xl font-medium mt-6 mb-3">Personal Data</h3>
            <p>
              When you register on our site, make a reservation, or participate in other site features, we may collect 
              personal information such as:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Name, email address, phone number, and mailing address</li>
              <li>Driver's license information</li>
              <li>Payment information (credit card details, billing address)</li>
              <li>Date of birth</li>
              <li>Rental preferences and history</li>
            </ul>
            
            <h3 className="text-xl font-medium mt-6 mb-3">Usage Data</h3>
            <p>
              We may also collect information on how the website is accessed and used, including:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>IP address, browser type, and device information</li>
              <li>Pages visited and links clicked</li>
              <li>Time spent on pages</li>
              <li>Referring website addresses</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">How We Use Your Information</h2>
            <p>We may use the information we collect from you for purposes including:</p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Processing and managing your vehicle rentals</li>
              <li>Providing customer service and responding to inquiries</li>
              <li>Sending you promotional emails about new services, special offers, or other information</li>
              <li>Improving our website and customer experience</li>
              <li>Administering contests, promotions, surveys, or other site features</li>
              <li>Preventing fraudulent transactions and monitoring against theft</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Cookies and Tracking Technologies</h2>
            <p>
              We use cookies and similar tracking technologies to track activity on our website and hold certain information. 
              Cookies are files with small amounts of data which may include an anonymous unique identifier.
            </p>
            <p>
              You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, 
              if you do not accept cookies, you may not be able to use some portions of our service.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Third-Party Disclosure</h2>
            <p>
              We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties 
              except in the following circumstances:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>To trusted third parties who assist us in operating our website, conducting our business, or servicing you</li>
              <li>When we believe release is appropriate to comply with the law, enforce our site policies, or protect ours or others' rights, property, or safety</li>
              <li>To provide aggregate information for marketing, business development, and analytics purposes</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Data Security</h2>
            <p>
              We implement a variety of security measures to maintain the safety of your personal information when you 
              place an order or enter, submit, or access your personal information. We offer the use of a secure server. 
              All supplied sensitive information is transmitted via Secure Socket Layer (SSL) technology.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Your Rights</h2>
            <p>Depending on your location, you may have certain rights regarding your personal information, including:</p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>The right to access personal information we hold about you</li>
              <li>The right to request correction of inaccurate information</li>
              <li>The right to request deletion of your information</li>
              <li>The right to opt out of marketing communications</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new 
              Privacy Policy on this page and updating the "Last Updated" date.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <p className="mt-4">
              <strong>Email:</strong> privacy@wheeliewanderlust.com<br />
              <strong>Phone:</strong> +1 (555) 123-4567<br />
              <strong>Address:</strong> 123 Wheelie Way, Wanderlust Plaza, San Francisco, CA 94105
            </p>
          </div>
        </div>
      </Container>
      <Footer />
    </>
  );
}
