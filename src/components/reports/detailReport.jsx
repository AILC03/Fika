import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Logo from "../../Assets/logo1.png";
import { format } from "date-fns";
import es from "date-fns/locale/es";

const ReporteDetallado = ({ pedidosSeleccionados }) => {
  const generarPDF = () => {
    if (pedidosSeleccionados.length === 0) {
      alert("Por favor selecciona al menos un pedido");
      return;
    }

    const doc = new jsPDF();

    // Configuración inicial
    doc.setProperties({
      title: `Reporte Detallado de Pedidos - ${format(new Date(), "PPPP", {
        locale: es,
      })}`,
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
    doc.text(
      `Generado el: ${format(new Date(), "PPPPp", { locale: es })}`,
      105,
      30,
      {
        align: "center",
      }
    );

    let yPos = 50;

    pedidosSeleccionados.forEach((pedido, index) => {
      // Encabezado del pedido
      doc.setFontSize(14);
      doc.setTextColor(40);
      doc.setFont("helvetica", "bold");
      doc.text(`Pedido #${pedido.id}`, 14, yPos);

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      yPos += 7;
      doc.text(`Cliente: ${pedido.client?.fullName || "N/A"}`, 14, yPos);
      yPos += 7;
      doc.text(`Teléfono: ${pedido.client?.phone || "N/A"}`, 14, yPos);
      yPos += 7;
      doc.text(
        `Fecha de creación: ${format(new Date(pedido.createdAt), "PPPPp", {
          locale: es,
        })}`,
        14,
        yPos
      );
      yPos += 7;
      doc.text(
        `Fecha de recolección: ${format(new Date(pedido.pickupDate), "PPPPp", {
          locale: es,
        })}`,
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

      pedido.cakes.forEach((item) => {
        const baseRow = {
          tipo: "",
          linea: item.line?.line || "N/A",
          sabor: item.flavor?.flavor || "N/A",
          tamaño: item.size?.size ? `${item.size.size} pulgadas` : "N/A",
          ingredientes:
            item.ingredients?.map((i) => i.name).join(", ") || "N/A",
          cantidad: "1",
        };

        switch (item.itemType) {
          case "NUMERIC":
            rows.push({
              ...baseRow,
              tipo: `Número ${item.numberShape}`,
            });
            break;
          case "REGULAR":
            rows.push({
              ...baseRow,
              tipo: "Regular",
            });
            break;
          case "MULTIFLOOR":
          case "TIERED":
          case "PISO":
          case "PISOS":
            item.floors?.forEach((floor, i) => {
              rows.push({
                linea: item.line?.line || "N/A",
                sabor: floor.flavor?.name || "N/A",
                tamaño: floor.size?.name
                  ? `${floor.size.name} pulgadas`
                  : "N/A",
                ingredientes:
                  floor.ingredients?.map((i) => i.name).join(", ") || "N/A",
                tipo: `Piso ${i + 1}`,
                cantidad: "1",
              });
            });
            break;
          case "CUPCAKE":
            rows.push({
              ...baseRow,
              tipo: "Cupcakes",
              cantidad: item.cupcakeQty || "1",
            });
            break;
          default:
            rows.push({
              ...baseRow,
              tipo: "Otro",
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

      // Responsables del pedido
      yPos = doc.lastAutoTable.finalY + 10;
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Responsables:", 14, yPos);
      yPos += 7;

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      pedido.orderUser?.forEach((orderUser) => {
        doc.text(
          `• ${orderUser.user?.name || "N/A"} (${
            orderUser.user?.rol || "N/A"
          })`,
          20,
          yPos
        );
        yPos += 7;
      });

      // Salto de página si no es el último pedido
      if (index < pedidosSeleccionados.length - 1) {
        doc.addPage();
        yPos = 20;
      }
    });

    doc.save(
      `reporte_pedidos_${format(new Date(), "yyyy-MM-dd", { locale: es })}.pdf`
    );
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
