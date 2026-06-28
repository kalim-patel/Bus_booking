import { ContactMessage } from "../models/ContactMessage.js";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** POST /api/contact */
export async function submitContact(req, res) {
  try {
    const { name, email, subject, message } = req.body;

    if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
      return res.status(400).json({ message: "All fields are required." });
    }
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ message: "Valid email is required." });
    }
    if (subject.trim().length < 3) {
      return res.status(400).json({ message: "Subject must be at least 3 characters." });
    }
    if (message.trim().length < 10) {
      return res.status(400).json({ message: "Message must be at least 10 characters." });
    }

    const saved = await ContactMessage.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
    });

    console.info("[Contact] New message:", saved._id.toString(), saved.subject);

    return res.status(201).json({ message: "Message received. We will get back to you soon." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Could not send message. Please try again." });
  }
}
