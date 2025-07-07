import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Logo from "../../Assets/logo1.png";

const ReporteDetallado = ({ pedidosSeleccionados }) => {
  const generarPDF = () => {
    if (pedidosSeleccionados.length === 0) {
      alert("Por favor selecciona al menos un pedido");
      return;
    }

    const doc = new jsPDF();

    // Configuración inicial
    doc.setProperties({
      title: `Reporte Detallado de Pedidos - ${new Date().toLocaleDateString()}`,
      subject: "Reporte de pedidos",
      author: "Pastelería",
      keywords: "pedidos, reporte, pasteles",
      creator: "Sistema de Pastelería",
    });

    // Agregar logo
    doc.addImage(Logo, "PNG", 10, 10, 30, 30);

    // Título
    doc.setFontSize(18);
    doc.setTextColor(40);
    doc.setFont("helvetica", "bold");
    doc.text("Reporte Detallado de Pedidos", 105, 20, { align: "center" });

    // Fecha de generación
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100);
    doc.text(`Generado el: ${new Date().toLocaleString()}`, 105, 30, {
      align: "center",
    });

    let yPos = 50;

    pedidosSeleccionados.forEach((pedido, index) => {
      // Encabezado del pedido
      doc.setFontSize(14);
      doc.setTextColor(40);
      doc.setFont("helvetica", "bold");
      doc.text(`Pedido #${index + 1}`, 14, yPos);

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      yPos += 7;
      doc.text(`Cliente: ${pedido.customerId}`, 14, yPos);
      yPos += 7;
      doc.text(
        `Fecha de creación: ${new Date(pedido.createdat).toLocaleString()}`,
        14,
        yPos
      );
      yPos += 7;
      doc.text(
        `Fecha de recolección: ${new Date(
          pedido.pickupDateTime
        ).toLocaleString()}`,
        14,
        yPos
      );
      yPos += 7;
      doc.text(
        `Alergias: ${pedido.caution ? "SÍ - PRECAUCIÓN" : "NO"}`,
        14,
        yPos
      );
      yPos += 7;
      doc.text(`Notas: ${pedido.notes || "Ninguna"}`, 14, yPos);
      yPos += 7;
      doc.text(`Dedicatoria: ${pedido.writing || "Ninguna"}`, 14, yPos);
      yPos += 10;

      // Tabla de items
      const headers = [
        { title: "Tipo", dataKey: "tipo" },
        { title: "Línea", dataKey: "linea" },
        { title: "Sabor", dataKey: "sabor" },
        { title: "Tamaño", dataKey: "tamaño" },
        { title: "Ingredientes", dataKey: "ingredientes" },
        { title: "Cantidad", dataKey: "cantidad" },
      ];

      const rows = [];

      pedido.items.forEach((item) => {
        if (item.type === "numeric") {
          item.digits.forEach((digit) => {
            rows.push({
              tipo: "Número " + digit.digit,
              linea: item.line.name,
              sabor: digit.flavor.name,
              tamaño: digit.size.name,
              ingredientes: digit.flavor.ingredients
                .map((i) => i.name)
                .join(", "),
              cantidad: "1",
            });
          });
        } else if (item.type === "regular") {
          rows.push({
            tipo: "Regular",
            linea: item.line.name,
            sabor: item.flavor.name,
            tamaño: item.size.name,
            ingredientes: item.flavor.ingredients.map((i) => i.name).join(", "),
            cantidad: "1",
          });
        } else if (item.type === "tiered") {
          item.tiers.forEach((tier, i) => {
            rows.push({
              tipo: `Piso ${i + 1}`,
              linea: item.line.name,
              sabor: tier.flavor.name,
              tamaño: tier.size.name,
              ingredientes: tier.flavor.ingredients
                .map((i) => i.name)
                .join(", "),
              cantidad: "1",
            });
          });
        } else if (item.type === "cupcakes") {
          rows.push({
            tipo: "Cupcakes",
            linea: item.line.id,
            sabor: item.flavor.name,
            tamaño: "N/A",
            ingredientes: item.flavor.ingredients.map((i) => i.name).join(", "),
            cantidad: item.quantity,
          });
        }
      });

      autoTable(doc, {
        startY: yPos,
        head: [headers.map((h) => h.title)],
        body: rows.map((row) => headers.map((h) => row[h.dataKey])),
        margin: { left: 14 },
        styles: {
          fontSize: 8,
          cellPadding: 3,
          overflow: "linebreak",
        },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: "bold",
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
        columnStyles: {
          ingredientes: { cellWidth: "wrap" },
        },
      });

      yPos = doc.lastAutoTable.finalY + 10;

      // Salto de página si no es el último pedido
      if (index < pedidosSeleccionados.length - 1) {
        doc.addPage();
        yPos = 20;
      }
    });

    doc.save(`reporte_pedidos_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  return (
    <button
      onClick={generarPDF}
      className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      disabled={pedidosSeleccionados.length === 0}
    >
      Reporte Detallado
    </button>
  );
};

export default ReporteDetallado;
