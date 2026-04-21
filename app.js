const express = require("express");
const app = express();
const PORT = 5555;

app.use(express.json());

// In-memory data store
let items = [];
let nextId = 1;

// GET all items
app.get("/items", (req, res) => {
  res.json({ success: true, data: items });
});

// GET single item by ID
app.get("/items/:id", (req, res) => {
  const item = items.find((i) => i.id === parseInt(req.params.id));
  if (!item) {
    return res.status(404).json({ success: false, message: "Item not found" });
  }
  res.json({ success: true, data: item });
});

// POST create a new item
app.post("/items", (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ success: false, message: "Name is required" });
  }

  const newItem = {
    id: nextId++,
    name,
    description: description || "",
    createdAt: new Date().toISOString(),
  };

  items.push(newItem);
  res.status(201).json({ success: true, data: newItem });
});

// PUT update an item by ID
app.put("/items/:id", (req, res) => {
  const index = items.findIndex((i) => i.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ success: false, message: "Item not found" });
  }

  const { name, description } = req.body;
  items[index] = {
    ...items[index],
    name: name ?? items[index].name,
    description: description ?? items[index].description,
    updatedAt: new Date().toISOString(),
  };

  res.json({ success: true, data: items[index] });
});

// DELETE an item by ID
app.delete("/items/:id", (req, res) => {
  const index = items.findIndex((i) => i.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ success: false, message: "Item not found" });
  }

  const deleted = items.splice(index, 1)[0];
  res.json({ success: true, data: deleted });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
