// Temporary public inbox confirmed by the founder; change this value when the school inbox is ready.
export const schoolContactEmail = "alexanderjulian33@gmail.com";
export const contactTopics = [
  { value: "hello", label: "Say hello / ask a question" },
  { value: "correction", label: "Report a correction" },
  { value: "observation", label: "Contribute a tree observation" },
  { value: "volunteer", label: "Big Tree Volunteers interest" },
] as const;
export function contactDraft(topic: string, reference: string, message: string) {
  const choice = contactTopics.find(item => item.value === topic) ?? contactTopics[0];
  const subject = `Tree Yoga School: ${choice.label}`;
  const body = `Page or tree record: ${reference.trim() || "Not specified"}\n\n${message.trim()}\n`;
  return { subject, body, href: schoolContactEmail ? `mailto:${schoolContactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}` : "" };
}
