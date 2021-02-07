import React, {useState, createContext, useEffect} from 'react';
import axios from 'axios';

export const API_URL =
  'https://api.mercadolibre.com/sites/MLA/search?q=Motorola%20G6';

export const StoreContext = createContext();

export const StoreProvider = ({children}) => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([
    {nombre: 'Categoria 1', color: 'red', id: Math.random().toString(10)},
    {nombre: 'Categoria 2', color: 'blue', id: Math.random().toString(10)},
    {nombre: 'Categoria 3', color: 'green', id: Math.random().toString(10)},
    {nombre: 'Categoria 4', color: 'yellow', id: Math.random().toString(10)},
  ]);
  const [compradores, setCompradores] = useState([
    {id: '000', nombre: 'Juan Díaz', email: 'j.diaz@gmail.com'},
    {
      id: '111',
      nombre: 'Romina Alfonso',
      email: 'AlfonsoRomina@gmail.com',
    },
    {id: '222', nombre: 'Laura Walter', email: 'laura.walter@hotmail.com'},
    {
      id: '333',
      nombre: 'Servicios quimicos SRL',
      email: 'compras@serviciosquimicos.com',
    },
  ]);
  const [categoriasProductos, setCategoriasProductos] = useState({});

  const fetchData = async () => {
    try {
      const response = await axios.get(API_URL);
      setProductos(response.data.results);
    } catch (error) {
      console.error(error);
    }
  };

  const agregarProductoACategoria = (categoria, producto) => {
    if (!categoria?.id || !producto?.id) {
      return; // No hay id de categoria o producto
    }

    const categoriaProductos = categoriasProductos[categoria.id] ?? [];
    if (!categoriaProductos.includes(producto.id)) {
      //Si no esta lo agregamos
      const newCategoriasProductos = {
        ...categoriasProductos,
        [categoria.id]: [...categoriaProductos, producto.id],
      };
      setCategoriasProductos(newCategoriasProductos);
    }
  };

  const quitarProductoDeCategoria = (categoria, producto) => {
    if (!categoria?.id || !producto?.id) {
      return; // No hay id de categoria o producto
    }
    const categoriaProductos = categoriasProductos[categoria.id] ?? [];
    if (categoriaProductos.includes(producto.id)) {
      //Si esta lo quitamos
      setCategoriasProductos({
        ...categoriasProductos,
        [categoria.id]: categoriaProductos.filter((pid) => pid !== producto.id),
      });
    }
  };

  const obtenerCategoriasDelProducto = (producto) => {
    const categoriasId = Object.keys(categoriasProductos);
    const categoriasIdDelProducto = categoriasId.reduce(
      (acc, cur) =>
        categoriasProductos[cur].includes(producto.id) ? [...acc, cur] : acc,
      [],
    );
    const results = categorias.filter((c) =>
      categoriasIdDelProducto.includes(c.id),
    );
    return results;
  };

  const agregarComprador = (comprador) => {
    if (comprador.id) {
      return;
    }
    const id = Date.now();
    const newCompradores = [...compradores, {id: id, ...comprador}];
    setCompradores(newCompradores);
  };

  const modificarComprador = (comprador) => {
    if (
      comprador.id &&
      comprador.nombre.length > 1 &&
      comprador.email.length > 1
    ) {
      console.log('Voy a borrar comprador ' + comprador.nombre);
      const index = compradores.findIndex((e) => e.id === comprador.id);
      let auxArray = compradores;
      auxArray[index] = comprador;
      setCompradores(auxArray);
    }
  };

  const eliminarComprador = (id) => {
    if (id === null) {
      return;
    }
    setCompradores(compradores.filter((e) => e.id != id));
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <StoreContext.Provider
      value={{
        productos,
        setProductos,
        categorias,
        setCategorias,
        agregarProductoACategoria,
        quitarProductoDeCategoria,
        obtenerCategoriasDelProducto,
        compradores,
        setCompradores,
        agregarComprador,
        modificarComprador,
        eliminarComprador,
      }}>
      {children}
    </StoreContext.Provider>
  );
};
