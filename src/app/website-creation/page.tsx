import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Code2, Globe, Rocket, Zap, Mail, PhoneCall } from "lucide-react";
import { QuoteForm } from "@/components/QuoteForm";

export const metadata = {
  title: "Website Creation & Development | CodeInternX",
  description: "Get a premium, high-performance website built by the CodeInternX engineering team.",
};

export default function WebsiteCreationPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 selection:bg-indigo-500/30">
      
      {/* Premium Hero Section */}
      <section className="relative bg-slate-950 pt-24 pb-32 px-4 overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay pointer-events-none"></div>
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-cyan-500/20 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/20 blur-[120px] pointer-events-none" />

        <div className="container mx-auto max-w-5xl text-center relative z-10">
          <Badge className="bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/20 uppercase tracking-widest text-xs px-4 py-1.5 font-semibold rounded-full mb-8 inline-flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Custom Development Services
          </Badge>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter mb-6 text-white leading-[1.1]">
            We Build <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400 mt-2">Premium Websites</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed font-light mb-10">
            Need a high-performance landing page, a full-stack web application, or an e-commerce platform? Our senior engineering team builds state-of-the-art digital experiences for modern businesses.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="#contact">
              <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-base font-semibold bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl shadow-lg shadow-cyan-900/20 transition-all hover:-translate-y-1">
                Start Your Project <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 md:py-32 px-4 relative">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16 md:mb-24">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-6 flex items-center justify-center gap-3">
              What We Build
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              We leverage modern frameworks like Next.js, React, and TailwindCSS to deliver blazing fast, SEO-optimized web solutions.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Rocket, title: "Landing Pages", desc: "High-converting, visually stunning one-page websites designed to capture leads and drive sales." },
              { icon: Code2, title: "Full-Stack Web Apps", desc: "Complex SaaS platforms, internal dashboards, and custom web applications with robust backend infrastructure." },
              { icon: Zap, title: "E-Commerce", desc: "Scalable online stores with seamless payment gateway integrations and inventory management." },
            ].map((feature, i) => (
              <div key={i} className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:border-cyan-200 transition-all duration-300 group">
                <div className="w-14 h-14 rounded-2xl bg-cyan-50 flex items-center justify-center text-cyan-600 mb-6 group-hover:scale-110 group-hover:bg-cyan-600 group-hover:text-white transition-all duration-300">
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-indigo-900/20 to-transparent pointer-events-none"></div>
        <div className="container mx-auto max-w-6xl relative z-10">
          
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Let's Build Something Great</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              Ready to elevate your online presence? Fill out the form below or contact us directly via email or phone to discuss your requirements and get a custom quote.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            
            {/* Contact Form */}
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl">
              <h3 className="text-2xl font-bold mb-6">Request a Quote</h3>
              <QuoteForm />
            </div>

            {/* Direct Contact Links */}
            <div className="flex flex-col justify-center h-full space-y-6">
              <div className="bg-slate-900/30 border border-slate-800 rounded-3xl p-8">
                <h3 className="text-xl font-bold mb-8">Direct Contact</h3>
                
                <div className="space-y-6">
                  <a href="mailto:internxcode@gmail.com" className="group flex items-center gap-5 bg-slate-950 border border-slate-700/50 hover:border-indigo-500 px-6 py-5 rounded-2xl transition-all hover:bg-slate-900 shadow-sm">
                    <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <Mail className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-400 font-medium mb-0.5">Send an Email</p>
                      <p className="text-lg font-semibold text-white group-hover:text-indigo-300 transition-colors">internxcode@gmail.com</p>
                    </div>
                  </a>

                  <a href="tel:+919508574636" className="group flex items-center gap-5 bg-slate-950 border border-slate-700/50 hover:border-cyan-500 px-6 py-5 rounded-2xl transition-all hover:bg-slate-900 shadow-sm">
                    <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <PhoneCall className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-400 font-medium mb-0.5">Call Us Now</p>
                      <p className="text-lg font-semibold text-white group-hover:text-cyan-300 transition-colors">+91 95085 74636</p>
                    </div>
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
