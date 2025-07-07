import jsPDF from "jspdf";
import Logo from "../../Assets/logo1.png";

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
      title: `Etiquetas de Pasteles - ${new Date().toLocaleDateString()}`,
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
      // Procesar cada item del pedido
      pedido.items.forEach((item) => {
        // Para items numéricos, generar una etiqueta por cada dígito
        if (item.type === "numeric") {
          item.digits.forEach((digit) => {
            if (itemCounter > 0 && itemCounter % 4 === 0) {
              doc.addPage();
              currentRow = 0;
              currentCol = 0;
            }

            generarEtiquetaIndividual(
              doc,
              pedido,
              item,
              digit,
              currentCol * (labelWidth + gap) + margin,
              currentRow * labelHeight + margin,
              labelWidth,
              labelHeight,
              itemCounter + 1
            );

            actualizarPosicion();
          });
        }
        // Para otros tipos de items, generar una etiqueta por item
        else {
          if (itemCounter > 0 && itemCounter % 4 === 0) {
            doc.addPage();
            currentRow = 0;
            currentCol = 0;
          }

          generarEtiquetaIndividual(
            doc,
            pedido,
            item,
            null,
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
      item,
      digit,
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
      doc.text(`Cliente: ${pedido.customerId}`, x + 25, y + 15);
      doc.text(
        `Recolección: ${new Date(pedido.pickupDateTime).toLocaleString()}`,
        x + 25,
        y + 20
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
        y + 25
      );
      doc.setTextColor(40);

      // Información específica del pastel
      doc.setFontSize(9);
      let textY = y + 32;

      // Línea
      doc.text(`Línea: ${item.line.name}`, x + 5, textY);
      textY += 5;

      // Tipo de pastel
      let tipoPastel = "";
      if (item.type === "numeric") {
        tipoPastel = `Número: ${digit.digit}`;
      } else if (item.type === "regular") {
        tipoPastel = "Pastel Regular";
      } else if (item.type === "tiered") {
        tipoPastel = `Pastel de ${item.tiers.length} pisos`;
      } else if (item.type === "cupcakes") {
        tipoPastel = `Cupcakes (${item.quantity} pzs)`;
      }
      doc.text(tipoPastel, x + 5, textY);
      textY += 5;

      // Sabor
      let sabor = "";
      if (item.type === "numeric") {
        sabor = `Sabor: ${digit.flavor.name}`;
      } else if (item.type === "regular") {
        sabor = `Sabor: ${item.flavor.name}`;
      } else if (item.type === "tiered") {
        sabor =
          "Sabores: " + item.tiers.map((tier) => tier.flavor.name).join(", ");
      } else if (item.type === "cupcakes") {
        sabor = `Sabor: ${item.flavor.name}`;
      }
      doc.text(sabor, x + 5, textY);
      textY += 5;

      // Tamaño
      let tamano = "";
      if (item.type === "numeric") {
        tamano = `Tamaño: ${digit.size.name}"`;
      } else if (item.type === "regular") {
        tamano = `Tamaño: ${item.size.name}`;
      } else if (item.type === "tiered") {
        tamano =
          "Tamaños: " + item.tiers.map((tier) => tier.size.name).join(", ");
      } else if (item.type === "cupcakes") {
        tamano = "Tamaño: Cupcake";
      }
      doc.text(tamano, x + 5, textY);
      textY += 5;

      // Ingredientes
      let ingredientes = "Ingredientes: ";
      if (item.type === "numeric") {
        ingredientes += digit.flavor.ingredients.map((i) => i.name).join(", ");
      } else if (item.type === "regular") {
        ingredientes += item.flavor.ingredients.map((i) => i.name).join(", ");
      } else if (item.type === "tiered") {
        ingredientes += item.tiers
          .flatMap((tier) => tier.flavor.ingredients.map((i) => i.name))
          .filter((v, i, a) => a.indexOf(v) === i) // Eliminar duplicados
          .join(", ");
      } else if (item.type === "cupcakes") {
        ingredientes += item.flavor.ingredients.map((i) => i.name).join(", ");
      }

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
        `Impreso: ${new Date().toLocaleString()}`,
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

    doc.save(`etiquetas_pasteles_${new Date().toISOString().slice(0, 10)}.pdf`);
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
