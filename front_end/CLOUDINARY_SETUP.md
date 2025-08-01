<!-- @format -->

# Cloudinary Setup Instructions

This application uses Cloudinary for image uploading and management. Follow these steps to set up Cloudinary integration:

## 1. Create a Cloudinary Account

1. Go to [https://cloudinary.com/](https://cloudinary.com/)
2. Sign up for a free account
3. After registration, you'll be taken to the dashboard

## 2. Get Your Cloudinary Credentials

From your Cloudinary dashboard, you'll need:

- **Cloud Name**: Found in the "Account Details" section
- **Upload Preset**: You'll need to create this (see step 3)

## 3. Create an Upload Preset

1. In your Cloudinary dashboard, go to Settings → Upload
2. Scroll down to "Upload presets"
3. Click "Add upload preset"
4. Configure the preset:
   - **Preset name**: Choose a name (e.g., "product_images")
   - **Signing Mode**: Select "Unsigned" for frontend uploads
   - **Folder**: Set to "products" (optional, for organization)
   - **Allowed formats**: jpg, jpeg, png, gif, webp
   - **Max file size**: 10 MB (or your preference)
5. Save the preset

## 4. Environment Configuration

1. Copy `.env.example` to `.env`:

   ```bash
   cp .env.example .env
   ```

2. Update the `.env` file with your Cloudinary credentials:
   ```env
   REACT_APP_CLOUDINARY_CLOUD_NAME=your_actual_cloud_name
   REACT_APP_CLOUDINARY_UPLOAD_PRESET=your_actual_upload_preset_name
   ```

## 5. Features

The Cloudinary integration provides:

- **Image Upload**: Drag and drop or click to upload multiple images
- **Image Preview**: See uploaded images with thumbnails
- **Image Management**: Remove uploaded images before submission
- **Optimization**: Automatic image optimization and format conversion
- **Validation**: File size and format validation
- **Progress Indicators**: Visual feedback during uploads

## 6. Usage

In the Add Product form:

1. Click "Upload Images" or drag and drop image files
2. Wait for upload completion (progress indicators will show)
3. Review uploaded images in the preview grid
4. Remove any unwanted images using the delete button
5. Submit the form - image URLs will be saved with the product

## 7. Troubleshooting

**Upload fails with "Upload failed" error:**

- Check your cloud name and upload preset are correct
- Ensure the upload preset is set to "Unsigned"
- Verify your internet connection

**Images not displaying:**

- Check that the image URLs are being saved correctly
- Verify the cloud name in your configuration

**File size errors:**

- Default max size is 10MB
- Adjust in `src/config/cloudinary.ts` if needed

## 8. Security Notes

- Upload presets are set to "unsigned" for frontend uploads
- For production, consider implementing backend validation
- Monitor your Cloudinary usage to stay within plan limits
- Set up auto-moderation if handling user-generated content

## 9. Customization

You can customize the upload behavior in:

- `src/config/cloudinary.ts` - Configuration and validation
- `src/services/cloudinaryService.ts` - Upload logic
- `src/components/common/CloudinaryImageUpload.tsx` - UI component
