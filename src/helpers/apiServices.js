export const fetchData = async (endpoint, setData, setLoading, setError) => {
    setLoading(true);
    try {
      const response = await fetch(endpoint);
      if (!response.ok) throw new Error("Error al obtener los datos.");
      const data = await response.json();
      setData(data);
    } catch (err) {
      console.error(err);
      setError("No se pudo cargar la información.");
    } finally {
      setLoading(false);
    }
  };
  