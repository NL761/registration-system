"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";

// Define validation schema
const schema = z.object({
  name: z.string().min(1, "Name is required"),

  email: z.string().email("Invalid email"),

  phone: z.string().regex(/^[0-9]{10}$/, "Phone must be 10 digits"),

  dob: z.string().min(1, "Date of Birth is required"),
});

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
  try {
    setLoading(true);
    setMessage("");
    setIsSuccess(false);
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/register`,
      data
    );

    if (response.data.error) {
      setMessage(response.data.error);
      setIsSuccess(false);
    } else {
      setMessage("Registered");
      setIsSuccess(true);
      reset();
    }
  } catch (error) {
    setMessage("Something went wrong");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-100 to-gray-200">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-xl">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
          User Registration
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          {/* Name */}
          <div>
            <input
              {...register("name")}
              placeholder="Full Name"
              className="w-full rounded border p-2 text-gray-500 placeholder-gray-300"
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <input
              {...register("email")}
              placeholder="Email"
              type="email"
              className="w-full rounded border p-2 text-gray-500 placeholder-gray-300"
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <input
              {...register("phone")}
              placeholder="Phone Number"
              className="w-full rounded border p-2 text-gray-500 placeholder-gray-300"
            />
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone.message}</p>
            )}
          </div>

          {/* DOB */}
          <div>
            <label className="mb-1 block text-sm font-medium">
               Date of Birth
            </label>
            <input
              {...register("dob")}
              type="date"
              className="w-full rounded border p-2 text-gray-500 placeholder-gray-300"
            />
            {errors.dob && (
              <p className="text-sm text-red-500">{errors.dob.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled = {loading}
            className="w-full rounded bg-blue-600 p-2 text-white hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? "Submitting..." : "Register"}
          </button>
        </form>
        {message && (
          <p className={`mt-4 text-center text-sm font-medium ${
    isSuccess ? "text-green-600" : "text-red-600"
  }`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
