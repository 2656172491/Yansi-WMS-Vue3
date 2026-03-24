// src/types/wms.ts

export type Product = {
    id: string;
    name: string;
    category: string;
    price: number;
};

export type Alert = {
    id: string;
    message: string;
    type: 'info' | 'warning' | 'error';
};

export type FormData = {
    productId: string;
    quantity: number;
    date: Date;
};

export type StatCard = {
    title: string;
    value: number;
};