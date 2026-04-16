import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import { useForm } from "react-hook-form";

// ✅ FIXED import for Vite
import PhoneInputLib from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

// ✅ Ensure correct component
const PhoneInput = PhoneInputLib?.default || PhoneInputLib;

import "./CatalogueForm.css";

const CatalogueForm = () => {
  const { register, handleSubmit, reset } = useForm();
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    if (!phone || phone.length < 8) {
      alert("Enter valid phone number");
      return;
    }

    try {
      setLoading(true);

      await emailjs.send(
        "service_lmc907i",
        "template_i2pa56b",
        {
          name: data.name,
          email: data.email,
          phone: phone,
        },
        "lKjUzXdIiopdLX71i"
      );

      alert("Catalogue sent!");
      window.open("/catalogue.pdf", "_blank");

      reset();
      setPhone("");

    } catch (err) {
      console.error("EmailJS Error:", err);
      alert("Error sending form");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="catalogue-form">

      <input {...register("name")} placeholder="Name" required />

      <input
        {...register("email")}
        type="email"
        placeholder="Email"
        required
      />

    
      {typeof PhoneInput === "function" ? (
        <PhoneInput
          country="in"
          value={phone}
          onChange={setPhone}
          enableSearch
        />
      ) : (
        // 🔥 fallback if lib breaks
        <input
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      )}

      <button type="submit" className="btn btn-blue" disabled={loading}>
        {loading ? "Sending..." : "Download Catalogue"}
      </button>

    </form>
  );
};

export default CatalogueForm;