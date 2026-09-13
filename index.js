require('dotenv').config();
const express = require('express');
const sgMail = require('@sendgrid/mail');

const app = express();
app.use(express.json());
app.use(express.static('public')); // Serves files from public/ folder

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.post('/api/send-email', async (req, res) => {
    const { to, subject, message } = req.body;

    const msg = {
        to,
        from: process.env.VERIFIED_SENDER,
        subject,
        text: message,
    };

    try {
        await sgMail.send(msg);
        res.json({ success: true, message: 'Email sent successfully!' });
    } catch (error) {
        res.status(500).json({ error: error.response?.body?.errors[0]?.message || 'Failed to send' });
    }
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));