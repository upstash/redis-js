import React from "react";

export default function ReadBlogPost({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="p-4 text-center bg-gray-100">{children}</div>;
}
