import React from 'react';
import { Link } from "react-router-dom";
import { Helmet } from 'react-helmet';
import { AiOutlineMail } from 'react-icons/ai';

const TermsOfService = () => {
  return (
    <div className=" px-4 py-8 mx-8">
      <Helmet>
        <title>NexHub.com | Terms of Service</title>
      </Helmet>
      
      <h1 className="text-4xl font-bold text-center mb-3">Terms of Service</h1>
      <p className='text-center mb-5'>{new Date().toLocaleDateString()}</p>
      
      <div className="space-y-6 text-gray-700">
        <p className="text-lg">
          By using the NexHub website, you agree to comply with and be bound by the following terms and conditions of use. Please review these terms carefully. If you do not agree to these terms, you should not use this website.
        </p>
        
        <section>
          <h2 className="text-2xl font-semibold mb-3">1. Use of the Website</h2>
          <p>
            The content of this website is for your general information and use only. It is subject to change without notice. Unauthorized use of this website may give rise to a claim for damages and/or be a criminal offense.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-3">2. Account Registration</h2>
          <p>
            In order to access certain features of the website, you may be required to register for an account. You are responsible for maintaining the confidentiality of your account information and password. You agree to accept responsibility for all activities that occur under your account.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-3">3. Product Information</h2>
          <p>
            We strive to provide accurate product information, but we do not warrant the completeness, accuracy, or reliability of any product information. Prices and availability are subject to change without notice. We reserve the right to discontinue any product at any time.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-3">4. User Conduct</h2>
          <p>
            You agree not to use the website for any unlawful purpose or any purpose prohibited under this agreement. You may not use the website in any manner that could damage, disable, overburden, or impair the website. You agree not to:
          </p>
          <ul className="list-disc pl-6 mt-2">
            <li>Use the website to harass, abuse, or threaten others</li>
            <li>Create false identities for the purpose of misleading others</li>
            <li>Publish, post, upload, distribute or disseminate any inappropriate, profane, defamatory, infringing, obscene, indecent or unlawful content</li>
            <li>Upload files that contain viruses or any other similar software or programs</li>
            <li>Download any file posted by another user that you know, or reasonably should know, cannot be legally distributed in such manner</li>
          </ul>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-3">5. Privacy Policy</h2>
          <p>
            Your use of the website is also governed by our Privacy Policy. Please review our Privacy Policy to understand our practices regarding the collection, use, and disclosure of your personal information.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-3">6. Intellectual Property</h2>
          <p>
            The content on this website, including but not limited to text, graphics, logos, images, audio clips, digital downloads, and software, is the property of NexHub or its content suppliers and is protected by international copyright laws. The compilation of all content on this site is the exclusive property of NexHub and is protected by international copyright laws.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-3">7. Limitation of Liability</h2>
          <p>
            In no event will NexHub be liable for any direct, indirect, special, punitive, incidental, exemplary, or consequential damages arising out of or in connection with your use of the website, the services, or the content. This includes, but is not limited to, damages for loss of profits, goodwill, use, data, or other intangible losses.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-3">8. Governing Law</h2>
          <p>
            These terms and conditions are governed by and construed in accordance with the laws of [Your Jurisdiction]. Any disputes arising under or in connection with these terms shall be subject to the exclusive jurisdiction of the courts located in [Your Jurisdiction].
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-3">9. Changes to Terms</h2>
          <p>
            NexHub reserves the right to modify these terms of service at any time. We will notify users of any material changes by posting a notice on our website. Your continued use of the website after changes are posted constitutes your acceptance of the amended terms.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-3">10. Termination</h2>
          <p>
            We may terminate or suspend your account and bar access to the website immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-3">11. Contact Information</h2>
          <p>
            If you have any questions about these terms of service, please contact us at{' '}
            <Link to="mailto:mrnamdev1372000@gmail.com" className="text-blue-600 hover:text-blue-800 inline-flex items-center">
              <AiOutlineMail className="text-xl" />
             <span> mrnamdev1372000@gmail.com</span>
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsOfService;