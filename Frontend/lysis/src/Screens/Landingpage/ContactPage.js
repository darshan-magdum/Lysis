import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../Styles/ContactPage.css";

function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contactNo: "",
    description: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/Contact/AddContact", formData);
      console.log(response.data);
      toast.success("Form submitted successfully!");
    } catch (error) {
      console.error("There was an error submitting the form!", error.response.data);
      toast.error("There was an error submitting the form.");
    }
  };

  return (
    <section className="section-contact-us">
      <div className="container">
        <div className="contact-blur-circle1"></div>
        <div className="contact-blur-circle2"></div>
        <div className="row justify-content-center text-center">
          <div className="col-md-10 col-lg-8">
            <div className="header-section">
              <h2 className="title">Contact<span> Us</span></h2>
              <p className="description">
                We'd love to hear from you! Please fill out the form below and we will get in touch with you shortly.
              </p>
            </div>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-md-8">
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  placeholder="Enter your name"
                  value={formData.name} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  placeholder="Enter your email"
                  value={formData.email} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="contactNo">Contact No</label>
                <input 
                  type="text" 
                  id="contactNo" 
                  name="contactNo" 
                  placeholder="Enter your contact number"
                  value={formData.contactNo} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea 
                  id="description" 
                  name="description" 
                  placeholder="Enter your message"
                  value={formData.description} 
                  onChange={handleChange} 
                  required 
                ></textarea>
              </div>
              <button type="submit" className="btn-submit">Submit</button>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </section>
  );
}

export default ContactPage;
