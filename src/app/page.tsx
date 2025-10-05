import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/PageHeader";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ArrowRight, BookOpenText, CalendarDays, HelpCircle, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const features = [
  {
    title: "Ask a Mentor",
    description: "Get guidance from experienced mentors. Ask questions anonymously and receive insightful answers.",
    href: "/ask-a-mentor",
    icon: <HelpCircle className="size-8 text-primary" />,
  },
  {
    title: "Support Circles",
    description: "Join our public group chat for peer-to-peer support. Share your thoughts and connect with others.",
    href: "/support-circles",
    icon: <Users className="size-8 text-primary" />,
  },
  {
    title: "Your Story",
    description: "Share your inspirational journey to uplift and motivate others in the community.",
    href: "/your-story",
    icon: <BookOpenText className="size-8 text-primary" />,
  },
  {
    title: "Upcoming Events",
    description: "Stay informed about workshops, webinars, and community gatherings on our public bulletin board.",
    href: "/upcoming-events",
    icon: <CalendarDays className="size-8 text-primary" />,
  },
]

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-home');
  return (
    <div className="flex flex-col gap-12 md:gap-16 pb-12">
      <section className="relative w-full -mt-6">
        <div className="container mx-auto grid lg:grid-cols-2 gap-8 items-center py-12 md:py-24">
          <div className="flex flex-col gap-4 text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-br from-accent to-primary bg-clip-text text-transparent">
              Welcome to LisebanziConnect
            </h1>
            <p className="text-lg md:text-xl text-foreground/80">
              A safe space for support, guidance, and inspiration. Your journey to empowerment starts here.
            </p>
            <div className="flex gap-4 justify-center lg:justify-start mt-4">
              <Button asChild size="lg">
                <Link href="/ask-a-mentor">Get Started <ArrowRight className="ml-2 h-5 w-5"/></Link>
              </Button>
            </div>
          </div>
          <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden shadow-neumorphic">
            {heroImage && (
               <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                fill
                priority
                className="object-cover"
                data-ai-hint={heroImage.imageHint}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent"></div>
          </div>
        </div>
      </section>

      <section className="container mx-auto">
        <PageHeader
          title="Our Features"
          description="Explore the ways you can connect and grow with our community."
          className="text-center mb-8"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <Card key={feature.title} className="shadow-neumorphic transition-transform hover:-translate-y-2 duration-300 ease-in-out bg-white/30 backdrop-blur-sm border-white/20">
              <CardHeader className="items-center">
                <div className="p-4 bg-gradient-to-br from-accent/20 to-primary/20 rounded-full mb-2 shadow-inner">
                  {feature.icon}
                </div>
                <CardTitle className="text-center">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-foreground/70">
                <p>{feature.description}</p>
                <Button asChild variant="link" className="mt-4 text-primary font-semibold">
                  <Link href={feature.href}>Learn More <ArrowRight className="size-4 ml-1" /></Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
