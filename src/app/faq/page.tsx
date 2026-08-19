export const metadata = {
  title: "Frequently Asked Questions | CodeInternX",
};

export default function FAQPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-20 min-h-screen">
      <h1 className="text-4xl font-extrabold tracking-tight mb-8">Frequently Asked Questions</h1>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold">What is CodeInternX?</h2>
          <p className="text-muted-foreground mt-2">CodeInternX is a project-based internship platform where students gain real-world engineering experience.</p>
        </div>
        <div>
          <h2 className="text-xl font-bold">Are the certificates verified?</h2>
          <p className="text-muted-foreground mt-2">Yes, every certificate comes with a unique ID that recruiters can verify instantly on our platform.</p>
        </div>
      </div>
    </div>
  );
}
