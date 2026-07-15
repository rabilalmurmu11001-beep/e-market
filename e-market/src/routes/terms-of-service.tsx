import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/terms-of-service")({
  component: TermsOfServiceComponent,
});

function TermsOfServiceComponent() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 font-sans text-neutral-800">
      {/* Page Header */}
      <div className="border-b border-neutral-200 pb-8 mb-10">
        <div className="flex items-center gap-3 mb-3">
          <span className="w-4 h-8 bg-black rounded-xs block"></span>
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Legal</span>
        </div>
        <h1 className="text-4xl font-black text-black uppercase tracking-tight">Terms of Service</h1>
        <p className="text-sm text-neutral-500 mt-2">Last Updated: July 15, 2026</p>
      </div>

      {/* Intro */}
      <div className="prose prose-neutral max-w-none space-y-8">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-black border-l-2 border-black pl-3">1. Agreement to Terms</h2>
          <p className="text-sm leading-relaxed text-neutral-600">
            By accessing or using the e-Market website, products, and services, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you are prohibited from using or accessing our website.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-black border-l-2 border-black pl-3">2. User Accounts</h2>
          <p className="text-sm leading-relaxed text-neutral-600">
            When you create an account on e-Market, you represent and warrant that the information you provide is accurate, complete, and current at all times.
          </p>
          <ul className="list-disc pl-5 space-y-2 text-sm text-neutral-600">
            <li>You are responsible for maintaining the confidentiality of your account credentials and password.</li>
            <li>You agree to accept responsibility for all activities or purchases that occur under your account.</li>
            <li>We reserve the right to refuse service, terminate accounts, or cancel orders at our sole discretion.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-black border-l-2 border-black pl-3">3. Purchases and Payments</h2>
          <p className="text-sm leading-relaxed text-neutral-600">
            All purchases made through e-Market are subject to product availability. We reserve the right to limit the quantity of products we offer.
          </p>
          <ul className="list-disc pl-5 space-y-2 text-sm text-neutral-600">
            <li><strong>Pricing:</strong> All prices are subject to change without notice. We make every effort to display accurate pricing, but errors may occasionally occur.</li>
            <li><strong>Payment:</strong> You agree to provide current, complete, and accurate purchase and account information. Payments are processed securely via third-party processors.</li>
            <li><strong>Order Cancellation:</strong> We reserve the right to refuse or cancel any order for reasons including product availability, errors in product/pricing descriptions, or suspected fraudulent activity.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-black border-l-2 border-black pl-3">4. Shipping and Returns</h2>
          <p className="text-sm leading-relaxed text-neutral-600">
            Shipping and delivery times are estimates and cannot be guaranteed. Risk of loss and title for items purchased pass to you upon delivery to the carrier.
          </p>
          <p className="text-sm leading-relaxed text-neutral-600">
            Returns and refunds are processed in accordance with our 30-day return policy. Items must be returned in their original packaging and unused condition.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-black border-l-2 border-black pl-3">5. Intellectual Property</h2>
          <p className="text-sm leading-relaxed text-neutral-600">
            All content on the e-Market website, including text, graphics, logos, images, code, and design, is the property of e-Market or its content suppliers and is protected by international copyright, trademark, and other intellectual property laws.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-black border-l-2 border-black pl-3">6. Limitation of Liability</h2>
          <p className="text-sm leading-relaxed text-neutral-600">
            In no event shall e-Market, its directors, employees, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or goodwill, arising out of your access to or use of our services.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-black border-l-2 border-black pl-3">7. Governing Law</h2>
          <p className="text-sm leading-relaxed text-neutral-600">
            These Terms of Service shall be governed by and construed in accordance with the laws of the jurisdiction in which our business is registered, without regard to its conflict of law provisions.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-black border-l-2 border-black pl-3">8. Changes to Terms</h2>
          <p className="text-sm leading-relaxed text-neutral-600">
            We reserve the right, at our sole discretion, to modify or replace these Terms of Service at any time. We will post the revised terms on this page and update the "Last Updated" date at the top.
          </p>
        </section>
      </div>
    </div>
  );
}
