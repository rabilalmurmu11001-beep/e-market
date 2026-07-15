import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy-policy")({
  component: PrivacyPolicyComponent,
});

function PrivacyPolicyComponent() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 font-sans text-neutral-800">
      {/* Page Header */}
      <div className="border-b border-neutral-200 pb-8 mb-10">
        <div className="flex items-center gap-3 mb-3">
          <span className="w-4 h-8 bg-black rounded-xs block"></span>
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Legal</span>
        </div>
        <h1 className="text-4xl font-black text-black uppercase tracking-tight">Privacy Policy</h1>
        <p className="text-sm text-neutral-500 mt-2">Last Updated: July 15, 2026</p>
      </div>

      {/* Intro */}
      <div className="prose prose-neutral max-w-none space-y-8">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-black border-l-2 border-black pl-3">1. Introduction</h2>
          <p className="text-sm leading-relaxed text-neutral-600">
            Welcome to e-Market ("we," "our," or "us"). We value your privacy and are committed to protecting your personal data. This Privacy Policy outlines how we collect, use, disclose, and safeguard your information when you visit our website or use our shopping services.
          </p>
          <p className="text-sm leading-relaxed text-neutral-600">
            Please read this policy carefully. By accessing or using our website, you agree to the collection and use of information in accordance with this Privacy Policy.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-black border-l-2 border-black pl-3">2. Information We Collect</h2>
          <p className="text-sm leading-relaxed text-neutral-600">
            We collect information that you provide directly to us when register an account, make a purchase, or subscribe to our newsletter. This information may include:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-sm text-neutral-600">
            <li><strong>Personal Details:</strong> Name, email address, physical shipping address, and phone number.</li>
            <li><strong>Payment Information:</strong> Credit card numbers, billing addresses, and payment processor tokens (processed securely; we do not store raw credit card data).</li>
            <li><strong>Account Preferences:</strong> Order history, item wishlists, and user profile preferences.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-black border-l-2 border-black pl-3">3. How We Use Your Information</h2>
          <p className="text-sm leading-relaxed text-neutral-600">
            We use the information we collect to operate, maintain, and improve our services, including:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-sm text-neutral-600">
            <li>Processing, fulfilling, and shipping your product orders.</li>
            <li>Managing your account registration and profile preferences.</li>
            <li>Sending you security alerts, order confirmations, and customer support messages.</li>
            <li>Providing marketing newsletters and promotional offers (which you can opt-out of at any time).</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-black border-l-2 border-black pl-3">4. Cookies and Tracking Technologies</h2>
          <p className="text-sm leading-relaxed text-neutral-600">
            We use cookies, web beacons, and similar tracking technologies to analyze web traffic, remember your shopping cart items, and personalize your shopping experience. You can manage cookies through your browser settings, but disabling them may limit some functionality of our web app.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-black border-l-2 border-black pl-3">5. Data Sharing and Third Parties</h2>
          <p className="text-sm leading-relaxed text-neutral-600">
            We do not sell, trade, or rent your personal information to third parties. We may share data with trusted service providers who assist us in operating our website, conducting our business, or shipping your orders (such as payment gateways and logistics companies), under strict confidentiality agreements.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-black border-l-2 border-black pl-3">6. Security of Your Information</h2>
          <p className="text-sm leading-relaxed text-neutral-600">
            We implement industry-standard administrative, technical, and physical security measures (including SSL/TLS encryption) to protect your personal information. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-black border-l-2 border-black pl-3">7. Your Rights and Choices</h2>
          <p className="text-sm leading-relaxed text-neutral-600">
            Depending on your jurisdiction, you may have rights to access, correct, delete, or limit the use of your personal data. You can manage your profile settings directly through the profile page, or contact our support team at <a href="mailto:support@e-market.com" className="text-black underline font-semibold">support@e-market.com</a> for assistance.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-black border-l-2 border-black pl-3">8. Changes to This Privacy Policy</h2>
          <p className="text-sm leading-relaxed text-neutral-600">
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
          </p>
        </section>
      </div>
    </div>
  );
}
