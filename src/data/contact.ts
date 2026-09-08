export const whatsapp = 'https://wa.me/524775666074';
export const productInquiry = (name: string) => `${whatsapp}?text=${encodeURIComponent(`Hola, me interesa el producto ${name}. ¿Podrían darme información y una cotización?`)}`;
