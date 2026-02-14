import { z } from 'zod';

export const shippingAddressSchema = z.object({
    street: z.string().min(5, 'Street address must be at least 5 characters'),
    city: z.string().min(2, 'City must be at least 2 characters'),
    state: z.string().min(2, 'State must be at least 2 characters'),
    zipCode: z.string().regex(/^\d{5,6}$/, 'Please enter a valid ZIP code'),
    country: z.string().min(2, 'Country must be at least 2 characters'),
});

// This ensures the inferred type matches ShippingAddress exactly
export type ShippingAddressFormData = z.infer<typeof shippingAddressSchema>;
