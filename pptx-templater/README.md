# PPTX Templater

One-click PowerPoint personalization tool that lets users upload a Microsoft PowerPoint template, customize it with their data (company name, date, logo), and instantly download a personalized deck.

## 🚀 Features

- **Drag & Drop Upload**: Easy PPTX file upload with validation (max 50MB)
- **Smart Placeholders**: Automatically replaces `{{COMPANY_NAME}}`, `{{DATE}}`, and `{{LOGO}}` placeholders
- **Live Preview**: Real-time filename preview and logo preview
- **Dark/Light Mode**: Beautiful UI with theme switching
- **Responsive Design**: Works perfectly on desktop and mobile
- **Privacy First**: Files auto-deleted after 30 seconds
- **Lightning Fast**: < 3 second processing time

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui with Radix UI primitives
- **Animations**: Framer Motion
- **File Handling**: react-dropzone
- **Icons**: Lucide React
- **Date Handling**: date-fns

## 🏃‍♂️ Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pptx-templater
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📋 How to Use

1. **Upload Template**: Drag and drop your PowerPoint (.pptx) file
2. **Fill Details**: Enter your company name, select date, and optionally upload a logo
3. **Generate**: Click "Generate Presentation" to process your template
4. **Download**: Download your customized presentation

## 🎯 Placeholder Convention

Your PowerPoint template should contain these placeholders:

- `{{COMPANY_NAME}}` - Replaced with your company name
- `{{DATE}}` - Replaced with formatted date (e.g., "24th May 2025")
- `{{LOGO}}` - Replaced with your uploaded logo image

## 🏗️ Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with theme provider
│   ├── page.tsx            # Main page
│   └── globals.css         # Global styles
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── pptx-templater.tsx  # Main application component
│   ├── file-upload.tsx     # Drag & drop file upload
│   ├── data-form.tsx       # Data input form
│   ├── processing-view.tsx # Processing animation
│   ├── download-view.tsx   # Download success screen
│   ├── header.tsx          # App header with theme toggle
│   ├── step-indicator.tsx  # Progress indicator
│   └── theme-provider.tsx  # Theme provider wrapper
└── lib/
    └── utils.ts            # Utility functions
```

## 🎨 Design System

The application follows a clean, minimalist design inspired by Y Combinator's aesthetic:

- **Typography**: Geist Sans for UI, Geist Mono for code
- **Colors**: Neutral palette with customizable primary colors
- **Spacing**: Consistent 4px grid system
- **Animations**: Subtle, purposeful motion with Framer Motion

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Adding New Components

1. Create component in `src/components/`
2. Export from component file
3. Import and use in parent components

## 🚀 Deployment

The application is ready for deployment on Vercel, Netlify, or any platform supporting Next.js:

```bash
npm run build
```

## 🔮 Future Enhancements

- **Backend Integration**: Python FastAPI service with python-pptx
- **Bulk Processing**: CSV upload for multiple presentations
- **Advanced Placeholders**: Support for tables, charts, and complex layouts
- **Cloud Storage**: AWS S3 integration with presigned URLs
- **Authentication**: User accounts and presentation history
- **API Access**: REST/GraphQL API for integrations

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Built with ❤️ for the modern presentation workflow.
