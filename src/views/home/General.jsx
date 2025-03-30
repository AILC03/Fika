import Calendar from "../../components/calendar";

const General = () => {
  return (
    <div className="h-screen flex">
      {/* Contenido principal */}
      <main className="flex-grow flex">
        {/* Columna izquierda */}
        <div className="flex flex-col w-4/6 m-5">
          <div id="Calendario" className="flex-grow mb-5 bg-yellow-100">
            <Calendar />
          </div>
          <div id="cantidades" className="bg-yellow-200 p-4">
            Cantidades
            <span>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit.
              Molestias sint numquam iusto voluptatum omnis blanditiis, nihil
              optio repudiandae laborum, ducimus obcaecati sed temporibus
              aperiam eaque quisquam distinctio. Eum, porro praesentium?
            </span>
            <span>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit.
              Molestias sint numquam iusto voluptatum omnis blanditiis, nihil
              optio repudiandae laborum, ducimus obcaecati sed temporibus
              aperiam eaque quisquam distinctio. Eum, porro praesentium?
            </span>
            <span>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit.
              Molestias sint numquam iusto voluptatum omnis blanditiis, nihil
              optio repudiandae laborum, ducimus obcaecati sed temporibus
              aperiam eaque quisquam distinctio. Eum, porro praesentium?
            </span>
            <span>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit.
              Molestias sint numquam iusto voluptatum omnis blanditiis, nihil
              optio repudiandae laborum, ducimus obcaecati sed temporibus
              aperiam eaque quisquam distinctio. Eum, porro praesentium?
            </span>
            <span>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit.
              Molestias sint numquam iusto voluptatum omnis blanditiis, nihil
              optio repudiandae laborum, ducimus obcaecati sed temporibus
              aperiam eaque quisquam distinctio. Eum, porro praesentium?
            </span>
          </div>
        </div>

        {/* Columna derecha */}
        <div id="eventos" className="flex-grow bg-gray-100 p-4">
          Eventos
        </div>
      </main>
    </div>
  );
};

export default General;
