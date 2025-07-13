# Product Creation Feature

## Overview
This feature allows users to create and list new products for sale in the second-hand market application. **Authentication is required** to create products.

## Authentication Requirements

### 🔐 **Login Required for Product Creation**
- Users must be logged in to create new products
- Unauthenticated users are redirected to login page
- After successful login, users are redirected back to product creation page

### 🔐 **Login Required for Contacting Sellers**
- Users must be logged in to contact sellers
- Unauthenticated users see "Login to Contact" button
- Clicking contact buttons redirects to login page

## Components

### 1. ProductCreate Page (`src/pages/ProductCreate.tsx`)
- **Purpose**: Main form page for creating new products
- **Authentication**: Protected route - requires login
- **Features**:
  - Product title input (3-100 characters)
  - Description textarea (10-1000 characters)
  - Price input with decimal precision
  - Image upload (up to 8 images)
  - Form validation
  - Loading states and error handling

### 2. ProtectedRoute Component (`src/components/ProtectedRoute.tsx`)
- **Purpose**: Wraps routes that require authentication
- **Features**:
  - Checks for valid authentication token
  - Redirects to login page if not authenticated
  - Preserves intended destination for post-login redirect

### 3. ProductCard Component (`src/components/ProductCard.tsx`)
- **Purpose**: Displays product information in a card format
- **Features**:
  - Product image display
  - Title, description, and price
  - Status tags (Available, Reserved, Sold)
  - Dynamic action buttons based on auth status
  - "Contact Seller" for logged-in users
  - "Login to Contact" for guests

### 4. Home Page (`src/pages/Home.tsx`)
- **Purpose**: Main landing page showing all products
- **Features**:
  - Product grid display
  - "Sell Your Item" button (requires login)
  - "Login" button for guests
  - Refresh functionality
  - Loading and error states
  - Authentication-aware empty state

## Authentication Flow

### Creating a Product (Unauthenticated User)
1. User clicks "Sell Your Item" button
2. System shows "Please log in to sell items" message
3. User is redirected to login page with return URL
4. After successful login, user is redirected to product creation form
5. User can now create and submit their product

### Contacting a Seller (Unauthenticated User)
1. User clicks "Contact Seller" button
2. System shows "Please log in to contact sellers" message
3. User is redirected to login page
4. After login, user can contact sellers

### Navigation Changes
- **Logged In Users**: See "Sell Item", "Profile", and "Logout" buttons
- **Guest Users**: See "Login" and "Register" buttons
- "Sell Item" button is only visible to authenticated users

## API Integration

### Product API Service (`src/services/productApi.ts`)
```typescript
interface CreateProductRequest {
  title: string;
  description: string;
  price: number;
  images: File[];
}

// Create product with image upload (requires auth token)
export const createProductApi = async (data: CreateProductRequest): Promise<Product>
```

### State Management (`src/store/product.ts`)
- Uses Zustand for state management
- Handles product creation, listing, and error states
- Provides loading indicators

### Authentication Store (`src/store/auth.ts`)
- Manages user authentication state
- Stores user token and profile information
- Provides login/logout methods

## Routes
- `/` - Home page (product listing)
- `/login` - Login page
- `/register` - Registration page
- `/product/new` - Product creation form (protected)

## Usage

### For Authenticated Users
1. Navigate to `/product/new` or click "Sell Item" button
2. Fill in the form:
   - **Title**: Descriptive product name (3-100 chars)
   - **Description**: Detailed product information (10-1000 chars)
   - **Price**: Product price in dollars
   - **Images**: Upload up to 8 product images
3. Click "Create Product" to submit
4. Success redirects to `/my-products` (to be implemented)

### For Guest Users
1. Click "Sell Your Item" button
2. System prompts to log in
3. Complete login/registration process
4. Automatically redirected to product creation form

### Viewing Products
1. Navigate to home page `/`
2. Products are displayed in a responsive grid
3. Click "View Details" to see full product information
4. Click "Contact Seller" (requires login) to initiate conversation

## Technical Details

### Form Validation
- Title: Required, 3-100 characters
- Description: Required, 10-1000 characters
- Price: Required, positive number
- Images: At least one image required

### Authentication Checks
- Protected routes use `ProtectedRoute` component
- API calls include authentication headers
- UI adapts based on authentication status
- Graceful redirects for unauthenticated actions

### Image Upload
- Uses Ant Design Upload component
- Supports multiple image selection
- Prevents auto-upload (handled on form submit)
- Accepts only image files
- Maximum 8 images per product

### Error Handling
- Form validation errors
- API error responses
- Network errors
- Authentication errors
- User-friendly error messages

### Responsive Design
- Mobile-friendly layout
- Responsive product grid
- Adaptive navigation based on auth status

## Dependencies
- React 18.2.0
- React Router DOM 6.21.1
- Ant Design 5.13.7
- Zustand 4.4.0
- Axios 1.6.8

## Future Enhancements
- Product categories
- Location-based filtering
- Advanced search
- Product editing
- Image cropping/editing
- Draft saving
- Bulk image upload
- User ratings and reviews
- Seller verification 