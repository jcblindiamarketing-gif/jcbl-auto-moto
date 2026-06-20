"use client";

import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import { useForm } from "react-hook-form";
import PhoneInputLib from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const PhoneInput = PhoneInputLib?.default || PhoneInputLib;

const ContactForm = () => {
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
        "template_8rcuqhf",
        {
          name: data.name,
          email: data.email,
          phone,
          productCategory: data.productCategory,
          productName: data.productName,
          message: data.message,
        },
        "lKjUzXdIiopdLX71i"
      );

      alert("Message sent successfully!");

      reset();
      setPhone("");
    } catch (err) {
      console.error("EmailJS Error:", err);
      alert("Error sending message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>

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

      <PhoneInput
        country="in"
        value={phone}
        onChange={setPhone}
        enableSearch
      />

      <select
        {...register("productCategory")}
        required
      >
        <option value="">
          Select Product Category
        </option>

        <option value="Car Spare Parts">
          Car Spare Parts
        </option>

        <option value="Motorcycle Spare Parts">
          Motorcycle Spare Parts
        </option>

        <option value="Heavy Machinery Parts">
          Heavy Machinery Parts
        </option>

        <option value="Tractor Parts">
          Tractor Parts
        </option>

        <option value="Batteries">
          Batteries
        </option>
      </select>

      <input
        {...register("productName")}
        placeholder="Product Name (Optional)"
      />

      <textarea
        {...register("message")}
        placeholder="Message"
        required
      />

      <button
        type="submit"
        className="btn btn-blue"
        disabled={loading}
      >
        {loading ? "Sending..." : "Send Message"}
      </button>

    </form>
  );
};

export default ContactForm;