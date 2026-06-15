import DOMPurify from "dompurify";

export default function sanitizeHTML(html) {
    return DOMPurify.sanitize(html);
}
