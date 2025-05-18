import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Container } from "@/components/ui/container";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const faqs = [
    {
      question: "What are the requirements to rent a vehicle?",
      answer: "To rent a vehicle, you must be at least 21 years old (25 for premium vehicles), possess a valid driver's license, provide a valid credit card in your name, and meet our insurance requirements. International customers may need to provide additional documentation."
    },
    {
      question: "How do I make a reservation?",
      answer: "You can make a reservation through our website by selecting your desired vehicle, location, and rental dates. You can also call our customer service at +1 (555) 123-4567 to make a reservation over the phone."
    },
    {
      question: "What is your cancellation policy?",
      answer: "For cancellations made more than 48 hours before pickup, you'll receive a full refund. Cancellations made 24-48 hours before pickup receive a 50% refund. Cancellations less than 24 hours before pickup are non-refundable. No-shows are charged the full reservation amount."
    },
    {
      question: "Do you offer insurance options?",
      answer: "Yes, we offer several insurance options including Collision Damage Waiver (CDW), Supplemental Liability Insurance (SLI), Personal Accident Insurance (PAI), and Personal Effects Coverage (PEC). These can be added during the reservation process or at the time of pickup."
    },
    {
      question: "Can I add an additional driver to my rental?",
      answer: "Yes, additional drivers can be added to your rental agreement. Each additional driver must meet our rental requirements and be present at the time of pickup to show their valid driver's license. An additional driver fee may apply."
    },
    {
      question: "What happens if I return the vehicle late?",
      answer: "Late returns may incur additional charges. If you know you'll be returning the vehicle later than scheduled, please contact us as soon as possible to extend your rental and avoid unnecessary fees."
    },
    {
      question: "Do I need to refill the gas tank before returning?",
      answer: "Yes, vehicles should be returned with the same fuel level as at pickup. If the vehicle is returned with less fuel, you'll be charged for refueling plus a service fee. We also offer a prepaid fuel option that allows you to return the vehicle with any amount of fuel."
    },
    {
      question: "What should I do in case of an accident?",
      answer: "In case of an accident, ensure everyone's safety first and call emergency services if needed. Then, contact our 24/7 emergency line at +1 (555) 987-6543. Document the incident with photos and collect information from other parties involved. A detailed accident report must be filed regardless of fault."
    },
    {
      question: "Can I pick up the vehicle in one location and return it to another?",
      answer: "Yes, one-way rentals are available between many of our locations. Please note that a one-way fee may apply, which varies based on the pickup and drop-off locations."
    },
    {
      question: "Do you offer roadside assistance?",
      answer: "Yes, all our rentals include 24/7 roadside assistance for emergencies such as flat tires, dead batteries, lockouts, and mechanical failures. For roadside assistance, call our emergency number: +1 (555) 987-6543."
    },
    {
      question: "Are there mileage restrictions?",
      answer: "Most of our standard rentals include unlimited mileage. However, certain specialty vehicles or long-term rentals may have mileage restrictions. Any mileage limitations will be clearly stated in your rental agreement."
    },
    {
      question: "Can I rent a car without a credit card?",
      answer: "A credit card is required for the security deposit. We accept major credit cards including Visa, MasterCard, American Express, and Discover. Debit cards may be accepted for payment but not for the security deposit."
    },
    {
      question: "What is your minimum rental period?",
      answer: "Our minimum rental period is typically 24 hours. However, we do offer hourly rentals in select locations for certain vehicle types. Contact your local branch for specific availability."
    },
    {
      question: "Do you offer child safety seats?",
      answer: "Yes, we offer child safety seats, booster seats, and infant carriers for rent. These can be reserved during the booking process or added at the time of pickup, subject to availability. All child safety equipment meets current safety standards."
    },
    {
      question: "How old do I need to be to rent a luxury or specialty vehicle?",
      answer: "Renters must be at least 25 years old to rent luxury, specialty, or premium vehicles. Additional security deposits may also be required for these vehicle categories."
    }
  ];
  
  const filteredFAQs = searchQuery.trim() === "" 
    ? faqs 
    : faqs.filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      );

  return (
    <>
      <Navbar />
      <Container className="py-16 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight mb-6">Frequently Asked Questions</h1>
          
          <div className="mb-10">
            <p className="text-lg mb-6">
              Find answers to the most common questions about our vehicle rental services. 
              If you can't find what you're looking for, please don't hesitate to 
              <a href="/contact-us" className="text-primary font-medium hover:underline"> contact us</a>.
            </p>
            
            <div className="relative mb-8">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search FAQs..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-7 px-2"
                  onClick={() => setSearchQuery("")}
                >
                  Clear
                </Button>
              )}
            </div>
            
            {filteredFAQs.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-lg text-muted-foreground">No FAQs match your search criteria.</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setSearchQuery("")}
                >
                  Clear Search
                </Button>
              </div>
            ) : (
              <Accordion type="single" collapsible className="w-full">
                {filteredFAQs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left font-medium">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </div>
          
          <div className="bg-muted p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Still have questions?</h2>
            <p className="mb-4">Our customer support team is ready to help you with any other questions you might have.</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild>
                <a href="/contact-us">Contact Us</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="tel:+15551234567">Call Support</a>
              </Button>
            </div>
          </div>
        </div>
      </Container>
      <Footer />
    </>
  );
}
