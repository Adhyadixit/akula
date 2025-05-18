
const testimonials = [
  {
    id: 1,
    name: "Rahul Sharma",
    location: "Delhi",
    quote: "The Royal Enfield I rented was in excellent condition. The team was helpful and the process was hassle-free. Will definitely rent again on my next trip!",
    rating: 5
  },
  {
    id: 2,
    name: "Priya Patel",
    location: "Mumbai",
    quote: "I rented an Activa for 3 days in Rishikesh. The scooter was well maintained and the staff was friendly. Great experience overall!",
    rating: 4
  },
  {
    id: 3,
    name: "Alex Wilson",
    location: "UK",
    quote: "Perfect service for tourists! I explored Dehradun on a rented bike and had an amazing experience. The prices are reasonable too.",
    rating: 5
  }
];

const Testimonials = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it. Here's what customers have to say about their rental experience with us.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-yellow-400 fill-current"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z" />
                  </svg>
                ))}
              </div>
              <p className="italic text-gray-600 mb-4">"{testimonial.quote}"</p>
              <div className="mt-4">
                <p className="font-semibold">{testimonial.name}</p>
                <p className="text-sm text-gray-500">{testimonial.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
