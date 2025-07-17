"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

interface Article {
  id: number;
  title: string;
  content: string;
  author_name: string;
  date: string;
  image_url: string;
  created_at: string;
  published: boolean;
  slug: string;
  url: string;
}

export default function ArticleDetailPage() {
  const params = useParams();
  const { slug } = params as { slug: string };
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/articles/?slug=${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length > 0) {
          setArticle(data[0]);
        } else {
          setArticle(null);
        }
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (!article) {
    return <div className="p-8 text-center">Article not found.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-8">
      <Link href="/articles" className="text-blue-600 hover:underline mb-4 inline-block">&larr; Back to Articles</Link>
      <h1 className="text-3xl font-bold mb-2">{article.title}</h1>
      <div className="text-gray-500 mb-4">
        By {article.author_name || "Unknown"} | {article.date || article.created_at}
      </div>
      {article.image_url && (
        <Image
          src={article.image_url}
          alt={article.title}
          width={800}
          height={500}
          className="mb-6 rounded shadow"
          style={{ width: '100%', height: 'auto' }}
        />
      )}
      <div className="prose" dangerouslySetInnerHTML={{ __html: article.content }} />
    </div>
  );
} 