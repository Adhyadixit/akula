import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Container } from "@/components/ui/container";

export default function TermsOfServicePage() {
  return (
    <>
      <Navbar />
      <Container className="py-16 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight mb-6">Terms of Service</h1>
          <p className="text-muted-foreground mb-8">Last Updated: May 18, 2025</p>
          
          <div className="prose prose-lg max-w-none">
            <p>
              Welcome to Akula Rentals. Please read these Terms of Service carefully before using our website 
              or vehicle rental services. By accessing or using our service, you agree to be bound by these Terms.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing this website, you are agreeing to be bound by these Terms of Service, all applicable laws 
              and regulations, and agree that you are responsible for compliance with any applicable local laws. If you 
              do not agree with any of these terms, you are prohibited from using or accessing this site.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">2. Rental Agreement</h2>
            <p>
              When you make a reservation through our website, you are entering into a rental agreement with Akula Rentals. 
              The specific terms of your rental will be provided at the time of reservation and pickup.
            </p>
            <p>
              All renters must:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Be at least 21 years of age (25 for certain premium vehicles)</li>
              <li>Possess a valid driver's license</li>
              <li>Provide a valid credit card in their name</li>
              <li>Meet our insurance requirements</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">3. Reservations and Cancellations</h2>
            <p>
              Reservations can be made through our website or by contacting our customer service. A valid credit card 
              is required to secure all reservations.
            </p>
            <p>
              Cancellation policies:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Cancellations made more than 48 hours before pickup: Full refund</li>
              <li>Cancellations made 24-48 hours before pickup: 50% refund</li>
              <li>Cancellations made less than 24 hours before pickup: No refund</li>
              <li>No-shows: Full charge for the reservation</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">4. Vehicle Use</h2>
            <p>
              Our vehicles may only be used for lawful purposes and in accordance with all traffic laws and regulations. 
              The following are strictly prohibited:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Using the vehicle for any illegal activity</li>
              <li>Driving under the influence of alcohol or drugs</li>
              <li>Using the vehicle for commercial purposes without prior authorization</li>
              <li>Allowing unauthorized drivers to operate the vehicle</li>
              <li>Taking the vehicle outside of the agreed-upon geographic boundaries</li>
              <li>Towing or pushing anything with the vehicle</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">5. Damages and Liability</h2>
            <p>
              You are responsible for any damage to the vehicle during your rental period, regardless of fault. 
              This includes but is not limited to:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Collision damage</li>
              <li>Theft or vandalism</li>
              <li>Interior damage</li>
              <li>Tire damage</li>
              <li>Windshield damage</li>
            </ul>
            <p>
              We offer various insurance options to limit your liability. These options will be presented during 
              the reservation process.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">6. Fees and Charges</h2>
            <p>
              In addition to the base rental rate, you may be responsible for:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Fuel charges if the vehicle is not returned with the same fuel level as at pickup</li>
              <li>Late return fees</li>
              <li>Cleaning fees for excessive dirt or odors</li>
              <li>Traffic or parking violations incurred during your rental</li>
              <li>Toll charges</li>
              <li>Additional driver fees</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">7. Website Use</h2>
            <p>
              The content of the pages of this website is for your general information and use only. It is subject to 
              change without notice. This website uses cookies to monitor browsing preferences.
            </p>
            <p>
              Neither we nor any third parties provide any warranty or guarantee as to the accuracy, timeliness, 
              performance, completeness or suitability of the information and materials found or offered on this website 
              for any particular purpose.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">8. Intellectual Property</h2>
            <p>
              All content included on this website, such as text, graphics, logos, images, as well as the compilation 
              thereof, and any software used on this website, is the property of Akula Rentals or its suppliers 
              and protected by copyright and intellectual property laws.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">9. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, Akula Rentals shall not be liable for any direct, indirect, 
              incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether 
              incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting from:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Your access to or use of or inability to access or use the service</li>
              <li>Any conduct or content of any third party on the service</li>
              <li>Any content obtained from the service</li>
              <li>Unauthorized access, use, or alteration of your transmissions or content</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">10. Governing Law</h2>
            <p>
              These Terms shall be governed and construed in accordance with the laws of India, 
              without regard to its conflict of law provisions. Any dispute arising under or relating in any way to 
              these Terms will be resolved exclusively in the courts located in India.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">11. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. We will notify users of any changes by updating 
              the "Last Updated" date at the top of this page. Your continued use of the website after any such changes 
              constitutes your acceptance of the new Terms.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">12. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at:
            </p>
            <p className="mt-4">
              <strong>Email:</strong> info@akularentals.in<br />
              <strong>Phone:</strong> +919534750504<br />
              <strong>Address:</strong> <a href="https://maps.app.goo.gl/XnQnu1gcfS8uP96L7" target="_blank" rel="noopener noreferrer" className="hover:underline">View on Google Maps</a>
            </p>
          </div>
        </div>
      </Container>
      <Footer />
    </>
  );
}
