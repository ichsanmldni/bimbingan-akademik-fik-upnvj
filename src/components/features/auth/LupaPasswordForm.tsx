import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LupaPasswordForm: React.FC = () => {
  const [email, setEmail] = useState("");

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "/api/auth/lupapassword",
        { email },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast.success(
          response.data.message ||
            "Instruksi reset password telah dikirim ke email Anda!",
          {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          }
        );
      }
      setEmail("");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data.message ||
            "Gagal mengirim instruksi reset password!",
          {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          }
        );
      } else {
        toast.error("Terjadi kesalahan, coba lagi nanti!", {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      }
    }
  };

  return (
    <div className="border mx-4 md:mx-0 rounded-xl md:rounded-lg md:w-1/2 self-center p-4">
      <h3 className="text-[16px] text-center pt-4 pb-2 px-20 font-semibold md:text-[28px]">
        Lupa Password
      </h3>
      <form className="px-8 py-4 flex flex-col" onSubmit={handleForgotPassword}>
        <input
          type="email"
          className="px-3 py-2 text-[15px] mt-4 border focus:outline-none rounded-lg"
          placeholder="Masukkan Email Anda"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button
          type="submit"
          className="p-2 mt-4 mb-4 rounded-lg text-[14px] bg-orange-500 text-white hover:bg-orange-600"
        >
          Kirim Instruksi Reset Password
        </button>
        <ToastContainer />
      </form>
    </div>
  );
};

export default LupaPasswordForm;
