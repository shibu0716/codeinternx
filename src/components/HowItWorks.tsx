"use client";

import { useState } from "react";
import { 
  UserPlus, 
  Search, 
  Mail, 
  BookOpen, 
  Code2, 
  UploadCloud, 
  ShieldCheck, 
  Award,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ArrowRight
} from "lucide-react";
import Link from "next/link";

interface StepCard {
  title: string;
  badge: string;
  description: string;
  subDescription: string;
  onThisScreen: string[];
  studentAction: string;
}

interface Step {
  id: string;
  number: string;
  tabLabel: string;
  icon: any;
  stepLabel: string;
  heading: string;
  description: string;
  subDescription: string;
  whatHappens: string[];
  showButton: boolean;
  buttonLabel?: string;
  buttonHref?: string;
  card: StepCard;
}

export function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);

  const steps: Step[] = [
    {
      id: "apply",
      number: "01",
      tabLabel: "Apply",
      icon: UserPlus,
      stepLabel: "SUBMIT YOUR APPLICATION",
      heading: "Begin Your Internship Journey",
      description: "Choose the internship domain that aligns with your interests and career goals. Fill out the application form with your details and submit your profile for review.",
      subDescription: "Whether you're a beginner, student, graduate, or self-learner, this step helps us understand your preferred field and allocate the right internship track.",
      whatHappens: [
        "Select your preferred internship domain",
        "Submit your application form",
        "Receive instant application confirmation",
        "Enter the candidate review queue"
      ],
      showButton: true,
      buttonLabel: "Fill Registration Form →",
      buttonHref: "/internships",
      card: {
        title: "INTERNSHIP APPLICATION PORTAL",
        badge: "Active Stage",
        description: "This is the first screen every candidate interacts with. Here, students select their desired internship domain, provide basic information, and officially apply for the program.",
        subDescription: "The portal instantly confirms successful application submission and initiates the review process.",
        onThisScreen: [
          "Internship domain selection",
          "Candidate information form",
          "Application submission button",
          "Confirmation notification"
        ],
        studentAction: "STUDENT ACTION: COMPLETE AND SUBMIT THE APPLICATION FORM."
      }
    },
    {
      id: "review",
      number: "02",
      tabLabel: "Review",
      icon: Search,
      stepLabel: "APPLICATION REVIEW & SELECTION",
      heading: "Our Team Reviews Your Profile",
      description: "After submission, our team reviews your application and checks internship availability for your selected track.",
      subDescription: "Most applications are reviewed within 24-48 hours before moving to the next stage.",
      whatHappens: [
        "Application screening begins",
        "Candidate profile reviewed",
        "Domain eligibility checked",
        "Selection decision finalized"
      ],
      showButton: false,
      card: {
        title: "APPLICATION TRACKING DASHBOARD",
        badge: "Active Stage",
        description: "This dashboard allows candidates to monitor the progress of their application throughout the review process.",
        subDescription: "Students can view status updates and know exactly where their application stands.",
        onThisScreen: [
          "Application received",
          "Under review status",
          "Domain allocation progress",
          "Selection updates"
        ],
        studentAction: "STUDENT ACTION: MONITOR YOUR APPLICATION STATUS WHILE THE REVIEW PROCESS IS COMPLETED."
      }
    },
    {
      id: "offer-letter",
      number: "03",
      tabLabel: "Offer Letter",
      icon: Mail,
      stepLabel: "RECEIVE YOUR OFFICIAL OFFER LETTER",
      heading: "Get Selected & Start Your Internship",
      description: "Candidates who successfully pass the review process receive an official internship offer letter confirming their selection.",
      subDescription: "The offer letter contains important information regarding the internship, duration, and onboarding process.",
      whatHappens: [
        "Selection officially confirmed",
        "Offer letter generated",
        "Internship details shared",
        "Onboarding instructions provided"
      ],
      showButton: false,
      card: {
        title: "OFFICIAL INTERNSHIP OFFER LETTER",
        badge: "Active Stage",
        description: "This document serves as proof of your selection and contains all important internship information.",
        subDescription: "Students can review their internship details and proceed with onboarding.",
        onThisScreen: [
          "Candidate details",
          "Internship domain",
          "Internship duration",
          "Offer status",
          "Joining instructions"
        ],
        studentAction: "STUDENT ACTION: REVIEW THE OFFER LETTER AND PROCEED TO THE INTERNSHIP PHASE."
      }
    },
    {
      id: "get-tasks",
      number: "04",
      tabLabel: "Get Tasks",
      icon: BookOpen,
      stepLabel: "ACCESS INTERNSHIP TASKS",
      heading: "Receive Practical Industry-Based Assignments",
      description: "Once onboarding is completed, internship tasks are assigned through the student dashboard.",
      subDescription: "These assignments are designed to help students gain practical experience through real-world project work.",
      whatHappens: [
        "Internship tasks assigned",
        "Project requirements shared",
        "Learning resources provided",
        "Task timeline activated"
      ],
      showButton: false,
      card: {
        title: "ASSIGNED TASK MANAGEMENT SYSTEM",
        badge: "Active Stage",
        description: "This dashboard displays all tasks allocated to the student during the internship period.",
        subDescription: "Students can track their progress and manage project deadlines efficiently.",
        onThisScreen: [
          "Assigned projects",
          "Task descriptions",
          "Progress indicators",
          "Completion tracking",
          "Internship timeline"
        ],
        studentAction: "STUDENT ACTION: BEGIN WORKING ON THE ASSIGNED PROJECTS AND COMPLETE ALL REQUIRED TASKS."
      }
    },
    {
      id: "code-project",
      number: "05",
      tabLabel: "Code/Project",
      icon: Code2,
      stepLabel: "BUILD YOUR PROJECTS",
      heading: "Develop and Build Real-World Solutions",
      description: "Apply your skills by working on the assigned projects. Write code, design systems, and build functional applications.",
      subDescription: "This hands-on phase allows you to put theory into practice and develop an impressive project portfolio.",
      whatHappens: [
        "Local development setup",
        "Architecture planning",
        "Writing clean, functional code",
        "Testing and debugging"
      ],
      showButton: false,
      card: {
        title: "DEVELOPMENT ENVIRONMENT",
        badge: "Active Stage",
        description: "This phase represents the core of your internship where you actively build out the required features.",
        subDescription: "You'll use industry-standard tools and practices to complete your assignments.",
        onThisScreen: [
          "Source code management",
          "Local testing",
          "Feature implementation",
          "Code optimization"
        ],
        studentAction: "STUDENT ACTION: WRITE CODE AND DEVELOP THE FEATURES REQUIRED FOR YOUR ASSIGNED TASKS."
      }
    },
    {
      id: "submit",
      number: "06",
      tabLabel: "Submit",
      icon: UploadCloud,
      stepLabel: "PROJECT SUBMISSION",
      heading: "Submit Your Work for Evaluation",
      description: "Once you have completed a task or project, submit your codebase via GitHub or the designated platform.",
      subDescription: "Ensure all requirements are met and your code is properly documented before submission.",
      whatHappens: [
        "Code committed to repository",
        "Pull request created",
        "Documentation updated",
        "Submission confirmed"
      ],
      showButton: false,
      card: {
        title: "PROJECT SUBMISSION PORTAL",
        badge: "Active Stage",
        description: "The interface where students officially hand in their completed work for review.",
        subDescription: "Submissions are timestamped and queued for the evaluation team.",
        onThisScreen: [
          "GitHub repository link",
          "Live deployment URL",
          "Project summary",
          "Submission timestamp"
        ],
        studentAction: "STUDENT ACTION: PROVIDE LINKS TO YOUR WORK AND FINALIZE YOUR TASK SUBMISSION."
      }
    },
    {
      id: "evaluate",
      number: "07",
      tabLabel: "Evaluate",
      icon: ShieldCheck,
      stepLabel: "EXPERT EVALUATION",
      heading: "Get Feedback from Senior Engineers",
      description: "Our team of experienced developers reviews your submitted projects, assessing code quality, functionality, and best practices.",
      subDescription: "Constructive feedback helps you understand areas for improvement and refines your coding skills.",
      whatHappens: [
        "Code review initiated",
        "Functionality tested",
        "Code quality assessed",
        "Constructive feedback provided"
      ],
      showButton: false,
      card: {
        title: "EVALUATION & FEEDBACK DASHBOARD",
        badge: "Active Stage",
        description: "Here you can view detailed feedback and grades assigned to your submitted projects by our evaluators.",
        subDescription: "Feedback is specific and actionable to help you grow as a developer.",
        onThisScreen: [
          "Reviewer comments",
          "Code quality score",
          "Functionality status",
          "Improvement suggestions"
        ],
        studentAction: "STUDENT ACTION: REVIEW EVALUATOR FEEDBACK AND IMPLEMENT ANY REQUESTED CHANGES."
      }
    },
    {
      id: "certify",
      number: "08",
      tabLabel: "Certify",
      icon: Award,
      stepLabel: "SUCCESSFUL COMPLETION",
      heading: "Receive Your Verifiable Certificate",
      description: "Upon successful evaluation of all assigned tasks, you will be awarded an official certificate of completion.",
      subDescription: "This verifiable credential can be shared on LinkedIn and added to your resume to boost your career prospects.",
      whatHappens: [
        "Final review completed",
        "Certificate generated",
        "Completion report finalized",
        "Credential verified"
      ],
      showButton: false,
      card: {
        title: "CERTIFICATION & ALUMNI PORTAL",
        badge: "Active Stage",
        description: "Access your official internship certificate, completion letter, and performance report.",
        subDescription: "Download your credentials or share them directly to professional networks.",
        onThisScreen: [
          "Certificate of completion",
          "Performance report",
          "Verification link",
          "Social sharing options"
        ],
        studentAction: "STUDENT ACTION: DOWNLOAD YOUR CERTIFICATE AND ADD IT TO YOUR PROFESSIONAL PORTFOLIO."
      }
    }
  ];

  const currentStep = steps[activeStep];

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const handlePrev = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  return (
    <section className="py-24 px-4 bg-slate-50/50 dark:bg-slate-950/50 overflow-hidden relative border-t border-slate-100 dark:border-slate-900">
      <div className="container mx-auto max-w-7xl">
        
        {/* Section Heading */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold text-[10px] uppercase tracking-widest mb-6">
            <span className="text-blue-500">🚀</span> STEPPER GUIDE
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-[3.5rem] font-serif font-medium text-slate-900 dark:text-white mb-6 tracking-tight">
            INTERNSHIP <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0066ff] via-[#6633ff] to-[#9900ff]">JOURNEY</span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium">
            From application to certification — complete real-world projects, submit your work, and earn globally verifiable credentials.
          </p>
        </div>

        {/* Top Tabs Navigation */}
        <div className="flex flex-nowrap overflow-x-auto pb-6 mb-12 gap-4 hide-scrollbar snap-x">
          {steps.map((step, index) => {
            const isActive = activeStep === index;
            const Icon = step.icon;
            return (
              <button
                key={step.id}
                onClick={() => setActiveStep(index)}
                className={`snap-start shrink-0 relative flex flex-col items-center justify-center w-36 h-32 rounded-[1.5rem] transition-all duration-300 ${
                  isActive 
                    ? 'bg-gradient-to-br from-[#4b6fff] to-[#9900ff] text-white shadow-xl shadow-blue-500/20 scale-105 z-10' 
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:border-blue-300 hover:shadow-md'
                }`}
              >
                <span className={`absolute top-4 right-4 text-[10px] font-bold ${isActive ? 'text-white/80' : 'text-slate-300'}`}>
                  {step.number}
                </span>
                <Icon className={`w-8 h-8 mb-3 ${isActive ? 'text-white' : 'text-slate-400'}`} strokeWidth={1.5} />
                <span className={`text-xs font-bold ${isActive ? 'text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                  {step.tabLabel}
                </span>
              </button>
            );
          })}
        </div>

        {/* Content Section */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">
          
          {/* Left Column (Text & Flow) */}
          <div className="w-full lg:w-1/2 flex flex-col">
            <div className="text-[11px] font-black text-[#0084d1] tracking-widest uppercase mb-4">
              STEP {activeStep + 1} — {currentStep.stepLabel}
            </div>
            
            <h3 className="text-3xl md:text-[2.5rem] leading-tight font-serif text-slate-900 dark:text-white mb-6">
              {currentStep.heading}
            </h3>
            
            <p className="text-base text-slate-700 dark:text-slate-300 mb-4 font-medium leading-relaxed">
              {currentStep.description}
            </p>
            
            <p className="text-sm italic text-slate-500 mb-10 leading-relaxed">
              {currentStep.subDescription}
            </p>

            <div className="mb-6">
              <h4 className="text-[11px] font-black uppercase text-slate-900 dark:text-slate-100 tracking-wider mb-5">
                What happens here?
              </h4>
              <ul className="space-y-4">
                {currentStep.whatHappens.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {currentStep.showButton && (
              <div className="mt-8">
                <Link href={currentStep.buttonHref || "#"}>
                  <button className="bg-[#0084d1] hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full text-sm inline-flex items-center gap-2 transition-colors">
                    {currentStep.buttonLabel}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            )}

            {/* Pagination Controls */}
            <div className="mt-16 flex items-center gap-6 text-sm font-bold text-slate-600">
              <span>Phase <span className="text-slate-900 dark:text-white text-lg">{activeStep + 1}</span> of 8</span>
              <div className="flex gap-2">
                <button 
                  onClick={handlePrev}
                  disabled={activeStep === 0}
                  className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button 
                  onClick={handleNext}
                  disabled={activeStep === steps.length - 1}
                  className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column (Visual Card) */}
          <div className="w-full lg:w-1/2 mt-8 lg:mt-0">
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-[0_10px_40px_rgba(0,0,0,0.06)] border border-slate-100 dark:border-slate-800 w-full transition-all">
              
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-5 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                  <span className="text-[11px] font-bold text-slate-500 tracking-widest uppercase">{currentStep.card.title}</span>
                </div>
                <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold px-3 py-1.5 rounded-full">
                  {currentStep.card.badge}
                </div>
              </div>

              {/* Card Description */}
              <p className="text-[15px] font-medium text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                {currentStep.card.description}
              </p>
              <p className="text-[13px] italic text-slate-500 mb-8 leading-relaxed">
                {currentStep.card.subDescription}
              </p>

              {/* On This Screen */}
              <div className="mb-8">
                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">
                  On this screen
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {currentStep.card.onThisScreen.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span className="text-[13px] font-bold text-slate-700 dark:text-slate-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Box */}
              <div className="border border-blue-100 dark:border-blue-900/50 bg-blue-50/30 dark:bg-blue-900/10 rounded-xl p-4 text-center">
                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 tracking-widest uppercase">
                  {currentStep.card.studentAction}
                </span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
