import { createSignal } from "solid-js";

export default function Contact() {
  const [name, setName] = createSignal("");
  const [email, setEmail] = createSignal("");
  const [message, setMessage] = createSignal("");

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    alert(
      `Form submitted!\nName: ${name()}\nEmail: ${email()}\nMessage: ${message()}`
    );
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <div class="contact-page">
      <h1>Contact Us</h1>
      <div class="card">
        <form onSubmit={handleSubmit} class="contact-form">
          <div class="form-group">
            <label for="name">Name:</label>
            <input
              id="name"
              type="text"
              value={name()}
              onInput={(e) => setName(e.currentTarget.value)}
              required
            />
          </div>

          <div class="form-group">
            <label for="email">Email:</label>
            <input
              id="email"
              type="email"
              value={email()}
              onInput={(e) => setEmail(e.currentTarget.value)}
              required
            />
          </div>

          <div class="form-group">
            <label for="message">Message:</label>
            <textarea
              id="message"
              value={message()}
              onInput={(e) => setMessage(e.currentTarget.value)}
              rows={4}
              required
            />
          </div>

          <button type="submit">Send Message</button>
        </form>
      </div>
    </div>
  );
}
