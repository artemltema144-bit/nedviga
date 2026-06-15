"use client";

import Link from "next/link";
import { useFormState } from "react-dom";
import { signup } from "./actions";

export default function Page() {
  const [state, action] = useFormState(signup, null);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-50">
      <div className="p-8 bg-white shadow-md rounded-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-[#222]">Регистрация в nedviga</h1>
        <form action={action} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              name="email"
              type="email"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#00aa61] focus:border-[#00aa61]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Пароль</label>
            <input
              name="password"
              type="password"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#00aa61] focus:border-[#00aa61]"
            />
          </div>
          {state?.error && <p className="text-red-500 text-sm">{state.error}</p>}
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#00aa61] hover:bg-[#008f51] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00aa61]"
          >
            Зарегистрироваться
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Уже есть аккаунт?{" "}
          <Link href="/login" className="text-[#0077ff] hover:underline">
            Войти
          </Link>
        </p>
      </div>
    </div>
  );
}
