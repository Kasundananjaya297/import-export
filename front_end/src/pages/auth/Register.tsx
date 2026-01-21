/** @format */

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import LogoOne from "../../assets/LogoFish.png";
import { useAuth } from "../../context/AuthContext";
import { useSnackbar } from "notistack";
import { RegisterData } from "../../services/authService";

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    gender: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "USA",
    email: "",
    contact: "",
    password: "",
    confirmPassword: "",
    company: "",
    role: "importer",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fname.trim()) newErrors.fname = "First name is required";
    if (!formData.lname.trim()) newErrors.lname = "Last name is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.addressLine1.trim())
      newErrors.addressLine1 = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    if (!formData.zipCode.trim()) newErrors.zipCode = "ZIP code is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";
    if (!formData.contact.trim())
      newErrors.contact = "Contact number is required";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (!formData.company.trim())
      newErrors.company = "Company name is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const registerData: RegisterData = {
        fname: formData.fname,
        lname: formData.lname,
        gender: formData.gender,
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country,
        email: formData.email,
        contact: formData.contact,
        password: formData.password,
        role: formData.role,
        company: formData.company,
      };
      const res = await register(registerData);
      if (res.status === 201) {
        enqueueSnackbar("Registration successful! Please log in.", {
          variant: "success",
        });
        navigate("/login");
      } else {
        enqueueSnackbar(res.data.message, {
          variant: "error",
        });
      }
    } catch (error: any) {
      enqueueSnackbar("Registration failed. Please try again.", {
        variant: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper class strings sharing Login.tsx styles
  const inputClass = "w-full p-3 rounded-3xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-all";
  const labelClass = "block text-sm text-slate-600 mb-1";
  const errorClass = "text-red-500 text-xs mt-1 ml-1";

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-white py-10">
      <div className="bg-white p-8 rounded-2xl w-full max-w-4xl z-10 mx-4 shadow-2xl border border-slate-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-800">
            Create Account
          </h2>
          <p className="text-slate-500 mt-2">Join us to start trading globally</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Info */}
          <h3 className="text-lg font-semibold text-slate-700 border-b pb-2">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>First Name</label>
              <input
                name="fname"
                type="text"
                required
                className={inputClass}
                value={formData.fname}
                onChange={handleChange}
                placeholder="John"
              />
              {errors.fname && <p className={errorClass}>{errors.fname}</p>}
            </div>
            <div>
              <label className={labelClass}>Last Name</label>
              <input
                name="lname"
                type="text"
                required
                className={inputClass}
                value={formData.lname}
                onChange={handleChange}
                placeholder="Doe"
              />
              {errors.lname && <p className={errorClass}>{errors.lname}</p>}
            </div>
            <div>
              <label className={labelClass}>Gender</label>
              <select
                name="gender"
                className={`${inputClass} appearance-none`}
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="" disabled>Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors.gender && <p className={errorClass}>{errors.gender}</p>}
            </div>
            <div>
              <label className={labelClass}>Contact Number</label>
              <input
                name="contact"
                type="text"
                required
                className={inputClass}
                value={formData.contact}
                onChange={handleChange}
                placeholder="+1 234 567 890"
              />
              {errors.contact && <p className={errorClass}>{errors.contact}</p>}
            </div>
          </div>

          {/* Address Info */}
          <h3 className="text-lg font-semibold text-slate-700 border-b pb-2 mt-6">Address</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className={labelClass}>Address Line 1</label>
              <input
                name="addressLine1"
                type="text"
                required
                className={inputClass}
                value={formData.addressLine1}
                onChange={handleChange}
                placeholder="123 Main St"
              />
              {errors.addressLine1 && <p className={errorClass}>{errors.addressLine1}</p>}
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Address Line 2 (Optional)</label>
              <input
                name="addressLine2"
                type="text"
                className={inputClass}
                value={formData.addressLine2}
                onChange={handleChange}
                placeholder="Apt 4B"
              />
            </div>
            <div>
              <label className={labelClass}>City</label>
              <input
                name="city"
                type="text"
                required
                className={inputClass}
                value={formData.city}
                onChange={handleChange}
                placeholder="New York"
              />
              {errors.city && <p className={errorClass}>{errors.city}</p>}
            </div>
            <div>
              <label className={labelClass}>State</label>
              <input
                name="state"
                type="text"
                required
                className={inputClass}
                value={formData.state}
                onChange={handleChange}
                placeholder="NY"
              />
              {errors.state && <p className={errorClass}>{errors.state}</p>}
            </div>
            <div>
              <label className={labelClass}>ZIP Code</label>
              <input
                name="zipCode"
                type="text"
                required
                className={inputClass}
                value={formData.zipCode}
                onChange={handleChange}
                placeholder="10001"
              />
              {errors.zipCode && <p className={errorClass}>{errors.zipCode}</p>}
            </div>
            <div>
              <label className={labelClass}>Country</label>
              <input
                name="country"
                type="text"
                required
                className={inputClass}
                value={formData.country}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Account Info */}
          <h3 className="text-lg font-semibold text-slate-700 border-b pb-2 mt-6">Account Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className={labelClass}>Company Name</label>
              <input
                name="company"
                type="text"
                required
                className={inputClass}
                value={formData.company}
                onChange={handleChange}
                placeholder="Acme Corp"
              />
              {errors.company && <p className={errorClass}>{errors.company}</p>}
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Email Address</label>
              <input
                name="email"
                type="email"
                required
                className={inputClass}
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
              />
              {errors.email && <p className={errorClass}>{errors.email}</p>}
            </div>

            <div>
              <label className={labelClass}>Password</label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className={`${inputClass} pr-10`}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <p className={errorClass}>{errors.password}</p>}
            </div>
            <div>
              <label className={labelClass}>Confirm Password</label>
              <div className="relative">
                <input
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  required
                  className={`${inputClass} pr-10`}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                />
              </div>
              {errors.confirmPassword && <p className={errorClass}>{errors.confirmPassword}</p>}
            </div>

            <div className="md:col-span-2">
              <label className={labelClass}>Account Type</label>
              <select
                name="role"
                className={`${inputClass} appearance-none`}
                value={formData.role}
                onChange={handleChange}
              >
                <option value="importer">Importer</option>
                <option value="exporter">Exporter</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-3xl bg-sky-400 hover:bg-sky-500 text-white font-medium shadow-md transition-all active:scale-[0.98] mt-8 text-lg"
          >
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="text-sky-500 hover:text-sky-600 transition-colors font-medium">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
