import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/PageHeader";
import {
  ArrowRight,
  BookOpenText,
  CalendarDays,
  HelpCircle,
  Users,
} from "lucide-react";
import Link from "next/link";

const features = [
  {
    title: "Ask a Mentor",
    description:
      "Get guidance from experienced mentors. Ask questions anonymously and receive insightful answers.",
    href: "/ask-a-mentor",
    icon: <HelpCircle className="size-8 text-blue-500" />,
  },
  {
    title: "Support Circles",
    description:
      "Join our public group chat for peer-to-peer support. Share your thoughts and connect with others.",
    href: "/support-circles",
    icon: <Users className="size-8 text-blue-500" />,
  },
  {
    title: "Your Story",
    description:
      "Share your inspirational journey to uplift and motivate others in the community.",
    href: "/your-story",
    icon: <BookOpenText className="size-8 text-blue-500" />,
  },
  {
    title: "Upcoming Events",
    description:
      "Stay informed about workshops, webinars, and community gatherings on our public bulletin board.",
    href: "/upcoming-events",
    icon: <CalendarDays className="size-8 text-blue-500" />,
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col gap-12 md:gap-16 pb-12">
      <section className="relative w-full -mt-6">
        <div className="container mx-auto grid lg:grid-cols-1 gap-8 items-center py-12 md:py-24">
          <div className="flex flex-col gap-4 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900">
              Welcome to LisebanziConnect
            </h1>
            <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">
              A safe space for support, guidance, and inspiration. Your journey
              to empowerment starts here.
            </p>
            <div className="flex gap-4 justify-center mt-4">
              <Button asChild size="lg">
                <Link href="/ask-a-mentor">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
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
            <Card
              key={feature.title}
              className="shadow-lg transition-transform hover:-translate-y-2 duration-300 ease-in-out bg-white/50 backdrop-blur-md border-gray-200"
            >
              <CardHeader className="items-center">
                <div className="p-4 bg-gradient-to-br from-blue-100 to-green-100 rounded-full mb-2 shadow-inner">
                  {feature.icon}
                </div>
                <CardTitle className="text-center">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-gray-600">
                <p>{feature.description}</p>
                <Button
                  asChild
                  variant="link"
                  className="mt-4 text-blue-600 font-semibold"
                >
                  <Link href={feature.href}>
                    Learn More <ArrowRight className="size-4 ml-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
