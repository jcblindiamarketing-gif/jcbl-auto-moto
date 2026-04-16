import ContactInfo from "../components/ContactInfo";
import ContactForm from "../components/ContactForm";
import Map from "../components/Map";
import "../components/Contact.css";
import "../index.css";
function Contact() {
  return (
    <div className="container contact-section">

      <h1>Contact Us</h1>

      <ContactInfo />

   <div className="contact-grid">

  {/* LEFT → MAP */}
  <div className="map-box">
    <Map />
  </div>

  <div className="form-box">
    <ContactForm />
  </div>

</div>

    </div>
  );
}

export default Contact;