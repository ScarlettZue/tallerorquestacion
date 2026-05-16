import { useState, useEffect } from 'react'
import { Form, Button, Table, Navbar, Container } from "react-bootstrap";
import './App.css'

function App() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [newDescription, setNewDescription] = useState("");

  useEffect(() => {
    fetch("http://localhost:4000/categories/")
      .then(res => res.json())
      .then(data => setCategories(data));
  }, []);

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (newCategory.trim() !== "" && newDescription.trim() !== "") {
      fetch("http://localhost:4000/categories/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: newCategory, 
          description: newDescription 
        })
      })
      .then(async res => {
        if (!res.ok) {
          const errorData = await res.json();
          console.error("Error del backend:", errorData);
          alert("Error: " + JSON.stringify(errorData));
          return;
        }
        const newCat = await res.json();
        setCategories([...categories, newCat]);
        setNewCategory("");
        setNewDescription("");
      })
      .catch(err => {
        console.error("Error de red:", err);
        alert("Error de red: " + err.message);
      });
    } else {
      alert("El nombre y la descripción no pueden estar vacíos");
    }
  };

  return (
    <div className="App">
      {/* Navbar elegante */}
      <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm">
        <Container>
          <Navbar.Brand href="#">Superstore</Navbar.Brand>
        </Container>
      </Navbar>

      <Container className="mt-4">
        <h2 className="text-center mb-4 title">Gestión de Categorías</h2>

        {/* Formulario con estilo */}
        <Form className="mb-4 p-4 shadow-sm rounded bg-light">
          <Form.Group className="mb-3">
            <Form.Label>Nueva Categoría</Form.Label>
            <Form.Control
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Escribe una categoría"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              type="text"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Escribe una descripción"
            />
          </Form.Group>

          <Button variant="primary" className="w-100" onClick={handleAddCategory}>
            Agregar
          </Button>
        </Form>

        {/* Tabla dentro de una card */}
        <div className="card shadow-sm">
          <div className="card-body">
            <Table striped hover responsive className="table-modern">
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Categoría</th>
                  <th>Descripción</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat.id}>
                    <td>{cat.id}</td>
                    <td>{cat.name}</td>
                    <td>{cat.description}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default App;
