viewof letters = Inputs.text({
  label: "Type letters",
  placeholder: "Enter letters separated by commas or spaces",
});

letterss = letters.split(", ").map(letter => letter.trim());

WordCloud(words, {
  width: 800, 
  height: 400, 
  fill: word => {
  if (panagrams.includes(word)) {
    return "teal"; 
  }
  return word.length > 6 ? "black" : "lightgrey"; 
},
  size: word => word.length * 5,
  padding: 2,
  rotate: (_, i) => (i % 2 === 0 ? 90 : 0)
});

midletter = letters[0]

w = await d3.csv("https://raw.githubusercontent.com/jacehiga/Automation/refs/heads/main/words_list.csv")

wo = w.map(obj => obj.aa)

wor = wo.filter(wo => wo.length >= 4);

alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');

eliminate = alphabet.filter(letter => !letters.includes(letter));

word = wor.filter(word => doesNotContainEliminate(word, eliminate));

words = word.filter(word => 
  word.includes(midletter));

doesNotContainEliminate = (word, eliminate) => {
  return !word.split('').some(letter => eliminate.includes(letter)); 
};

containsAllLetters = (word, letters) => {
  if (!Array.isArray(letters)) {
    throw new Error("The letters argument must be an array.");
  }
  return letters.every(letter => word.includes(letter));
};

function findPanagrams(Words, letters) {
  return Words.filter(word =>
    letterss.every(letter => word.includes(letter))
  );
}

panagrams = findPanagrams(words, letters);

function WordCloud(text, {
  size = group => group.length, // Given a grouping of words, returns the size factor for that word
  word = d => d, // Given an item of the data array, returns the word
  marginTop = 0, // top margin, in pixels
  marginRight = 0, // right margin, in pixels
  marginBottom = 0, // bottom margin, in pixels
  marginLeft = 0, // left margin, in pixels
  width = 640, // outer width, in pixels
  height = 400, // outer height, in pixels
  maxWords = 250, // maximum number of words to extract from the text
  fontFamily = "sans-serif", // font family
  fontScale = 15, // base font size
  fill = null, // text color, can be a constant or a function of the word
  padding = 0, // amount of padding between the words (in pixels)
  rotate = 0, // a constant or function to rotate the words
  invalidation // when this promise resolves, stop the simulation
} = {}) {
  const words = typeof text === "string" ? text.split(/\W+/g) : Array.from(text);
  
  const data = d3.rollups(words, size, w => w)
    .sort(([, a], [, b]) => d3.descending(a, b))
    .slice(0, maxWords)
    .map(([key, size]) => ({text: word(key), size}));
  
  const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, height])
      .attr("width", width)
      .attr("font-family", fontFamily)
      .attr("text-anchor", "middle")
      .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

  const g = svg.append("g").attr("transform", `translate(${marginLeft},${marginTop})`);

  const cloud = d3Cloud()
      .size([width - marginLeft - marginRight, height - marginTop - marginBottom])
      .words(data)
      .padding(padding)
      .rotate(rotate)
      .font(fontFamily)
      .fontSize(d => Math.sqrt(d.size) * fontScale)
      .on("word", ({size, x, y, rotate, text}) => {
        g.append("text")
            .datum(text)
            .attr("font-size", size)
            .attr("fill", fill)
            .attr("transform", `translate(${x},${y}) rotate(${rotate})`)
            .text(text);
      });

  cloud.start();
  invalidation && invalidation.then(() => cloud.stop());
  return svg.node();
}

d3Cloud = require("d3-cloud@1")
