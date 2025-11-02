
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ImageGallery } from "./_components/ImageGallery";

export default function WhoWeArePage() {
  const heroImage = PlaceHolderImages.find((img) => img.id === "hero-home");
  const galleryImages = PlaceHolderImages.filter((img) => img.id.startsWith("gallery-"));

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-grow">
        <section className="relative flex items-center justify-center text-center py-20 md:py-32 bg-gradient-to-br from-purple-400 to-[#682d91]">
             <div
                className="absolute inset-0 bg-cover bg-center opacity-20"
                style={{ backgroundImage: `url('${heroImage?.imageUrl}')` }}
                data-ai-hint={heroImage?.imageHint}
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
                        <Link href="/dashboard">Go to Dashboard</Link>
                    </Button>
                </div>
            </div>
        </section>

        <section className="py-16 md:py-24 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl font-bold text-gray-800">
                    Who We Are
                </h2>
                <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-600">
                    Located in the heart of East London, Lisebanzi Foundation is a non-profit organization dedicated to providing comprehensive support services to individuals and communities affected by Gender-Based Violence (GBV), substance abuse, and other social and economic challenges.
                </p>
            </div>
        </section>

        <section className="py-16 md:py-24 bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                 <h2 className="text-3xl font-bold text-center text-gray-800">
                    Our Pillars of Support
                </h2>

                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div className="p-6">
                        <h3 className="text-xl font-semibold text-purple-800">
                            Connect
                        </h3>
                        <p className="mt-2 text-gray-600">
                            Share your story and find strength in the experiences of others in our safe and anonymous community forums.
                        </p>
                    </div>
                     <div className="p-6">
                        <h3 className="text-xl font-semibold text-purple-800">
                            Learn
                        </h3>
                        <p className="mt-2 text-gray-600">
                            Access educational resources on your rights, digital safety, and pathways to healing and empowerment.
                        </p>
                    </div>
                     <div className="p-6">
                        <h3 className="text-xl font-semibold text-purple-800">
                            Grow
                        </h3>
                        <p className="mt-2 text-gray-600">
                            Participate in workshops and events designed to help you build resilience and leadership skills.
                        </p>
                    </div>
                </div>
            </div>
        </section>
        
        <section className="py-16 md:py-24 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
                    Our Community in Action
                </h2>
                <ImageGallery images={galleryImages} />
            </div>
        </section>
      </main>
    </div>
  );
}
