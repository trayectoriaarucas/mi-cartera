import { jsPDF } from 'jspdf';

export const exportToPDF = (transactions, userName = 'Cristian') => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const now = new Date();
  const dateFormatted = now.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  // Calculate totals
  let totalIn = 0;
  let totalOut = 0;
  transactions.forEach((t) => {
    const amt = parseFloat(t.amount) || 0;
    if (t.type === 'income') totalIn += amt;
    else totalOut += amt;
  });
  const balance = totalIn - totalOut;

  // Header Colors & Style
  doc.setFillColor(9, 13, 22); // Dark slate
  doc.rect(0, 0, 210, 42, 'F');

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('Mi Cartera — Informe Financiero', 14, 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(148, 163, 184);
  doc.text(`Generado el ${dateFormatted} | Titular: ${userName}`, 14, 26);
  doc.text('Registro personal privado y offline', 14, 32);

  // Summary box
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(14, 48, 182, 22, 3, 3, 'F');

  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text('TOTAL COBRADO', 20, 56);
  doc.text('TOTAL GASTADO', 80, 56);
  doc.text('SALDO RESULTANTE', 140, 56);

  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(16, 185, 129); // Green
  doc.text(`+${totalIn.toFixed(2)} EUR`, 20, 64);

  doc.setTextColor(225, 29, 72); // Rose
  doc.text(`-${totalOut.toFixed(2)} EUR`, 80, 64);

  if (balance >= 0) {
    doc.setTextColor(13, 148, 136); // Teal
  } else {
    doc.setTextColor(225, 29, 72);
  }
  doc.text(`${balance >= 0 ? '+' : ''}${balance.toFixed(2)} EUR`, 140, 64);

  // Table header
  let y = 80;
  doc.setFillColor(15, 23, 42);
  doc.rect(14, y, 182, 8, 'F');

  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text('FECHA Y HORA', 18, y + 5.5);
  doc.text('CONCEPTO', 60, y + 5.5);
  doc.text('METODO', 125, y + 5.5);
  doc.text('IMPORTE', 170, y + 5.5);

  y += 10;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);

  transactions.forEach((tx, index) => {
    if (y > 275) {
      doc.addPage();
      y = 20;
    }

    // Row alternating background
    if (index % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(14, y - 4, 182, 7, 'F');
    }

    let dateText = '';
    try {
      const d = new Date(tx.date);
      dateText = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
    } catch (e) {
      dateText = tx.date || '';
    }

    doc.setTextColor(51, 65, 85);
    doc.text(dateText, 18, y);

    const titleText = (tx.title || 'Movimiento').slice(0, 32);
    doc.text(titleText, 60, y);

    doc.text(tx.paymentMethod || 'Tarjeta', 125, y);

    if (tx.type === 'income') {
      doc.setTextColor(16, 185, 129);
      doc.setFont('helvetica', 'bold');
      doc.text(`+${parseFloat(tx.amount).toFixed(2)} EUR`, 170, y);
    } else {
      doc.setTextColor(225, 29, 72);
      doc.setFont('helvetica', 'bold');
      doc.text(`-${parseFloat(tx.amount).toFixed(2)} EUR`, 170, y);
    }
    doc.setFont('helvetica', 'normal');

    y += 7.5;
  });

  const nowStr = now.toISOString().split('T')[0];
  doc.save(`MiCartera_Informe_${nowStr}.pdf`);
};
