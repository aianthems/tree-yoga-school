import Image from "next/image";

export default function BookCover({ priority = false }: { priority?: boolean }) {
  return <Image className="book-cover" src="/images/books/tree-yoga-school-cover.webp" alt="Tree Yoga School book cover by Alex Julian: a woman in blue among autumn trees" width={894} height={1306} sizes="(max-width: 700px) 70vw, 340px" priority={priority} />;
}
