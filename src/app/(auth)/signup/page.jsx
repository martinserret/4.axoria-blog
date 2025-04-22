export default function page() {
  return (
    <form className="max-w-md mx-auto mt-36">
      <label
        htmlFor="userName"
        className="f-label"
      >Name or pseudo</label>
      <input
        className="f-auth-input"
        type="text"
        id="userName"
        name="userName"
        placeholder="Your name or pseudo"
        required
      />

      <label
        htmlFor="email"
        className="f-label"
      >E-mail</label>
      <input
        className="f-auth-input"
        type="email"
        id="email"
        name="email"
        placeholder="Your e-mail"
        required
      />

      <label
        htmlFor="password"
        className="f-label"
      >Password</label>
      <input
        className="f-auth-input"
        type="password"
        id="password"
        name="password"
        placeholder="Your password"
        required
      />

      <label
        htmlFor="passwordRepeat"
        className="f-label"
      >Confirm Password</label>
      <input
        className="f-auth-input"
        type="password"
        id="passwordRepeat"
        name="passwordRepeat"
        placeholder="Confirm your password"
        required
      />

      <button
        className="w-full bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-3 px-4 my-10 rounded border-none"
      >
        Submit
      </button>

      <a 
        href="/signin"
        className="mb-5 underline text-blue-600 block text-center"
      >
        Already have an account ? Log in
      </a>

    </form>
  );
}