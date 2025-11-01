
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function LandingPage() {
  const galleryImages = PlaceHolderImages.filter(img => img.id.startsWith('gallery-'));

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-lg shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                <Image
                  src="/LF Logo.jpg"
                  alt="Lisebanzi Foundation Logo"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <span className="hidden sm:inline-block text-purple-800">Lisebanzi Foundation</span>
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <Button asChild variant="outline">
                <Link href="/auth">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/auth">Sign Up</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative flex items-center justify-center text-center py-20 md:py-32 bg-gradient-to-br from-purple-400 to-[#682d91]">
           <div
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1541976844346-f18aeac57b06?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHxjb21tdW5pdHklMjBzdXBwb3J0fGVufDB8fHx8MTc1OTY4MDYwNXww&ixlib=rb-4.1.0&q=80&w=1080')" }}
          ></div>
          <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight">
              A Safe Space to Heal and Grow
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-purple-100">
              Join Lisebanzi Connect, a supportive community dedicated to empowering survivors, fostering connection, and inspiring hope.
            </p>
            <div className="mt-8">
              <Button asChild size="lg">
                <Link href="/auth">Join the Community</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* About Us Section */}
        <section className="py-16 md:py-24 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl font-bold text-gray-800">Who We Are</h2>
                <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-600">
                    Located in the heart of East London, Lisebanzi Foundation is a non-profit organization dedicated to providing comprehensive support services to individuals and communities affected by Gender-Based Violence (GBV), substance abuse, and other social and economic challenges.
                </p>
            </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24 bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-center text-gray-800">Our Pillars of Support</h2>
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div className="p-6">
                        <h3 className="text-xl font-semibold text-purple-800">Connect</h3>
                        <p className="mt-2 text-gray-600">Share your story and find strength in the experiences of others in our safe and anonymous community forums.</p>
                    </div>
                     <div className="p-6">
                        <h3 className="text-xl font-semibold text-purple-800">Learn</h3>
                        <p className="mt-2 text-gray-600">Access educational resources on your rights, digital safety, and pathways to healing and empowerment.</p>
                    </div>
                     <div className="p-6">
                        <h3 className="text-xl font-semibold text-purple-800">Grow</h3>
                        <p className="mt-2 text-gray-600">Participate in workshops and events designed to help you build resilience and leadership skills.</p>
                    </div>
                </div>
            </div>
        </section>
        
        {/* Image Gallery Section */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Our Community in Action</h2>
            <div className="flex flex-wrap gap-4 justify-center">
              {galleryImages.map((image) => (
                <div key={image.id} className="w-[300px] h-[200px] relative rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                  <Image
                    src={image.imageUrl}
                    alt={image.description}
                    width={300}
                    height={200}
                    className="object-cover w-full h-full"
                    data-ai-hint={image.imageHint}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Lisebanzi Foundation. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
