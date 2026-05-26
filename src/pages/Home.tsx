import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, GraduationCap, Shield, Zap, Users, BookOpen, Globe, Award } from 'lucide-react';

const features = [
  { icon: BookOpen, title: 'Structured Learning', desc: 'Step-by-step guided enrollment process tailored to your career goals.' },
  { icon: Users, title: 'Expert Mentors', desc: 'Learn from industry professionals with years of real-world experience.' },
  { icon: Globe, title: 'Flexible Modes', desc: 'Choose online, offline, or hybrid learning that fits your schedule.' },
  { icon: Award, title: 'Certification', desc: 'Earn recognized certificates upon successful completion of your program.' },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-br from-surface via-primary-container/20 to-surface">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(0,91,191,0.06),transparent_50%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-container/50 rounded-full text-xs font-medium text-primary mb-6">
                <Zap className="w-3.5 h-3.5" />
                Your journey starts here
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-on-surface leading-tight mb-6">
                Shape Your{' '}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Future
                </span>{' '}
                with Intro Internship
              </h1>
              <p className="text-lg text-on-surface-variant mb-8 max-w-lg leading-relaxed">
                Join our comprehensive internship program designed to bridge the gap between academic learning and industry excellence.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-primary/20"
                >
                  Apply Now
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/admin/login"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-outline-variant text-on-surface font-medium rounded-xl hover:bg-surface-container transition-all active:scale-95"
                >
                  <Shield className="w-4 h-4" />
                  Admin Portal
                </Link>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl p-8 border border-outline-variant/30">
                <GraduationCap className="w-24 h-24 text-primary/20 absolute top-4 right-4" />
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Programs', value: '10+' },
                    { label: 'Students', value: '500+' },
                    { label: 'Placement', value: '92%' },
                    { label: 'Mentors', value: '50+' },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-surface-container-lowest/80 backdrop-blur-sm rounded-xl p-4 border border-outline-variant/30">
                      <p className="text-2xl font-bold text-primary">{stat.value}</p>
                      <p className="text-xs text-on-surface-variant mt-1">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-on-surface mb-4">Why Choose Us?</h2>
            <p className="text-on-surface-variant max-w-lg mx-auto">Everything you need to launch your career in the right direction.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 hover:shadow-md hover:border-primary/20 transition-all duration-300 group"
              >
                <div className="w-10 h-10 bg-primary-container rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-on-surface mb-2">{feature.title}</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Begin Your Journey?</h2>
          <p className="text-primary-container/80 mb-8 max-w-lg mx-auto">Take the first step towards a rewarding career. Apply now and transform your potential into expertise.</p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-primary font-semibold rounded-xl hover:opacity-90 transition-all active:scale-95"
          >
            Start Your Application
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
