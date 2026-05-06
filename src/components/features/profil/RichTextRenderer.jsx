import React from 'react';
import { PortableText } from '@portabletext/react';

const components = {
  block: {
    normal: ({ children }) => (
      <p className="mb-4 text-gray-700 leading-relaxed">{children}</p>
    ),
    h1: ({ children }) => (
      <h1 className="text-3xl font-bold text-gray-900 mb-4 mt-6">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-2xl font-bold text-gray-900 mb-3 mt-5">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl font-semibold text-gray-900 mb-2 mt-4">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-lg font-semibold text-gray-900 mb-2 mt-3">{children}</h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-blue-500 pl-4 py-2 my-4 bg-gray-50 italic text-gray-600">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc list-inside mb-4 space-y-2">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal list-inside mb-4 space-y-2">{children}</ol>
    ),
  },
  marks: {
    link: ({ value, children }) => {
      const target = value?.href ? { target: value.href.startsWith('http') ? '_blank' : undefined } : {};
      return (
        <a
          href={value?.href}
          {...target}
          className="text-blue-600 hover:text-blue-800 underline"
        >
          {children}
        </a>
      );
    },
    bold: ({ children }) => (
      <strong className="font-bold text-gray-900">{children}</strong>
    ),
    italic: ({ children }) => (
      <em className="italic">{children}</em>
    ),
    underline: ({ children }) => (
      <span className="underline">{children}</span>
    ),
  },
  types: {
    image: ({ value }) => {
      return (
        <figure className="my-6">
          <img
            src={value.asset?.url}
            alt={value.alt || 'Image'}
            className="w-full rounded-lg shadow-md"
          />
          {value.caption && (
            <figcaption className="text-center text-gray-500 text-sm mt-2">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
};

const RichTextRenderer = ({ content }) => {
  if (!content) {
    return null;
  }

  return (
    <div className="prose prose-blue max-w-none">
      <PortableText value={content} components={components} />
    </div>
  );
};

export default RichTextRenderer;
