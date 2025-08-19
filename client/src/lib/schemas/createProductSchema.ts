import z from "zod";

const fileSchema = z.instanceof(File).refine(file => file.size > 0, {
  message: "A file must be uploaded"
}).transform(file => ({
  ...file,
  preview: URL.createObjectURL(file)
}))

export const createProductSchema = z.object({
  name: z.string({required_error: "Name of product is required"}),
  description: z.string({required_error: "Description of product is required"}).min(10, {
    message: "Description must be at least 10 characters"
  }),
  price: z.coerce.number({required_error: "Price of product is required"}).min(1, {
    message: "Price must be at least £0.01"
  }),
  type: z.string({required_error: "Type of product is required"}),
  brand: z.string({required_error: "Brand of product is required"}),
  quantityInStock: z.coerce.number({required_error: "Quantity in stock is required"}).min(1, {
    message: "Quantity in stock must be at least 1"
  }),
  imageUrl: z.string().optional(),
  file: fileSchema.optional()
}).refine((data) => data.imageUrl || data.file, {
  message: "Please provide an image",
  path: ["file"]
});

export type CreateProductSchema = z.infer<typeof createProductSchema>;