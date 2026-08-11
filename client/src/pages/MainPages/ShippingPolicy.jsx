import React from "react";
import { Helmet } from "react-helmet";

const ShippingPolicy = () => {
  return (
    <>
      <Helmet>
        <title>Zapster.com | Shipping Policy</title>
      </Helmet>

      <div className=" px-4 py-8 mx-8">
        <h1 className="text-4xl font-bold text-center mb-8">Shipping Policy</h1>

        <div className="space-y-6 text-gray-700">
          <p className="text-center mb-5">
            Last Updated:{new Date().toLocaleDateString()}
          </p>

          <p>
            Welcome to Zapster's Shipping Policy. This document outlines our
            procedures and guidelines for shipping products to our valued
            customers. By placing an order with Zapster, you agree to the terms
            described in this policy.
          </p>

          <section>
            <h2 className="text-2xl font-semibold mb-3">1. Shipping Methods</h2>
            <p>
              We offer various shipping methods to cater to your delivery needs.
              The available options and estimated delivery times will be clearly
              presented during the checkout process. Our shipping methods
              include:
            </p>
            <ul className="list-disc pl-6 mt-2">
              <li>Standard Shipping (5-7 business days)</li>
              <li>Expedited Shipping (2-3 business days)</li>
              <li>Overnight Shipping (1 business day, where available)</li>
              <li>International Shipping (10-14 business days)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">2. Processing Time</h2>
            <p>
              Orders are typically processed within 1-2 business days. Please
              note that processing time may vary during peak seasons or
              promotions. For made-to-order or personalized items, processing
              time may be longer. We will communicate any extended processing
              times before you complete your purchase.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">3. Shipping Costs</h2>
            <p>
              Shipping costs are calculated at checkout based on the selected
              shipping method, delivery address, and the weight of the items in
              your order. Please review the total cost before confirming your
              purchase. We occasionally offer free shipping promotions for
              orders above a certain value. Check our promotions page or
              subscribe to our newsletter for updates on such offers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">4. Shipping Delays</h2>
            <p>
              While we strive for timely deliveries, unforeseen circumstances or
              events beyond our control may cause shipping delays. These may
              include:
            </p>
            <ul className="list-disc pl-6 mt-2">
              <li>Severe weather conditions</li>
              <li>Natural disasters</li>
              <li>Customs delays for international shipments</li>
              <li>Carrier-specific issues</li>
            </ul>
            <p className="mt-2">
              We will promptly communicate any delays and provide support to
              address any issues that may arise. You can track your order using
              the tracking number provided in your shipping confirmation email.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">
              5. International Shipping
            </h2>
            <p>
              We ship to many countries worldwide. International customers are
              responsible for any customs duties, taxes, or fees imposed by
              their country. These charges are not included in the purchase
              price or shipping cost. Please check your local customs
              regulations before placing an order.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">6. Packaging</h2>
            <p>
              We take great care in packaging your items to ensure they arrive
              in perfect condition. We use eco-friendly packaging materials
              whenever possible. If you have specific packaging requests, please
              contact our customer service team before placing your order.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">
              7. Order Changes and Cancellations
            </h2>
            <p>
              If you need to change or cancel your order, please contact us as
              soon as possible. We can typically accommodate changes or
              cancellations if the order has not yet been processed or shipped.
              Once an order has been shipped, it cannot be changed or canceled.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">
              8. Lost or Damaged Packages
            </h2>
            <p>
              In the rare event that your package is lost or damaged during
              transit, please contact our customer service team immediately. We
              will work with the shipping carrier to locate your package or
              process a claim. If necessary, we will arrange for a replacement
              shipment at no additional cost to you.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">
              9. Contact Information
            </h2>
            <p>
              If you have any questions about our shipping policy or encounter
              any issues with your order, please do not hesitate to contact our
              customer service at{" "}
              <a
                href="mailto:mrnamdev1372000@gmail.com"
                className="text-blue-600 hover:text-blue-800"
              >
                mrnamdev1372000@gmail.com
              </a>
              . We are here to assist you.
            </p>
          </section>

          <p className="font-semibold mt-8">
            Thank you for choosing Zapster. We appreciate your business and are
            committed to providing you with the best possible shopping and
            shipping experience.
          </p>
        </div>
      </div>
    </>
  );
};

export default ShippingPolicy;
