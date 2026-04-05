import nodemailer from 'nodemailer';

const isEmailEnabled = () =>
  process.env.EMAIL_ENABLED === 'true' &&
  !!process.env.SMTP_HOST &&
  !!process.env.SMTP_PORT &&
  !!process.env.SMTP_USER &&
  !!process.env.SMTP_PASS;

const getTransporter = () => {
  if (!isEmailEnabled()) {
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
    minimumFractionDigits: 2,
  }).format(Number(amount) || 0);

const buildOrderEmail = ({ customerName, order }) => {
  const itemLines = (order.items || [])
    .map(
      (item) =>
        `- ${item.title || `Book #${item.bookId}`} x ${item.quantity}: ${formatCurrency(item.lineTotal)}`
    )
    .join('\n');

  return {
    subject: `ReadVibe Order Confirmation #${order.id}`,
    text: `Hello ${customerName || 'Reader'},

Thank you for your order with ReadVibe.

Order ID: ${order.id}
Status: ${order.status}
Subtotal: ${formatCurrency(order.subtotal)}
Shipping: ${formatCurrency(order.shippingCost)}
Tax: ${formatCurrency(order.tax)}
Total: ${formatCurrency(order.total)}

Items:
${itemLines}

We will notify you again when your order status changes.

ReadVibe`,
  };
};

export const sendOrderConfirmationEmail = async ({
  to,
  customerName,
  order,
}) => {
  if (!to || !order) return { skipped: true };

  const emailContent = buildOrderEmail({ customerName, order });
  const from = process.env.EMAIL_FROM || process.env.SMTP_USER || 'noreply@readvibe.com';
  const transporter = getTransporter();

  if (!transporter) {
    console.log('Email disabled. Order confirmation not sent.', {
      to,
      orderId: order.id,
    });
    return { skipped: true };
  }

  const info = await transporter.sendMail({
    from,
    to,
    subject: emailContent.subject,
    text: emailContent.text,
  });

  return { sent: true, messageId: info.messageId };
};
