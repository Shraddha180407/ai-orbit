import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ROBOTS_DATA } from '../data/robotsData';
import InquiryModal from '../components/InquiryModal';
import { 
  ArrowLeft, 
  Bookmark, 
  Share2, 
  Star, 
  CheckCircle2, 
  ExternalLink, 
  ShieldCheck, 
  Cpu, 
  Battery, 
  Weight, 
  Layers, 
  Zap, 
  Building, 
  Play, 
  Code2, 
  FileText, 
  ChevronRight,
  Sparkles,
  Bot,
  Copy,
  Check
} from 'lucide-react';

export default function RobotDetailPage({ bookmarks, onToggleBookmark }) {
  const { slug } = useParams();
  const navigate = useNavigate();

  const robot = ROBOTS_DATA.find((r) => r.slug === slug) || ROBOTS_DATA[0];

  const [activeImage, setActiveImage] = useState(robot.media.primaryImage);
  const [activeTab, setActiveTab] = useState('specs'); // 'specs', 'deployments', 'software'
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Update active image when route changes
  useEffect(() => {
    setActiveImage(robot.media.primaryImage);
    window.scrollTo(0, 0);
  }, [slug, robot]);

  const isBookmarked = bookmarks.includes(robot.id);

  const handleCopyShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(`from orbit_robotics import ${robot.name.replace(/[^a-zA-Z0-9]/g, '')}Client

client = ${robot.name.replace(/[^a-zA-Z0-9]/g, '')}Client(api_key="ORBIT_ROBOTICS_KEY")
telemetry = client.get_kinematics_stream()
client.execute_vla_policy(task="Sort sheet metal components", speed_multiplier=1.0)`);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Related robots from same category or others
  const relatedRobots = ROBOTS_DATA.filter((r) => r.id !== robot.id).slice(0, 3);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#6E56CF]/30 pb-16">
      {/* Top Breadcrumb Bar */}
      <div className="border-b border-[#1C1C1F] bg-[#09090b]/80 backdrop-blur-md sticky top-[57px] z-30 py-2.5 px-4 sm:px-8">
        <div className="mx-auto max-w-[1440px] flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-1.5 text-[#A1A1AA] overflow-x-auto scrollbar-none whitespace-nowrap">
            <Link to="/" className="hover:text-white transition-colors flex items-center gap-1">
              <Bot size={13} />
              <span>AI Robots</span>
            </Link>
            <span className="text-[#3F3F46]">/</span>
            <span className="text-[#71717A]">{robot.category}</span>
            <span className="text-[#3F3F46]">/</span>
            <span className="text-white font-medium">{robot.name}</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopyShare}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-[#232326] bg-[#131316] text-[#A1A1AA] hover:text-white transition-colors cursor-pointer"
              title="Share profile"
            >
              {copiedLink ? <Check size={12} className="text-[#10B981]" /> : <Share2 size={12} />}
              <span className="hidden sm:inline">{copiedLink ? 'Copied' : 'Share'}</span>
            </button>
            <button
              onClick={() => onToggleBookmark(robot.id)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                isBookmarked
                  ? 'bg-[#6E56CF]/20 border-[#6E56CF]/50 text-[#A78BFA]'
                  : 'bg-[#131316] border-[#232326] text-[#A1A1AA] hover:text-white'
              }`}
            >
              <Bookmark size={12} className={isBookmarked ? "fill-[#A78BFA]" : ""} />
              <span className="hidden sm:inline">{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 pt-6 sm:pt-8">
        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs text-[#A1A1AA] hover:text-white mb-6 transition-colors group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to All Robotics Platforms</span>
        </Link>

        {/* Main Hero Header */}
        <div className="flex flex-col lg:flex-row items-start justify-between gap-6 pb-8 border-b border-[#1C1C1F]">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-2.5 flex-wrap">
              <span className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider bg-[#131316] px-2.5 py-0.5 rounded-md border border-[#232326]">
                {robot.manufacturer}
              </span>
              <span className="text-[#3F3F46]">•</span>
              <span className="text-xs text-[#71717A]">{robot.manufacturerCountry}</span>
              <span className="text-[#3F3F46]">•</span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#10B981]/15 text-[#34D399] border border-[#10B981]/30">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
                {robot.status}
              </span>
              <span className="text-[#3F3F46]">•</span>
              <span className="inline-flex items-center gap-1 text-xs text-white font-mono">
                <Star size={12} className="text-[#F5A623] fill-[#F5A623]" />
                <span>{robot.rating}</span>
                <span className="text-[#71717A]">({robot.reviewsCount} reviews)</span>
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-3">
              {robot.name}
            </h1>
            <p className="text-sm sm:text-base text-[#A1A1AA] leading-relaxed max-w-2xl font-normal">
              {robot.tagLine}
            </p>
          </div>

          {/* Pricing Box & CTA */}
          <div className="w-full lg:w-80 p-5 rounded-2xl border border-[#232326] bg-[#111115] shrink-0">
            <span className="text-[11px] uppercase tracking-wider text-[#71717A] font-semibold block">
              Commercial Procurement
            </span>
            <div className="text-2xl sm:text-3xl font-bold text-white font-mono my-1">
              {robot.pricing.startingPrice}
            </div>
            <span className="text-xs text-[#A1A1AA] block mb-4 font-mono">
              Lease: {robot.pricing.leasePerMonth}
            </span>

            <button
              onClick={() => setIsInquiryOpen(true)}
              className="w-full py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-[#6E56CF] hover:bg-[#7C66DC] text-white shadow-lg shadow-[#6E56CF]/25 transition-all mb-2.5 active:scale-95 cursor-pointer"
            >
              Request Commercial Quote
            </button>
            <div className="text-center">
              <span className="text-[11px] text-[#71717A] flex items-center justify-center gap-1">
                <ShieldCheck size={12} className="text-[#10B981]" /> Full Factory SLA &amp; Support
              </span>
            </div>
          </div>
        </div>

        {/* Media Gallery & Quick Telemetry Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-8 items-start">
          {/* Left 7 Cols: Image Showcase */}
          <div className="lg:col-span-7 space-y-3">
            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-[#0A0A0D] border border-[#232326]">
              <img
                src={activeImage}
                alt={robot.name}
                className="w-full h-full object-cover transition-all duration-300"
              />
              <button
                onClick={() => setIsVideoModalOpen(true)}
                className="absolute bottom-4 right-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-black/70 backdrop-blur-md border border-white/20 text-xs font-semibold text-white hover:bg-black/90 transition-all cursor-pointer"
              >
                <Play size={13} className="fill-white" />
                <span>Watch Operational Demo</span>
              </button>
            </div>

            {/* Thumbnail selector */}
            <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
              {robot.media.gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`relative w-20 h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                    activeImage === img ? 'border-[#6E56CF]' : 'border-[#232326] opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right 5 Cols: Key Engineering Metrics */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-xs uppercase tracking-wider font-bold text-[#71717A]">
              Real-Time Telemetry &amp; Physical Bounds
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-xl border border-[#232326] bg-[#111115]">
                <div className="flex items-center gap-2 text-[#71717A] text-xs font-semibold uppercase mb-1">
                  <Weight size={13} className="text-[#A78BFA]" /> Max Payload
                </div>
                <div className="text-xl font-bold font-mono text-white">{robot.specs.payload}</div>
                <span className="text-[11px] text-[#A1A1AA]">Continuous duty capacity</span>
              </div>

              <div className="p-4 rounded-xl border border-[#232326] bg-[#111115]">
                <div className="flex items-center gap-2 text-[#71717A] text-xs font-semibold uppercase mb-1">
                  <Battery size={13} className="text-[#10B981]" /> Active Run-Time
                </div>
                <div className="text-xl font-bold font-mono text-white">{robot.specs.runTime}</div>
                <span className="text-[11px] text-[#A1A1AA]">Recharge: {robot.specs.chargeTime}</span>
              </div>

              <div className="p-4 rounded-xl border border-[#232326] bg-[#111115]">
                <div className="flex items-center gap-2 text-[#71717A] text-xs font-semibold uppercase mb-1">
                  <Layers size={13} className="text-[#00E5FF]" /> Mobility &amp; DoF
                </div>
                <div className="text-xl font-bold font-mono text-white">{robot.specs.dof.split(' ')[0]}</div>
                <span className="text-[11px] text-[#A1A1AA]">Independent joint motors</span>
              </div>

              <div className="p-4 rounded-xl border border-[#232326] bg-[#111115]">
                <div className="flex items-center gap-2 text-[#71717A] text-xs font-semibold uppercase mb-1">
                  <Zap size={13} className="text-[#F5A623]" /> Walk / Run Speed
                </div>
                <div className="text-xl font-bold font-mono text-white">{robot.specs.speed}</div>
                <span className="text-[11px] text-[#A1A1AA]">Autonomous gait tuning</span>
              </div>
            </div>

            {/* Ingress protection & autonomy pill banner */}
            <div className="p-4 rounded-xl border border-[#232326] bg-[#111115] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#71717A]">Autonomy Level</span>
                <span className="font-semibold text-[#A78BFA]">{robot.autonomyLevel}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#71717A]">Ingress Protection</span>
                <span className="font-mono text-white">{robot.specs.ipRating}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#71717A]">Release Year</span>
                <span className="font-mono text-white">{robot.releaseYear}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Tabs: Specs / Deployments / Software SDK */}
        <div className="mt-8 pt-6 border-t border-[#1C1C1F]">
          {/* Tab Navigation */}
          <div className="flex items-center gap-2 border-b border-[#232326] pb-3 mb-6 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveTab('specs')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'specs'
                  ? 'bg-white text-black shadow-md'
                  : 'text-[#A1A1AA] hover:text-white hover:bg-[#18181f]'
              }`}
            >
              Complete Engineering Spec Sheet
            </button>
            <button
              onClick={() => setActiveTab('deployments')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'deployments'
                  ? 'bg-white text-black shadow-md'
                  : 'text-[#A1A1AA] hover:text-white hover:bg-[#18181f]'
              }`}
            >
              Enterprise Deployment &amp; Pilots
            </button>
            <button
              onClick={() => setActiveTab('software')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'software'
                  ? 'bg-white text-black shadow-md'
                  : 'text-[#A1A1AA] hover:text-white hover:bg-[#18181f]'
              }`}
            >
              Software, ROS 2 &amp; API
            </button>
          </div>

          {/* TAB 1: Specs Sheet */}
          {activeTab === 'specs' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Mechanics & Actuation */}
              <div className="p-5 rounded-2xl border border-[#232326] bg-[#111115] space-y-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Layers size={16} className="text-[#6E56CF]" /> Mechanics &amp; Actuators
                </h4>
                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-[#1c1c22]">
                    <span className="text-[#71717A]">Height</span>
                    <span className="text-white font-mono font-medium">{robot.specs.height}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#1c1c22]">
                    <span className="text-[#71717A]">Weight</span>
                    <span className="text-white font-mono font-medium">{robot.specs.weight}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#1c1c22]">
                    <span className="text-[#71717A]">Actuator Architecture</span>
                    <span className="text-white text-right max-w-xs">{robot.specs.actuatorType}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#1c1c22]">
                    <span className="text-[#71717A]">Total Degrees of Freedom</span>
                    <span className="text-[#A78BFA] font-mono font-bold">{robot.specs.dof}</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-[#71717A]">Max Speed</span>
                    <span className="text-white font-mono">{robot.specs.speed}</span>
                  </div>
                </div>
              </div>

              {/* Compute & Sensors */}
              <div className="p-5 rounded-2xl border border-[#232326] bg-[#111115] space-y-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Cpu size={16} className="text-[#00E5FF]" /> Compute, Perception &amp; Power
                </h4>
                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-[#1c1c22]">
                    <span className="text-[#71717A]">Onboard Compute</span>
                    <span className="text-white text-right max-w-xs">{robot.specs.compute}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#1c1c22]">
                    <span className="text-[#71717A]">Sensor Suite</span>
                    <span className="text-white text-right max-w-xs">{robot.specs.sensors}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#1c1c22]">
                    <span className="text-[#71717A]">Battery Pack</span>
                    <span className="text-white font-mono">{robot.specs.powerCapacity}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#1c1c22]">
                    <span className="text-[#71717A]">Ingress Protection</span>
                    <span className="text-white font-mono">{robot.specs.ipRating}</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-[#71717A]">Recharge Cycle</span>
                    <span className="text-white font-mono">{robot.specs.chargeTime}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Deployments */}
          {activeTab === 'deployments' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {robot.deploymentCases.map((cs, idx) => (
                  <div key={idx} className="p-5 rounded-2xl border border-[#232326] bg-[#111115]">
                    <div className="flex items-center gap-2 text-[#A78BFA] text-xs font-semibold uppercase mb-2">
                      <Building size={14} />
                      <span>{cs.partner}</span>
                    </div>
                    <h5 className="text-base font-bold text-white mb-2">{cs.useCase}</h5>
                    <div className="p-3 rounded-xl bg-[#16161c] border border-[#272730] text-xs text-[#E4E4E7]">
                      <span className="text-[#71717A] block text-[10px] uppercase font-semibold mb-1">Impact &amp; Metrics</span>
                      {cs.metrics}
                    </div>
                  </div>
                ))}
              </div>

              {/* Target industries pills */}
              <div className="p-5 rounded-2xl border border-[#232326] bg-[#111115]">
                <h5 className="text-xs uppercase font-bold text-[#71717A] tracking-wider mb-3">
                  Qualified Target Industries
                </h5>
                <div className="flex flex-wrap gap-2">
                  {robot.targetIndustries.map((ind, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-xl bg-[#1a1a20] border border-[#272730] text-xs font-medium text-white">
                      {ind}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Software & API */}
          {activeTab === 'software' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl border border-[#232326] bg-[#111115]">
                  <span className="text-[10.5px] uppercase font-bold text-[#71717A] block">Operating System</span>
                  <span className="text-xs font-bold text-white mt-1 block">{robot.software.os}</span>
                </div>
                <div className="p-4 rounded-xl border border-[#232326] bg-[#111115]">
                  <span className="text-[10.5px] uppercase font-bold text-[#71717A] block">ROS Support</span>
                  <span className="text-xs font-bold text-[#34D399] mt-1 block">{robot.software.rosSupport}</span>
                </div>
                <div className="p-4 rounded-xl border border-[#232326] bg-[#111115]">
                  <span className="text-[10.5px] uppercase font-bold text-[#71717A] block">Teleoperation</span>
                  <span className="text-xs font-bold text-[#A78BFA] mt-1 block">{robot.software.teleoperation}</span>
                </div>
              </div>

              {/* Python SDK Example */}
              <div className="rounded-2xl border border-[#232326] bg-[#0c0c0f] overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2.5 bg-[#141418] border-b border-[#232326]">
                  <span className="text-xs font-mono text-[#A1A1AA] flex items-center gap-2">
                    <Code2 size={14} className="text-[#6E56CF]" />
                    example_telemetry_control.py
                  </span>
                  <button
                    onClick={handleCopyCode}
                    className="flex items-center gap-1 text-[11px] text-[#A1A1AA] hover:text-white transition-colors"
                  >
                    {copiedCode ? <Check size={12} className="text-[#10B981]" /> : <Copy size={12} />}
                    <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="p-4 text-xs font-mono text-[#E4E4E7] overflow-x-auto">
{`from orbit_robotics import ${robot.name.replace(/[^a-zA-Z0-9]/g, '')}Client

# Initialize authenticated connection to robot agent
client = ${robot.name.replace(/[^a-zA-Z0-9]/g, '')}Client(api_key="ORBIT_ROBOTICS_KEY")

# Stream live joint torque and perception telemetry
telemetry = client.get_kinematics_stream()
print(f"Current battery state: {telemetry.battery_percent}%")

# Dispatch autonomous task reasoning policy
client.execute_vla_policy(
    task="Pick and insert automotive harness into fixture #4",
    precision_mode="sub_millimeter",
    speed_multiplier=1.0
)`}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Related Platforms */}
        <div className="mt-16 pt-10 border-t border-[#1C1C1F]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-white">Alternative Robotic Systems</h3>
              <p className="text-xs text-[#A1A1AA]">Explore comparable bipedal and autonomous hardware</p>
            </div>
            <Link to="/" className="text-xs text-[#A78BFA] hover:underline flex items-center gap-1">
              <span>View All Directory</span>
              <ChevronRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {relatedRobots.map((rel) => (
              <Link
                key={rel.id}
                to={`/robots/${rel.slug}`}
                className="group p-4 rounded-2xl border border-[#232326] bg-[#111115] hover:border-[#3b3b44] transition-all hover:-translate-y-1 block"
              >
                <img
                  src={rel.media.primaryImage}
                  alt={rel.name}
                  className="w-full h-36 object-cover rounded-xl mb-3"
                />
                <span className="text-[10px] uppercase font-bold text-[#71717A] tracking-wider block">
                  {rel.manufacturer}
                </span>
                <h4 className="text-sm font-bold text-white group-hover:text-[#A78BFA] transition-colors truncate">
                  {rel.name}
                </h4>
                <div className="flex items-center justify-between text-xs mt-2 text-[#A1A1AA]">
                  <span>Payload: {rel.specs.payload.split(' ')[0]} {rel.specs.payload.split(' ')[1]}</span>
                  <span className="font-mono font-bold text-white">{rel.pricing.startingPrice}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="relative w-full max-w-4xl rounded-2xl border border-[#27272a] bg-[#111114] overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-[#232326]">
              <span className="text-sm font-bold text-white flex items-center gap-2">
                <Play size={14} className="text-[#6E56CF] fill-[#6E56CF]" />
                {robot.name} — Operational Demonstration Video
              </span>
              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="text-[#A1A1AA] hover:text-white p-1"
              >
                ✕
              </button>
            </div>
            <div className="aspect-video bg-black flex items-center justify-center relative">
              <img
                src={robot.media.primaryImage}
                alt="Video preview"
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <div className="w-16 h-16 rounded-full bg-[#6E56CF] flex items-center justify-center shadow-lg shadow-[#6E56CF]/40 cursor-pointer hover:scale-110 transition-transform">
                  <Play size={24} className="fill-white ml-1" />
                </div>
                <span className="text-sm font-semibold text-white bg-black/60 px-3 py-1 rounded-full border border-white/10">
                  {robot.media.videoTitle} ({robot.media.videoDuration})
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Inquiry Modal */}
      <InquiryModal
        isOpen={isInquiryOpen}
        onClose={() => setIsInquiryOpen(false)}
        selectedRobot={robot}
      />
    </div>
  );
}
