
import { CheckCircle } from "lucide-react";

const WhyChooseUs = () => {
  const benefits = [
    {
      title: "Low Cost Rentals",
      description: "We offer the most competitive pricing in Rishikesh and Dehradun with no hidden charges.",
      icon: <CheckCircle size={24} className="text-brand-green" />
    },
    {
      title: "Easy Pickup & Drop",
      description: "Convenient pickup and drop-off points across Rishikesh and Dehradun.",
      icon: <CheckCircle size={24} className="text-brand-green" />
    },
    {
      title: "24/7 Customer Support",
      description: "Our dedicated team is always ready to assist you whenever you need help.",
      icon: <CheckCircle size={24} className="text-brand-green" />
    },
    {
      title: "Quality Vehicles",
      description: "All our vehicles are regularly serviced and maintained for a smooth ride.",
      icon: <CheckCircle size={24} className="text-brand-green" />
    },
    {
      title: "Free Accessories",
      description: "Complimentary helmets and rain covers provided with every rental.",
      icon: <CheckCircle size={24} className="text-brand-green" />
    },
    {
      title: "Flexible Duration",
      description: "Rent by hour, day, or week - whichever suits your travel plans better.",
      icon: <CheckCircle size={24} className="text-brand-green" />
    }
  ];

  return (
    <section className="py-16">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose Us?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We're committed to providing the best rental experience for your adventure in Uttarakhand.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="flex items-start mb-4">
                <div className="mr-4 mt-1">
                  {benefit.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
