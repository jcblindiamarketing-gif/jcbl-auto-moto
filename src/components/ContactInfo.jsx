import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

function ContactInfo() {
  return (
    <div className="contact-info">

   <div className="contact-card">

  <div className="icon-circle">
    <FaPhoneAlt />
  </div>

  <div className="phone-list">
    <a href="tel:+918968100180">+91-8968100180</a>
    <a href="tel:+918288076221">+91-8288076221</a>
  </div>

</div>

      <a href="mailto:jcblindiamarketing@gmail.com" className="contact-card">
        <div className="icon-circle">
          <FaEnvelope />
        </div>
        <span>jcblindiamarketing@gmail.com</span>
      </a>

      <a
        href="https://maps.google.com/?q=Chandigarh,India"
        target="_blank"
        rel="noopener noreferrer"
        className="contact-card"
      >
        <div className="icon-circle">
          <FaMapMarkerAlt />
        </div>
        <span>Plot No. 580, Phase 9, Industrial Area, <br/> Sector 66, Punjab 160062, India</span>
      </a>

    </div>
  );
}

export default ContactInfo;