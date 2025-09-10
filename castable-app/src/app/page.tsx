import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SignInButton, SignUpButton } from '@clerk/nextjs'
import { LandingHeader } from '@/components/landing-header'
import Link from 'next/link'
import { 
  CheckCircle, 
  Star, 
  Users, 
  Clock, 
  Smartphone, 
  Shield, 
  Zap,
  ArrowRight,
  Play,
  Quote,
  Award,
  Download
} from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <LandingHeader />

      {/* Hero Section */}
      <section className="container py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="secondary" className="mb-6">
            <Star className="w-4 h-4 mr-2" />
            4.9/5 rating • 500+ theaters • No credit card required
          </Badge>
          
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
            Stop Wrestling with{' '}
            <span className="text-primary">Paper Audition Packets</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Create professional, interactive audition pages in under 10 minutes. 
            Attract better actors. Streamline your casting process.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <SignUpButton mode="modal">
              <Button size="lg" className="text-lg px-8 py-6">
                Start Your Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </SignUpButton>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
              <Link href="#demo">
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Link>
            </Button>
          </div>
          
          {/* Hero Video/Demo Placeholder */}
          <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-muted">
            <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Play className="w-8 h-8 text-primary-foreground" />
                </div>
                <p className="text-lg font-medium">See Castable in Action</p>
                <p className="text-muted-foreground">10-minute setup demonstration</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="py-20 bg-muted/30">
        <div className="container px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Your Paper Audition Packets Are Costing You Talent
              </h2>
              <p className="text-xl text-muted-foreground">
                73% of actors prefer digital audition materials, yet most theaters still use paper
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-destructive font-bold">✗</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Messy Paper Packets</h3>
                    <p className="text-muted-foreground">Lost materials, hard to read, difficult to distribute</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-destructive font-bold">✗</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Poor Mobile Experience</h3>
                    <p className="text-muted-foreground">Actors can't easily view materials on their phones</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-destructive font-bold">✗</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Time-Consuming Setup</h3>
                    <p className="text-muted-foreground">Hours spent formatting, printing, and organizing materials</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Professional Digital Pages</h3>
                    <p className="text-muted-foreground">Clean, organized, easy to navigate and share</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Mobile-First Design</h3>
                    <p className="text-muted-foreground">Perfect experience on phones, tablets, and desktops</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">10-Minute Setup</h3>
                    <p className="text-muted-foreground">From idea to published page in under 10 minutes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20">
        <div className="container px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trusted by 500+ Theaters Nationwide
            </h2>
            <p className="text-xl text-muted-foreground mb-12">
              From community theaters to high schools, directors are transforming their casting process
            </p>
            
            {/* Testimonials */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-bold">SM</span>
                    </div>
                    <div>
                      <CardTitle className="text-lg">Sarah Mitchell</CardTitle>
                      <CardDescription>Community Theater Director</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Quote className="w-8 h-8 text-primary/50 mb-4" />
                  <p className="text-muted-foreground">
                    "Castable transformed our audition process. We went from 15 applications to 45 in just one season. 
                    The professional look attracts better talent."
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-bold">MJ</span>
                    </div>
                    <div>
                      <CardTitle className="text-lg">Michael Johnson</CardTitle>
                      <CardDescription>High School Drama Teacher</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Quote className="w-8 h-8 text-primary/50 mb-4" />
                  <p className="text-muted-foreground">
                    "Setup took 8 minutes. My students love how easy it is to apply on their phones. 
                    No more lost papers or messy applications."
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-bold">AL</span>
                    </div>
                    <div>
                      <CardTitle className="text-lg">Amanda Lee</CardTitle>
                      <CardDescription>Independent Producer</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Quote className="w-8 h-8 text-primary/50 mb-4" />
                  <p className="text-muted-foreground">
                    "The template designer is incredible. I can create a professional page that matches 
                    my brand in minutes. It's like having a designer on staff."
                  </p>
                </CardContent>
              </Card>
            </div>
            
            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Secure & Private</span>
              </div>
              <div className="flex items-center space-x-2">
                <Smartphone className="w-5 h-5" />
                <span>Mobile-Optimized</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5" />
                <span>Professional</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5" />
                <span>No Tech Skills Required</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="py-20 bg-muted/30">
        <div className="container px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Everything You Need to Attract Better Talent
              </h2>
              <p className="text-xl text-muted-foreground">
                Professional tools designed specifically for theater directors
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Create in 10 Minutes</CardTitle>
                  <CardDescription>
                    From idea to published page in under 10 minutes with our guided wizard
                  </CardDescription>
                </CardHeader>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Smartphone className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Mobile-First Design</CardTitle>
                  <CardDescription>
                    Perfect experience on phones, tablets, and desktops for all your actors
                  </CardDescription>
                </CardHeader>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Award className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Professional Templates</CardTitle>
                  <CardDescription>
                    Beautiful, customizable templates that make your auditions stand out
                  </CardDescription>
                </CardHeader>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Easy Applicant Management</CardTitle>
                  <CardDescription>
                    View, sort, and manage all applications from one simple dashboard
                  </CardDescription>
                </CardHeader>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Zap className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>No Tech Skills Required</CardTitle>
                  <CardDescription>
                    Intuitive interface designed for theater people, not tech experts
                  </CardDescription>
                </CardHeader>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Secure & Private</CardTitle>
                  <CardDescription>
                    Your data is protected with enterprise-grade security and privacy
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section id="demo" className="py-20">
        <div className="container px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                See It In Action
              </h2>
              <p className="text-xl text-muted-foreground">
                Try the template designer and see how easy it is to create professional audition pages
              </p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-6">Try the Template Designer</h3>
                <p className="text-muted-foreground mb-8">
                  Drag and drop components to build your perfect audition page. 
                  No coding required, just creativity.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    <span>Drag and drop interface</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    <span>Live preview on all devices</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    <span>Professional templates included</span>
                  </div>
                </div>
                <Button asChild className="mt-8">
                  <Link href="/sign-up">
                    Try Template Designer
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              
              <div className="relative">
                <div className="bg-muted rounded-2xl p-8 shadow-2xl">
                  <div className="space-y-4">
                    <div className="h-4 bg-primary/20 rounded w-3/4"></div>
                    <div className="h-3 bg-muted-foreground/20 rounded w-1/2"></div>
                    <div className="h-3 bg-muted-foreground/20 rounded w-2/3"></div>
                    <div className="h-20 bg-primary/10 rounded mt-6"></div>
                    <div className="h-3 bg-muted-foreground/20 rounded w-1/3"></div>
                    <div className="h-3 bg-muted-foreground/20 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <Play className="w-4 h-4 text-primary-foreground" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-muted/30">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-muted-foreground mb-12">
              Start free, upgrade when ready. No hidden fees, no surprises.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card className="relative">
                <CardHeader>
                  <CardTitle className="text-2xl">Free</CardTitle>
                  <CardDescription>Perfect for getting started</CardDescription>
                  <div className="text-4xl font-bold">$0<span className="text-lg font-normal text-muted-foreground">/month</span></div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      <span>1 active show</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      <span>25 applicants per show</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      <span>5 professional templates</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      <span>Mobile-optimized pages</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      <span>Basic support</span>
                    </div>
                  </div>
                  <SignUpButton mode="modal">
                    <Button className="w-full">Start Free Trial</Button>
                  </SignUpButton>
                  <p className="text-sm text-muted-foreground">No credit card required</p>
                </CardContent>
              </Card>
              
              <Card className="relative border-primary">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                </div>
                <CardHeader>
                  <CardTitle className="text-2xl">Pro</CardTitle>
                  <CardDescription>For growing theaters</CardDescription>
                  <div className="text-4xl font-bold">$20<span className="text-lg font-normal text-muted-foreground">/month</span></div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      <span>Unlimited shows</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      <span>Unlimited applicants</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      <span>20+ professional templates</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      <span>Logo upload & custom branding</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      <span>Priority support</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      <span>Advanced analytics</span>
                    </div>
                  </div>
                  <SignUpButton mode="modal">
                    <Button className="w-full">Start Free Trial</Button>
                  </SignUpButton>
                  <p className="text-sm text-muted-foreground">14-day free trial, then $20/month</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Community & Resources Section */}
      <section className="py-20">
        <div className="container px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Join the Theater Director Community
              </h2>
              <p className="text-xl text-muted-foreground">
                Get support, share ideas, and learn from other directors
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Community Forum</CardTitle>
                  <CardDescription>
                    Connect with 500+ theater directors sharing tips and best practices
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SignUpButton mode="modal">
                    <Button variant="outline" className="w-full">Join Community</Button>
                  </SignUpButton>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Download className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Free Resources</CardTitle>
                  <CardDescription>
                    Download our "Audition Page Best Practices Guide" and template library
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SignUpButton mode="modal">
                    <Button variant="outline" className="w-full">Get Resources</Button>
                  </SignUpButton>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Live Setup Sessions</CardTitle>
                  <CardDescription>
                    Join our weekly live sessions for personalized setup assistance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SignUpButton mode="modal">
                    <Button variant="outline" className="w-full">Reserve Spot</Button>
                  </SignUpButton>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-muted/30">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-muted-foreground">
                Everything you need to know about Castable
              </p>
            </div>
            
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>How long does setup take?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Most directors create their first audition page in under 10 minutes using our guided wizard. 
                    You can have a professional page live and accepting applications in no time.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>What if I need help?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We offer free setup assistance for the first 100 theaters, plus weekly live sessions, 
                    a community forum, and comprehensive help documentation. You're never alone!
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Is my data secure?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Absolutely. We use enterprise-grade security to protect your data. All information is encrypted, 
                    and we never share your data with third parties. Your actors' privacy is our priority.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Can I cancel anytime?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Yes! You can cancel your subscription at any time. Your data remains accessible for 30 days 
                    after cancellation, and you can always re-subscribe when you need it again.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Your Audition Process?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join 500+ theaters already using Castable to attract better talent and streamline their casting process.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <SignUpButton mode="modal">
                <Button size="lg" className="text-lg px-8 py-6">
                  Start Your Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </SignUpButton>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
                <Link href="#demo">
                  <Play className="mr-2 h-5 w-5" />
                  Watch Demo
                </Link>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-12">
        <div className="container px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-sm">C</span>
                  </div>
                  <span className="text-xl font-bold">Castable</span>
                </div>
                <p className="text-muted-foreground">
                  The easiest way to manage your auditions.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Product</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li><Link href="/sign-up" className="hover:text-foreground">Features</Link></li>
                  <li><Link href="/sign-up" className="hover:text-foreground">Templates</Link></li>
                  <li><Link href="/sign-up" className="hover:text-foreground">Pricing</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Resources</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li><Link href="/sign-up" className="hover:text-foreground">Help Center</Link></li>
                  <li><Link href="/sign-up" className="hover:text-foreground">Community</Link></li>
                  <li><Link href="/sign-up" className="hover:text-foreground">Best Practices</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Company</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li><Link href="/sign-up" className="hover:text-foreground">About</Link></li>
                  <li><Link href="/sign-up" className="hover:text-foreground">Contact</Link></li>
                  <li><Link href="/sign-up" className="hover:text-foreground">Privacy</Link></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
              <p>&copy; 2024 Castable. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}