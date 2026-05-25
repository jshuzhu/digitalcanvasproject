export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { order_id, email, total_amount, phone, name } = req.body;

  const TOYYIBPAY_SECRET = 'a1v7x5ah-np0i-gavv-f7lq-3pv9lo55dznt';
  const TOYYIBPAY_CATEGORY = '27w36y3k'; 
  const TOYYIBPAY_URL = 'https://toyyibpay.com/index.php/api/createBill';

  const formData = new URLSearchParams();
  formData.append('userSecretKey', TOYYIBPAY_SECRET);
  formData.append('categoryCode', TOYYIBPAY_CATEGORY);
  formData.append('billName', `Order ${order_id}`);
  formData.append('billDescription', 'Pembayaran Simple is More');
  formData.append('billPriceSetting', 1);
  formData.append('billPayorInfo', 1);
  formData.append('billAmount', Math.round(total_amount * 100)); 
  
  formData.append('billReturnUrl', `http://localhost:3000/success?order_id=${order_id}`);
  formData.append('billCallbackUrl', `http://localhost:3000/api/payment-callback`);
  
  formData.append('billExternalReferenceNo', order_id);
  formData.append('billTo', name || 'Customer');
  formData.append('billEmail', email);
  formData.append('billPhone', phone || '0123456789');

  try {
    // Perangkap 1: Semak jika fetch disokong oleh Node.js
    if (typeof fetch === 'undefined') {
      return res.status(500).json({ error: 'Versi Node.js di PC ini terlalu lama. Sila update ke Node v18+.' });
    }

    const response = await fetch(TOYYIBPAY_URL, {
      method: 'POST',
      body: formData,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    
    // Perangkap 2: Baca sebagai teks terlebih dahulu
    const textResponse = await response.text();
    
    try {
      const data = JSON.parse(textResponse);
      
      if (data && data[0] && data[0].BillCode) {
        const paymentUrl = `https://toyyibpay.com/${data[0].BillCode}`;
        return res.status(200).json({ success: true, paymentUrl, billCode: data[0].BillCode });
      } else {
        // Jika ToyyibPay menolak request (contoh: Category Code salah)
        return res.status(400).json({ success: false, error: 'ToyyibPay Error: ' + textResponse });
      }
    } catch (parseError) {
      // Jika ToyyibPay hantar HTML (server down/maintenance)
      return res.status(500).json({ success: false, error: 'Data dari ToyyibPay bukan JSON: ' + textResponse });
    }

  } catch (error) {
    return res.status(500).json({ success: false, error: error.message || 'Ralat pelayan Vercel.' });
  }
}