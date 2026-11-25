import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RemoteImage from '@/components/RemoteImage';
import { BUSINESS_INFO, GALLERY_IMAGES } from '@/data/canberraData';
import { getServiceBySlug, getPublicServices } from '@/lib/publicData';
import { notFound } from 'next/navigation';
import { CheckCircle2, Tag, Camera, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';

interface ServiceSlugProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ServiceSlugProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return { title: "Service Not Found" };
  return {
    title: `${service.name} Canberra | Canberra Carpet Cleaning Deals`,
    description: service.shortDesc
  };
}

export async function generateStaticParams() {
  const services = await getPublicServices();
  return services
    .filter((s: any) => typeof s?.slug === 'string' && s.slug.length > 0)
    .map((s: any) => ({ slug: s.slug }));
}

export default async function IndividualServicePage({ params }: ServiceSlugProps) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  const allServices = await getPublicServices();

  if (!service) {
    notFound();
  }

  const differentiators: string[] = Array.isArray(service.differentiators) ? service.differentiators : [];
  const processSteps: { title: string; desc: string }[] = Array.isArray(service.processSteps) ? service.processSteps : [];
  const pricingNotes: string[] = Array.isArray(service.pricingNotes) ? service.pricingNotes : [];

  // Pick 4 real photos from GALLERY_IMAGES to display in the new On The Job section
  const samplePhotos = GALLERY_IMAGES.slice(0, 4);

  return (
    <main className="min-h-screen flex flex-col bg-white text-slate-900">
      <Header />

      {/* Breadcrumb Header Banner */}
      <div className="bg-gradient-to-r from-[#0b132b] via-[#0c4a6e] to-[#0b132b] text-white py-14 px-4 border-b border-sky-950 shadow-md">
        <div className="max-w-7xl mx-auto space-y-3">
          <div className="text-xs text-[#10b981] font-bold uppercase tracking-wider flex items-center gap-2">
            <Link href="/" className="hover:underline text-sky-200">Home</Link>
            <span>/</span>
            <Link href="/services" className="hover:underline text-sky-200">Services</Link>
            <span>/</span>
            <span className="text-[#10b981]">{service.name}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">{service.name} Canberra</h1>
          <p className="text-sky-200 text-sm max-w-2xl font-medium">{service.shortDesc}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-12 gap-10">
          
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* Featured Image */}
            <div className="relative h-72 sm:h-96 w-full rounded-3xl overflow-hidden shadow-md border border-sky-100 bg-slate-100">
              <RemoteImage
                src={service.image}
                alt={service.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-[#0284c7] text-white text-xs font-black uppercase px-3 py-1 rounded-full shadow-xs">
                17+ Years Canberra Experience
              </div>
            </div>

            {/* Intro Copy */}
            <div className="bg-[#f8fafc] p-6 sm:p-8 rounded-3xl border border-sky-100 shadow-xs space-y-4">
              <h2 className="text-2xl font-black text-slate-900">Professional {service.name} across all ACT Suburbs</h2>
              <p className="text-slate-700 text-sm sm:text-base leading-relaxed font-medium">
                {service.fullDesc}
              </p>
            </div>

            {/* NEW ADDITIVE SECTION: Real Jobs, Real Results */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-sky-100 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-sky-100 pb-3">
                <div className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-[#10b981]" />
                  <h3 className="text-xl font-black text-slate-900">Real Jobs, Real Results: On The Job Showcase</h3>
                </div>
                <span className="text-xs font-extrabold text-[#0284c7] uppercase">AUTHENTIC ACT JOBS</span>
              </div>
              <p className="text-xs text-slate-600 font-medium">
                Photos taken directly by our Canberra cleaning technicians during real residential and commercial jobs.
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                {samplePhotos.map((photo, i) => (
                  <div key={i} className="rounded-2xl overflow-hidden border border-sky-100 bg-[#f8fafc] group">
                    <div className="relative h-44 w-full">
                      <RemoteImage
                        src={photo.url}
                        alt={photo.caption}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-3 text-[11px] font-bold text-slate-800 text-center">
                      {photo.caption}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Why Choose Us Section */}
            {differentiators.length > 0 && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-sky-100 shadow-xs space-y-4">
                <h3 className="text-xl font-black text-slate-900">Why Canberra Households Choose Us For {service.name}</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {differentiators.map((diff, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs font-bold text-slate-800 bg-[#f8fafc] p-3.5 rounded-2xl border border-sky-100">
                      <CheckCircle2 className="w-4 h-4 text-[#0284c7] flex-shrink-0 mt-0.5" />
                      <span>{diff}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cleaning Process Steps */}
            {processSteps.length > 0 && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-sky-100 shadow-xs space-y-4">
                <h3 className="text-xl font-black text-slate-900">Our {service.name} Process</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {processSteps.map((step, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-[#f8fafc] border border-sky-100 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#0284c7] text-white font-black text-xs flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <h4 className="text-sm font-black text-slate-900">{step?.title}</h4>
                      </div>
                      <p className="text-xs text-slate-600 font-medium pl-8">{step?.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pricing Section */}
            {pricingNotes.length > 0 && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-sky-100 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black text-slate-900">{service.name} Pricing Guide</h3>
                  <span className="text-xs font-black uppercase text-[#0284c7] bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
                    20% Online Discount Included
                  </span>
                </div>

                <div className="space-y-2 text-xs font-semibold text-slate-700">
                  {pricingNotes.map((note, idx) => (
                    <div key={idx} className="p-3 bg-[#f8fafc] rounded-xl border border-sky-100 flex items-center gap-2">
                      <Tag className="w-4 h-4 text-[#0284c7] flex-shrink-0" />
                      <span>{note}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Service Areas Paragraph */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-sky-100 shadow-xs space-y-3">
              <h3 className="text-lg font-black text-slate-900">Service Areas</h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                We service every district in Canberra ACT including Belconnen, Gungahlin, Tuggeranong, Woden Valley, Weston Creek, Molonglo Valley, Inner North (Braddon, Turner, Reid, Dickson, Lyneham, Watson, O'Connor, Ainslie), Inner South (Manuka, Kingston, Griffith, Forrest, Yarralumla, Deakin, Red Hill, Narrabundah), plus Queanbeyan NSW, Jerrabomberra, Bungendore, and Yass.
              </p>
            </div>

            {/* Final CTA */}
            <div className="p-8 sm:p-10 rounded-3xl bg-[#0b132b] text-white space-y-4 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between border-l-8 border-[#10b981] shadow-xl">
              <div className="space-y-1">
                <h4 className="text-2xl font-black text-white">Book {service.name} Today</h4>
                <p className="text-xs text-sky-200">Get your exact price in 60 seconds with zero upfront deposit.</p>
              </div>
              <div className="flex flex-wrap items-center gap-3 whitespace-nowrap">
                <Link href="/instant-quote" className="btn-primary-green px-8 py-4 text-xs uppercase tracking-wider shadow-lg">
                  INSTANT QUOTE
                </Link>
                <a href={BUSINESS_INFO.telLink} className="btn-white-ghost-pill px-8 py-4 text-xs uppercase tracking-wider">
                  CALL {BUSINESS_INFO.phone}
                </a>
              </div>
            </div>

          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Sidebar Navigation */}
            <div className="bg-white border border-sky-100 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="text-xs font-black uppercase text-slate-400 tracking-wider">All {allServices.length} Cleaning Services</div>
              <div className="space-y-1.5 text-xs font-bold">
                {allServices.map((s: any) => (
                  <Link
                    key={s.id || s._id}
                    href={`/services/${s.slug}`}
                    className={`block p-2.5 rounded-xl transition-colors ${
                      s.slug === slug ? 'bg-[#0284c7] text-white font-black' : 'text-slate-700 hover:bg-[#f8fafc]'
                    }`}
                  >
                    {s.navTitle || s.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Sidebar CTA Card */}
            <div className="bg-[#0b132b] text-white border border-sky-800 rounded-3xl p-6 shadow-md space-y-4 text-center">
              <div className="relative h-40 w-full rounded-2xl overflow-hidden">
                <RemoteImage
                  src="/pictures/real_image_20.jpeg"
                  alt="Canberra Carpet Cleaning Van Dispatch"
                  className="w-full h-full object-cover"
                />
              </div>
              <h4 className="text-lg font-black text-white">Need Urgent Same-Day Clean?</h4>
              <p className="text-xs text-sky-200">Book before 11am for guaranteed same-day team dispatch anywhere in the ACT.</p>
              <a
                href={BUSINESS_INFO.telLink}
                className="btn-primary-green w-full py-3.5 text-xs uppercase tracking-wider block shadow-md"
              >
                CALL {BUSINESS_INFO.phone}
              </a>
            </div>

          </div>

        </div>
      </div>

      <Footer />
    </main>
  );
}


