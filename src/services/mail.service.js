import { mailTransporter } from "../config/mail.js";

class MailService {
    async sendPurchaseMail({ to, ticket, rejectedProducts }) {
        const rejectedText =
            rejectedProducts.length > 0
                ? rejectedProducts.join(", ")
                : "Ninguno";

        await mailTransporter.sendMail({
            from: `"Ecommerce Backend" <${process.env.MAIL_USER}>`,
            to,
            subject: "Compra realizada con éxito",
            html: `
                <h2>¡Gracias por tu compra!</h2>
                <p><strong>Código de ticket:</strong> ${ticket.code}</p>
                <p><strong>Fecha:</strong> ${ticket.purchase_datetime}</p>
                <p><strong>Total:</strong> $${ticket.amount}</p>
                <p><strong>Productos no procesados:</strong> ${rejectedText}</p>
            `
        });
    }
}

export default new MailService();