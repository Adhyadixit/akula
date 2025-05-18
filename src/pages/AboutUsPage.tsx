import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Container } from "@/components/ui/container";

export default function AboutUsPage() {
  return (
    <>
      <Navbar />
      <Container className="py-16 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight mb-6">About Wheelie Wanderlust</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-lg mb-6">
              Founded in 2020, Wheelie Wanderlust is a premier vehicle rental service dedicated to providing 
              exceptional mobility solutions for travelers and locals alike.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Our Mission</h2>
            <p>
              At Wheelie Wanderlust, our mission is to transform the way people experience transportation. 
              We believe that the journey matters just as much as the destination, and having the right vehicle 
              can make all the difference in creating memorable experiences.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Our Vision</h2>
            <p>
              We envision a world where mobility is seamless, sustainable, and tailored to individual needs. 
              By offering a diverse fleet of well-maintained vehicles and exceptional customer service, 
              we aim to be the first choice for anyone looking to rent a vehicle.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Our Values</h2>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li><strong>Quality:</strong> We maintain our vehicles to the highest standards to ensure safety and comfort.</li>
              <li><strong>Reliability:</strong> We're committed to being there when you need us, with transparent policies and no hidden fees.</li>
              <li><strong>Sustainability:</strong> We're continuously expanding our fleet of eco-friendly options.</li>
              <li><strong>Customer-First:</strong> Your satisfaction drives everything we do.</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Our Team</h2>
            <p>
              Our dedicated team of professionals brings years of experience in the transportation and hospitality industries. 
              From our customer service representatives to our maintenance technicians, everyone at Wheelie Wanderlust is 
              committed to providing you with an exceptional rental experience.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Join Us on the Journey</h2>
            <p>
              Whether you're exploring a new city, going on a road trip, or just need a temporary vehicle, 
              Wheelie Wanderlust is here to make your journey smooth and enjoyable. We invite you to experience 
              the difference of renting with a company that truly cares about your mobility needs.
            </p>
          </div>
        </div>
      </Container>
      <Footer />
    </>
  );
}
