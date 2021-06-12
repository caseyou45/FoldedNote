const INLINE_STYLES = [
  { icon: "lni lni-bold", style: "BOLD" },
  { icon: "lni lni-italic", style: "ITALIC" },
  { icon: "lni lni-underline", style: "UNDERLINE" },
  //   { label: "Monospace", style: "CODE" },
];

const BLOCK_TYPES = [
  { label: "H1", style: "header-one" },
  { label: "H2", style: "header-two" },
  { label: "H3", style: "header-three" },
  { label: "H4", style: "header-four" },
  { label: "H5", style: "header-five" },
  { label: "H6", style: "header-six" },
  { label: "UL", style: "unordered-list-item" },
  { label: "OL", style: "ordered-list-item" },
  { label: "Blockquote", style: "blockquote" },
  { label: "Code Block", style: "code-block" },
];

export default { INLINE_STYLES, BLOCK_TYPES };
