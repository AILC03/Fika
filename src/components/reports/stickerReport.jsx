import jsPDF from "jspdf";
import Logo from "../../Assets/logo1.png";
import { format } from "date-fns";
import es from "date-fns/locale/es";

const EtiquetasPedidos = ({ pedidosSeleccionados }) => {

  const generarEtiquetas = () => {
    if (pedidosSeleccionados.length === 0) {
      alert("Por favor selecciona al menos un pedido");
      return;
    }

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
    });

    // Configuración del documento
    doc.setProperties({
      title: `Etiquetas de Pasteles - ${format(new Date(), "PPPP", {
        locale: es,
      })}`,
      subject: "Etiquetas para pasteles",
      author: "Pastelería",
      keywords: "etiquetas, pasteles, pedidos",
      creator: "Sistema de Pastelería",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 10;
    const labelWidth = 90;
    const labelHeight = 70;
    const labelsPerRow = 2;
    const gap =
      (pageWidth - labelsPerRow * labelWidth - 2 * margin) / (labelsPerRow - 1);

    let currentRow = 0;
    let currentCol = 0;
    let itemCounter = 0;

    pedidosSeleccionados.forEach((pedido) => {
      // Procesar cada cake del pedido
      pedido.cakes.forEach((cake) => {
        // Para items numéricos, generar una etiqueta por cada dígito
        if (cake.itemType === "NUMERIC") {
          if (itemCounter > 0 && itemCounter % 4 === 0) {
            doc.addPage();
            currentRow = 0;
            currentCol = 0;
          }

          generarEtiquetaIndividual(
            doc,
            pedido,
            cake,
            currentCol * (labelWidth + gap) + margin,
            currentRow * labelHeight + margin,
            labelWidth,
            labelHeight,
            itemCounter + 1
          );

          actualizarPosicion();
        }
        // Para pasteles multinivel, generar una etiqueta por piso
        else if (cake.itemType === "MULTIFLOOR") {
          cake.floors?.forEach((floor, index) => {
            if (itemCounter > 0 && itemCounter % 4 === 0) {
              doc.addPage();
              currentRow = 0;
              currentCol = 0;
            }

            generarEtiquetaPiso(
              doc,
              pedido,
              cake,
              floor,
              index + 1,
              currentCol * (labelWidth + gap) + margin,
              currentRow * labelHeight + margin,
              labelWidth,
              labelHeight,
              itemCounter + 1
            );

            actualizarPosicion();
          });
        }
        // Para otros tipos de cakes, generar una etiqueta por item
        else {
          if (itemCounter > 0 && itemCounter % 4 === 0) {
            doc.addPage();
            currentRow = 0;
            currentCol = 0;
          }

          generarEtiquetaIndividual(
            doc,
            pedido,
            cake,
            currentCol * (labelWidth + gap) + margin,
            currentRow * labelHeight + margin,
            labelWidth,
            labelHeight,
            itemCounter + 1
          );

          actualizarPosicion();
        }
      });
    });

    function generarEtiquetaIndividual(
      doc,
      pedido,
      cake,
      x,
      y,
      width,
      height,
      counter
    ) {
      // Marco de la etiqueta
      doc.setDrawColor(200);
      doc.rect(x, y, width, height);

      // Logo
      doc.addImage(Logo, "PNG", x + 5, y + 5, 15, 15);

      // Información del pedido
      doc.setFontSize(10);
      doc.setTextColor(40);
      doc.setFont("helvetica", "bold");
      doc.text(`Etiqueta #${counter}`, x + 25, y + 10);

      doc.setFont("helvetica", "normal");
      doc.text(`Pedido: #${pedido.id}`, x + 25, y + 15);
      doc.text(`Cliente: ${pedido.client?.fullName || "N/A"}`, x + 25, y + 20);
      doc.text(
        `Recolección: ${format(new Date(pedido.pickupDate), "PPpp", {
          locale: es,
        })}`,
        x + 25,
        y + 25
      );

      // Alergias
      if (pedido.caution) {
        doc.setTextColor(231, 76, 60);
      } else {
        doc.setTextColor(40, 40, 40);
      }

      doc.text(
        `Alergias: ${pedido.caution ? "SÍ - PRECAUCIÓN" : "NO"}`,
        x + 25,
        y + 30
      );
      doc.setTextColor(40);

      // Información específica del pastel
      doc.setFontSize(9);
      let textY = y + 37;

      // Línea
      doc.text(`Línea: ${cake.line?.line || "N/A"}`, x + 5, textY);
      textY += 5;

      // Tipo de pastel
      let tipoPastel = "";
      switch (cake.itemType) {
        case "NUMERIC":
          tipoPastel = `Número: ${cake.numberShape}`;
          break;
        case "REGULAR":
          tipoPastel = "Pastel Regular";
          break;
        case "MULTIFLOOR":
          tipoPastel = `Pastel de ${cake.floors?.length || 0} pisos`;
          break;
        case "CUPCAKE":
          tipoPastel = `Cupcakes (${cake.cupcakeQty || 1} pzs)`;
          break;
        default:
          tipoPastel = "Pastel";
      }
      doc.text(tipoPastel, x + 5, textY);
      textY += 5;

      // Sabor
      doc.text(`Sabor: ${cake.flavor?.flavor || "N/A"}`, x + 5, textY);
      textY += 5;

      // Tamaño
      doc.text(
        `Tamaño: ${cake.size?.size ? `${cake.size.size} pulgadas` : "N/A"}`,
        x + 5,
        textY
      );
      textY += 5;

      // Ingredientes
      const ingredientes = `Ingredientes: ${
        cake.ingredients?.map((i) => i.name).join(", ") || "N/A"
      }`;

      if (ingredientes.length > 30) {
        // Dividir ingredientes largos en múltiples líneas
        const lines = doc.splitTextToSize(ingredientes, width - 10);
        doc.text(lines, x + 5, textY);
      } else {
        doc.text(ingredientes, x + 5, textY);
      }

      // Fecha de impresión
      doc.setFontSize(6);
      doc.setTextColor(100);
      doc.text(
        `Impreso: ${format(new Date(), "PPpp", { locale: es })}`,
        x + 5,
        y + height - 5
      );
    }

    function generarEtiquetaPiso(
      doc,
      pedido,
      cake,
      floor,
      pisoNum,
      x,
      y,
      width,
      height,
      counter
    ) {
      // Marco de la etiqueta
      doc.setDrawColor(200);
      doc.rect(x, y, width, height);

      // Logo
      doc.addImage(Logo, "PNG", x + 5, y + 5, 15, 15);

      // Información del pedido
      doc.setFontSize(10);
      doc.setTextColor(40);
      doc.setFont("helvetica", "bold");
      doc.text(`Etiqueta #${counter}`, x + 25, y + 10);

      doc.setFont("helvetica", "normal");
      doc.text(`Pedido: #${pedido.id}`, x + 25, y + 15);
      doc.text(`Cliente: ${pedido.client?.fullName || "N/A"}`, x + 25, y + 20);
      doc.text(
        `Recolección: ${format(new Date(pedido.pickupDate), "PPpp", {
          locale: es,
        })}`,
        x + 25,
        y + 25
      );

      // Alergias
      if (pedido.caution) {
        doc.setTextColor(231, 76, 60);
      } else {
        doc.setTextColor(40, 40, 40);
      }

      doc.text(
        `Alergias: ${pedido.caution ? "SÍ - PRECAUCIÓN" : "NO"}`,
        x + 25,
        y + 30
      );
      doc.setTextColor(40);

      // Información específica del piso
      doc.setFontSize(9);
      let textY = y + 37;

      // Línea
      doc.text(`Línea: ${cake.line?.line || "N/A"}`, x + 5, textY);
      textY += 5;

      // Tipo de pastel
      doc.text(`Pastel Multinivel - Piso ${pisoNum}`, x + 5, textY);
      textY += 5;

      // Sabor
      doc.text(`Sabor: ${floor.flavor?.name || "N/A"}`, x + 5, textY);
      textY += 5;

      // Tamaño
      doc.text(
        `Tamaño: ${floor.size?.name ? `${floor.size.name} pulgadas` : "N/A"}`,
        x + 5,
        textY
      );
      textY += 5;

      // Ingredientes
      const ingredientes = `Ingredientes: ${
        floor.ingredients?.map((i) => i.name).join(", ") || "N/A"
      }`;

      if (ingredientes.length > 30) {
        // Dividir ingredientes largos en múltiples líneas
        const lines = doc.splitTextToSize(ingredientes, width - 10);
        doc.text(lines, x + 5, textY);
      } else {
        doc.text(ingredientes, x + 5, textY);
      }

      // Fecha de impresión
      doc.setFontSize(6);
      doc.setTextColor(100);
      doc.text(
        `Impreso: ${format(new Date(), "PPpp", { locale: es })}`,
        x + 5,
        y + height - 5
      );
    }

    function actualizarPosicion() {
      itemCounter++;
      currentCol++;
      if (currentCol >= labelsPerRow) {
        currentCol = 0;
        currentRow++;
      }
    }

    doc.save(
      `etiquetas_pasteles_${format(new Date(), "yyyy-MM-dd", {
        locale: es,
      })}.pdf`
    );
  };

  return (
    <button
      onClick={generarEtiquetas}
      className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      disabled={pedidosSeleccionados.length === 0}
    >
      Generar Etiquetas para Pasteles
    </button>
  );
};

export default EtiquetasPedidos;
