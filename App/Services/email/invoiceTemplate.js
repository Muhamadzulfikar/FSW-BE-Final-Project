const invoiceTemplate = (invoiceNumber, date, className, price, ppn, total) => `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SkillHUB Invoice</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f4f4f4;
        }

        .invoice-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #fff;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            padding: 20px;
            border-radius: 8px;
        }

        .invoice-header {
            text-align: center;
            margin-bottom: 20px;
        }

        .invoice-header h1 {
            color: #333;
        }

        .invoice-details {
            margin-bottom: 20px;
        }

        .invoice-details p {
            margin: 5px 0;
        }

        .invoice-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }

        .invoice-table th, .invoice-table td {
            border: 1px solid #ddd;
            padding: 10px;
            text-align: left;
        }

        .invoice-table th {
            background-color: #f2f2f2;
        }

        .invoice-total {
            text-align: right;
        }

        .invoice-footer {
            margin-top: 20px;
            text-align: center;
        }

        .invoice-footer p {
            color: #888;
        }
    </style>
</head>
<body>

    <div class="invoice-container">
        <div class="invoice-header">
            <h1>Invoice</h1>
        </div>

        <div class="invoice-details">
            <p><strong$>Nomor Invoice:</strong${invoiceNumber}</p>
            <p><strong>Tanggal:</strong>${date}</p>
            <p><strong>Keterangan:</strong> Pembayaran untuk kelas ${className}</p>
        </div>

        <table class="invoice-table">
            <thead>
                <tr>
                    <th>Deskripsi</th>
                    <th>Jumlah</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Harga Kelas</td>
                    <td>Rp.${price}</td>
                </tr>
                <tr>
                    <td>Pajak</td>
                    <td>Rp.${ppn}</td>
                </tr>
            </tbody>
        </table>

        <div class="invoice-total">
            <p><strong>Total:</strong>${total}</p>
        </div>

        <div class="invoice-footer">
            <p>Terima kasih telah membeli kelas di SkillHUB!</p>
        </div>
    </div>

</body>
</html>
`;
module.exports = invoiceTemplate;
