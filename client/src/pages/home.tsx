import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Beaker, Brain, Microscope, FlaskConical, Users, Award, ArrowRight } from "lucide-react";
import heroImage from "@assets/generated_images/hero_molecular_visualization_render.png";
import chemImage from "@assets/generated_images/chemistry_reaction_simulation_preview.png";
import bioImage from "@assets/generated_images/biology_cell_structure_preview.png";
import dnaImage from "@assets/generated_images/dna_replication_simulation_preview.png";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge className="mb-2" data-testid="badge-user-count">50,000+ Active Students</Badge>
              <h1 className="text-5xl lg:text-6xl font-bold tracking-tight">
                Learn Science Through
                <span className="text-primary"> Interactive Simulations</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Experience hands-on STEM education with our immersive virtual laboratory. 
                Practice biology and chemistry experiments safely, anytime, anywhere.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" asChild data-testid="button-get-started">
                  <Link href="/simulations">
                    Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild data-testid="button-browse">
                  <Link href="/simulations">
                    Browse Simulations
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <img 
                src={heroImage} 
                alt="3D molecular visualization" 
                className="rounded-xl shadow-lg w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-semibold mb-4">
              Why Science ASimulation?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Revolutionary virtual laboratory platform designed for modern STEM education
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Beaker,
                title: "150+ Simulations",
                description: "Chemistry, biology, and biochemistry experiments at your fingertips"
              },
              {
                icon: Brain,
                title: "AI-Powered Learning",
                description: "Smart guidance and real-time feedback as you experiment"
              },
              {
                icon: Microscope,
                title: "3D Visualization",
                description: "Interact with molecules and cells in stunning 3D graphics"
              },
              {
                icon: FlaskConical,
                title: "Safe Practice",
                description: "No equipment costs, safety risks, or lab access barriers"
              },
              {
                icon: Users,
                title: "Collaborative",
                description: "Share workspaces and experiments with classmates"
              },
              {
                icon: Award,
                title: "Skill Progression",
                description: "Track your progress with levels, badges, and achievements"
              },
            ].map((feature, i) => (
              <Card key={i} className="hover-elevate">
                <CardHeader>
                  <feature.icon className="h-12 w-12 text-primary mb-4" />
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Simulations Preview */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-semibold mb-4">
              Popular Simulations
            </h2>
            <p className="text-lg text-muted-foreground">
              Start learning with our most-loved experiments
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Acid-Base Neutralization",
                subject: "Chemistry",
                difficulty: "Beginner",
                thumbnail: chemImage,
                duration: 10
              },
              {
                title: "Cell Structure Explorer",
                subject: "Biology",
                difficulty: "Beginner",
                thumbnail: bioImage,
                duration: 15
              },
              {
                title: "DNA Replication",
                subject: "Biochemistry",
                difficulty: "Intermediate",
                thumbnail: dnaImage,
                duration: 20
              },
            ].map((sim, i) => (
              <Card key={i} className="overflow-hidden hover-elevate" data-testid={`card-simulation-${i}`}>
                <div className="aspect-video relative">
                  <img src={sim.thumbnail} alt={sim.title} className="w-full h-full object-cover" />
                </div>
                <CardHeader>
                  <div className="flex gap-2 mb-2">
                    <Badge variant="secondary" data-testid={`badge-subject-${i}`}>{sim.subject}</Badge>
                    <Badge variant="outline" data-testid={`badge-difficulty-${i}`}>{sim.difficulty}</Badge>
                  </div>
                  <CardTitle className="text-lg">{sim.title}</CardTitle>
                  <CardDescription>{sim.duration} min</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button size="lg" asChild data-testid="button-view-all">
              <Link href="/simulations">
                View All Simulations <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { value: "50,000+", label: "Active Students" },
              { value: "150+", label: "Simulations" },
              { value: "1M+", label: "Experiments Run" },
              { value: "500+", label: "Schools" },
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-4xl font-bold text-primary mb-2" data-testid={`stat-value-${i}`}>
                  {stat.value}
                </div>
                <div className="text-muted-foreground" data-testid={`stat-label-${i}`}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl text-center">
          <h2 className="text-3xl lg:text-4xl font-semibold mb-4">
            Ready to Start Your Scientific Journey?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Join thousands of students learning science the interactive way
          </p>
          <Button size="lg" variant="secondary" asChild data-testid="button-signup-cta">
            <Link href="/auth/signup">
              Sign Up Free Today
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
