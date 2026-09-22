
import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import { useForm } from "react-hook-form";

import PhoneInputLib from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const PhoneInput = PhoneInputLib?.default || PhoneInputLib;

import "./CatalogueForm.css";

const CatalogueForm = () => {
  const { register, handleSubmit, reset } = useForm();
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const onSubmit = async (data) => {
    if (!phone || phone.length < 8) {
      alert("Enter valid phone number");
      return;
    }

    try {
      setLoading(true);
      setSuccess(false);

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

      // Show success message
      setSuccess(true);

      // Reset form
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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="catalogue-form"
    >
      {success ? (
        <div className="success-message">
          <h3>Thank You!</h3>
          <p>
            We received your request.
            <br />
            We will contact you within 24 hours.
          </p>
        </div>
      ) : (
        <>
          <input
            {...register("name")}
            placeholder="Name"
            required
          />

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
            <input
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          )}

          <button
            type="submit"
            className="btn btn-blue"
            disabled={loading}
          >
            {loading
              ? "Sending..."
              : "Request a Catalogue"}
          </button>
        </>
      )}
    </form>
  );
};

export default CatalogueForm;