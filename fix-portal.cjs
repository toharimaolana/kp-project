const fs = require('fs');
let c = fs.readFileSync('src/components/features/NewsPortal.jsx', 'utf8');
c = c.replace("import React, { useEffect, useState } from 'react';", "import React, { useEffect, useState } from 'react';\nimport { Link } from 'react-router-dom';");
c = c.replace("const NewsCard = ({ news, index }) => (\n  <motion.div", "const NewsCard = ({ news, index }) => (\n  <Link to={`/berita/${news.slug}`} className=\"block h-full\">\n    <motion.div");
let l = c.split('\n');
let n = [];
for (let i = 0; i < l.length; i++) {
  n.push(l[i]);
  if (l[i].trim() === '</motion.div>' && l[i + 1] && l[i + 1].trim() === ')') {
    n.push('  </Link>');
    i++;
  }
}
fs.writeFileSync('src/components/features/NewsPortal.jsx', n.join('\n'));
console.log('fixed');
