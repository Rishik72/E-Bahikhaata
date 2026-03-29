import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { TreePine, Users, Search, Shield, BookOpen, MapPin, Heart, Sparkles } from 'lucide-react';
import heroBg from '@/assets/hero-bg.jpg';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.7, ease: 'easeOut' as const },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

const features = [
  {
    icon: TreePine,
    title: 'Family Trees',
    desc: 'Build and visualize multi-generational family trees with an intuitive, interactive interface.',
    gradient: 'from-primary/20 to-accent/10',
  },
  {
    icon: Search,
    title: 'Smart Search',
    desc: 'Find any family by gotra, village, surname, or ancestor name — instantly across records.',
    gradient: 'from-accent/15 to-primary/10',
  },
  {
    icon: Users,
    title: 'Detailed Records',
    desc: 'Store comprehensive records — names, parents, spouse, profession, location and more.',
    gradient: 'from-primary/15 to-secondary/30',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    desc: 'Your family data is encrypted, protected, and accessible only with authenticated access.',
    gradient: 'from-secondary/30 to-primary/10',
  },
];

const stats = [
  { value: '1000+', label: 'Families Preserved' },
  { value: '50K+', label: 'Person Records' },
  { value: '200+', label: 'Villages Covered' },
  { value: '99.9%', label: 'Uptime' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/70 backdrop-blur-xl border-b border-border/30">
        <div className="container flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
              <TreePine className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-display font-bold text-foreground leading-none tracking-tight">ई-बहीखाता</h1>
              <p className="text-[10px] text-muted-foreground font-medium tracking-wider uppercase">E-Bahikhata</p>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="px-5 py-2 rounded-xl text-sm font-medium text-foreground hover:bg-secondary/80 transition-all duration-200"
            >
              Login
            </Link>
            <Link
              to="/login"
              className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-primary to-accent text-primary-foreground hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-16 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={heroBg}
            alt=""
            className="w-full h-full object-cover opacity-15"
            width={1920}
            height={800}
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsl(var(--primary)/0.15),transparent)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
        </div>

        {/* Decorative elements */}
        <div className="absolute top-32 left-10 w-72 h-72 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute top-48 right-16 w-96 h-96 rounded-full bg-accent/5 blur-3xl" />

        <div className="relative z-10 container flex flex-col items-center text-center py-28 md:py-40 gap-7">
          <motion.div
            initial="hidden"
            animate="visible"
            custom={0}
            variants={fadeUp}
            className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-secondary/80 text-secondary-foreground text-sm font-medium border border-border/50 backdrop-blur-sm shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            Digital Vanshavali System
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          </motion.div>

          <motion.h2
            initial="hidden"
            animate="visible"
            custom={1}
            variants={fadeUp}
            className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-foreground max-w-5xl leading-[1.1] tracking-tight"
          >
            Preserve Generations.{' '}
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">Digitally.</span>
          </motion.h2>

          <motion.p
            initial="hidden"
            animate="visible"
            custom={2}
            variants={fadeUp}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed"
          >
            A modern genealogy platform inspired by centuries-old family registers.
            Store, search and grow your family tree across generations — beautifully.
          </motion.p>

          <motion.div
            initial="hidden"
            animate="visible"
            custom={3}
            variants={fadeUp}
            className="flex items-center gap-4 mt-2"
          >
            <Link
              to="/login"
              className="group px-8 py-3.5 rounded-2xl text-base font-semibold bg-gradient-to-r from-primary to-accent text-primary-foreground hover:shadow-xl hover:shadow-primary/25 transition-all duration-300 hover:-translate-y-1"
            >
              Start Preserving
              <span className="inline-block ml-2 transition-transform group-hover:translate-x-1">→</span>
            </Link>
            <Link
              to="/login"
              className="px-8 py-3.5 rounded-2xl text-base font-medium bg-card text-foreground hover:bg-secondary transition-all duration-200 border border-border shadow-sm"
            >
              Login
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative z-10 -mt-8">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-3xl bg-card/80 backdrop-blur-sm border border-border/50 shadow-xl shadow-foreground/5"
          >
            {stats.map((stat, i) => (
              <motion.div key={stat.label} custom={i} variants={scaleIn} className="text-center py-4">
                <p className="text-2xl md:text-3xl font-display font-bold text-primary">{stat.value}</p>
                <p className="text-xs md:text-sm text-muted-foreground mt-1 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="container py-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="text-center mb-16"
        >
          <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 text-sm font-medium text-primary mb-4">
            <BookOpen className="w-4 h-4" /> Core Features
          </motion.div>
          <motion.h3
            variants={fadeUp}
            custom={1}
            className="text-3xl md:text-5xl font-display font-bold text-foreground tracking-tight"
          >
            Everything you need
          </motion.h3>
          <motion.p
            variants={fadeUp}
            custom={2}
            className="text-muted-foreground mt-4 max-w-lg mx-auto text-lg leading-relaxed"
          >
            A complete digital platform for preserving and managing genealogical records.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-30px' }}
                custom={i}
                variants={fadeUp}
                className="group relative p-7 rounded-3xl bg-card border border-border/50 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-2"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-7 h-7 text-primary" />
                </div>
                <h4 className="text-lg font-display font-bold mb-2.5 tracking-tight">{feature.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container pb-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary to-accent/80" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,transparent_0%,hsl(var(--foreground)/0.05)_100%)]" />
          <div className="relative z-10 flex flex-col items-center text-center py-16 md:py-20 px-6">
            <motion.div variants={fadeUp} custom={0}>
              <Heart className="w-10 h-10 text-primary-foreground/80 mb-4 mx-auto" />
            </motion.div>
            <motion.h3 variants={fadeUp} custom={1} className="text-3xl md:text-4xl font-display font-bold text-primary-foreground max-w-2xl tracking-tight">
              Start preserving your family's legacy today
            </motion.h3>
            <motion.p variants={fadeUp} custom={2} className="text-primary-foreground/80 mt-4 max-w-md text-lg">
              Join thousands of families who trust E-Bahikhata to keep their heritage alive.
            </motion.p>
            <motion.div variants={fadeUp} custom={3}>
              <Link
                to="/login"
                className="mt-8 inline-block px-10 py-4 rounded-2xl text-base font-bold bg-card text-foreground hover:bg-background transition-all duration-300 shadow-xl hover:-translate-y-1"
              >
                Create Free Account →
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/30">
        <div className="container py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <TreePine className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <span className="font-display font-bold text-foreground">ई-बहीखाता</span>
              <p className="text-[10px] text-muted-foreground">Preserving heritage, digitally</p>
            </div>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Varanasi, India</span>
            <span>© {new Date().getFullYear()} E-Bahikhata</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
