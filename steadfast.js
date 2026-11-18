export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ status: 405, message: 'Method Not Allowed' });
  }

  const { action, payload } = req.body;
  const apiKey = process.env.STEADFAST_API_KEY;
  const secretKey = process.env.STEADFAST_SECRET_KEY;

  if (!apiKey || !secretKey) {
    return res.status(500).json({
      status: 500,
      message: 'Vercel Environment Variables-এ STEADFAST_API_KEY এবং STEADFAST_SECRET_KEY সেট করা নেই!'
    });
  }

  const headers = {
    'Api-Key': apiKey,
    'Secret-Key': secretKey,
    'Content-Type': 'application/json'
  };

  try {
    if (action === 'create_order') {
      const response = await fetch('https://portal.packzy.com/api/v1/create_order', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      return res.status(200).json(data);
    }

    if (action === 'check_status') {
      const response = await fetch(`https://portal.packzy.com/api/v1/status_by_cid/${payload.consignment_id}`, {
        method: 'GET',
        headers
      });
      const data = await response.json();
      return res.status(200).json(data);
    }

    return res.status(400).json({ status: 400, message: 'Invalid action' });
  } catch (error) {
    return res.status(500).json({ status: 500, message: error.message });
  }
}
