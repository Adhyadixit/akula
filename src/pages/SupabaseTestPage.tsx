import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Container } from "@/components/ui/container";
import SupabaseTest from "@/components/SupabaseTest";

export default function SupabaseTestPage() {
  return (
    <>
      <Navbar />
      <Container className="py-16 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight mb-6">Supabase Connection Test</h1>
          <SupabaseTest />
        </div>
      </Container>
      <Footer />
    </>
  );
}
