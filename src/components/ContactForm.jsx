function ContactForm() {

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message sent!");
  };

  return (
    <form onSubmit={handleSubmit}>

      <input
        type="text"
        placeholder="Name"
        required
      />

      <input
        type="email"
        placeholder="Email"
        required
      />

      <input
        type="tel"
        placeholder="Phone Number"
        pattern="[0-9]{10}"
        required
      />

      <textarea
        placeholder="Message"
        required
      />

      <button type="submit" className="btn-blue btn">
        Send Message
      </button>

    </form>
  );
}

export default ContactForm; 