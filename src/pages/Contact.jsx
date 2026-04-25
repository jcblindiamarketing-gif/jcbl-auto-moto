import ContactInfo from "../components/ContactInfo";
import ContactForm from "../components/ContactForm";
import Map from "../components/Map";
import Breadcrumb from "../components/Breadcrumb"; // ✅ ADD THIS

import "../components/Contact.css";
import "../index.css";

function Contact() {
  return (
    <>
      {/* ✅ Breadcrumb */}
      <Breadcrumb title="Contact Us" />

      <div className="container contact-section">

    

        <ContactInfo />

        <div className="contact-grid">

          {/* LEFT → MAP */}
          <div className="map-box">
            <Map />
          </div>

          {/* RIGHT → FORM */}
          <div className="form-box">
            <ContactForm />
          </div>

        </div>

      </div>
    </>
  );
}

export default Contact;